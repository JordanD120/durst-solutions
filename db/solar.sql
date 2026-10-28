-- Review and apply manually AFTER deployment approval. No existing tables change.
begin;
create schema solar_private;
revoke all on schema solar_private from public, anon, authenticated;
grant usage on schema solar_private to service_role;
create table solar_private.members (user_id uuid primary key references auth.users(id) on delete cascade, enabled boolean not null default true);
create table solar_private.worker (id boolean primary key default true check(id), session text, seen timestamptz);
insert into solar_private.worker(id) values(true);
create table solar_private.jobs (
 -- Keep running-job locks even when an Auth account is deleted. Membership
 -- revocation requests cancellation; deleting a user must not release a slot.
 id uuid primary key default gen_random_uuid(), user_id uuid not null,
 state text not null default 'queued' check(state in ('queued','running','completed','failed','cancelled')),
 created timestamptz not null default now(), started timestamptz, finished timestamptz,
 session text, cancel boolean not null default false, bundle jsonb, result jsonb, error text
);
create unique index solar_one_running on solar_private.jobs((true)) where state='running';
create unique index solar_one_pending_per_user on solar_private.jobs(user_id) where state in ('queued','running');
create index solar_jobs_owner on solar_private.jobs(user_id,created desc);
create table solar_private.limits (key text primary key, since timestamptz not null, count integer not null);
alter table solar_private.members enable row level security;
alter table solar_private.worker enable row level security;
alter table solar_private.jobs enable row level security;
alter table solar_private.limits enable row level security;
revoke all on all tables in schema solar_private from public, anon, authenticated;
grant all on all tables in schema solar_private to service_role;

create function solar_private.hit(k text, maximum integer, seconds integer) returns boolean
language plpgsql security invoker set search_path='' as $$
declare n integer;
begin
 insert into solar_private.limits as l values(k,now(),1)
 on conflict(key) do update set count=case when l.since < now()-make_interval(secs=>seconds) then 1 else l.count+1 end,
 since=case when l.since < now()-make_interval(secs=>seconds) then now() else l.since end returning count into n;
 return n<=maximum;
end $$;
revoke all on function solar_private.hit(text,integer,integer) from public,anon,authenticated;
grant execute on function solar_private.hit(text,integer,integer) to service_role;

-- Invoker privileges; only the server service role may call this function.
create function public.solar_command(action text, payload jsonb) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare uid uuid; j solar_private.jobs; w solar_private.worker; online boolean; output jsonb;
begin
 -- Serialize queue admission, worker ownership and cancellation across all instances.
 perform pg_advisory_xact_lock(439439);
 select * into w from solar_private.worker where id=true for update;
 online := coalesce(w.seen > now()-interval '20 seconds',false);
 if action='login_limit' then
   if not solar_private.hit('login-global',60,60) or not solar_private.hit('login-'||(payload->>'fingerprint'),5,900) then
     return jsonb_build_object('status',429,'error','Too many sign-in attempts. Try later.');
   end if;
   return '{}'::jsonb;
 end if;
 if action like 'worker_%' then
   if payload->>'session' !~ '^[a-f0-9]{32}$' then return jsonb_build_object('status',400,'error','Invalid session.'); end if;
   -- A live worker OR any running job prevents takeover. Never requeue an uncertain job.
   if w.session is distinct from payload->>'session' and (online or exists(select 1 from solar_private.jobs where state='running')) then
     return jsonb_build_object('status',409,'error','Worker ownership is locked.');
   end if;
   update solar_private.worker set session=payload->>'session',seen=now() where id=true;
   if action='worker_heartbeat' then
     select * into j from solar_private.jobs where state='running';
     return jsonb_build_object('cancel',coalesce(j.cancel,false) or (j.user_id is not null and not exists(select 1 from solar_private.members where user_id=j.user_id and enabled)));
   elsif action='worker_claim' then
     if exists(select 1 from solar_private.jobs where state='running') then return '{}'::jsonb; end if;
     update solar_private.jobs set state='failed',error='Job expired before starting.',bundle=null,finished=now()
       where state='queued' and (created<now()-interval '5 minutes' or not exists(select 1 from solar_private.members m where m.user_id=jobs.user_id and m.enabled));
     select * into j from solar_private.jobs where state='queued' order by created,id limit 1 for update;
     if j.id is null then return '{}'::jsonb; end if;
     update solar_private.jobs set state='running',started=now(),session=payload->>'session' where id=j.id;
     return jsonb_build_object('id',j.id,'bundle',j.bundle);
   elsif action='worker_finish' then
     select * into j from solar_private.jobs where id=(payload->>'id')::uuid and session=payload->>'session' for update;
     if j.id is null then return jsonb_build_object('status',409,'error','Job is not owned by this worker.'); end if;
     if j.state in ('completed','failed','cancelled') then return '{}'::jsonb; end if;
     if j.state <> 'running' then return jsonb_build_object('status',409,'error','Job is not running.'); end if;
     if payload->>'state' not in ('completed','failed','cancelled') or octet_length(coalesce((payload->'result')::text,''))>524288 then return jsonb_build_object('status',400,'error','Invalid result.'); end if;
     update solar_private.jobs set state=case when j.cancel then 'cancelled' else payload->>'state' end,
       result=case when j.cancel then null else payload->'result' end,
       error=case when payload->>'state'='failed' then 'Simulation failed validation or exceeded resource limits. Check your desktop project.' else null end,
       bundle=null,finished=now() where id=j.id;
     return '{}'::jsonb;
   end if;
   return jsonb_build_object('status',400,'error','Unknown worker action.');
 end if;
 uid:=(payload->>'user_id')::uuid;
 if uid is null or not exists(select 1 from solar_private.members where user_id=uid and enabled) then
   return jsonb_build_object('status',403,'error','This account has not been granted solar access.');
 end if;
 if not solar_private.hit('user-'||uid::text,90,60) then return jsonb_build_object('status',429,'error','Too many requests. Try later.'); end if;
 if action='authorize' then return '{}'::jsonb; end if;
 -- Prune on authenticated use; schedule the same cleanup daily after approval.
 delete from solar_private.jobs where state not in ('queued','running') and created<now()-interval '24 hours';
 delete from solar_private.limits where since<now()-interval '24 hours';
 if action='list' then
   select coalesce(jsonb_agg(jsonb_build_object('id',id,'state',state,'created',created) order by created desc),'[]'::jsonb)
     into output from (select * from solar_private.jobs where user_id=uid order by created desc limit 20) s;
   return jsonb_build_object('online',online,'jobs',output);
 elsif action='submit' then
   if not online then return jsonb_build_object('status',503,'error','Desktop is offline. No job was queued.'); end if;
   if (select count(*) from solar_private.jobs where state='queued')>=2 then return jsonb_build_object('status',429,'error','Queue is full. Try later.'); end if;
   if exists(select 1 from solar_private.jobs where user_id=uid and state in ('queued','running')) then return jsonb_build_object('status',409,'error','You already have an active or queued job.'); end if;
   if not solar_private.hit('submit-'||uid::text,3,3600) then return jsonb_build_object('status',429,'error','Limit of three submissions per hour.'); end if;
   if payload->'bundle'->>'bundle_version' is distinct from '1.0.0' or octet_length((payload->'bundle')::text)>3300000 then return jsonb_build_object('status',400,'error','Invalid bundle.'); end if;
   insert into solar_private.jobs(user_id,bundle) values(uid,payload->'bundle') returning * into j;
   return jsonb_build_object('id',j.id,'state',j.state);
 elsif action in ('get','cancel') then
   select * into j from solar_private.jobs where id=(payload->>'id')::uuid and user_id=uid for update;
   if j.id is null then return jsonb_build_object('status',404,'error','Job not found.'); end if;
   if action='cancel' then
     update solar_private.jobs set cancel=true,state=case when state='queued' then 'cancelled' else state end,
       bundle=case when state='queued' then null else bundle end where id=j.id;
     return jsonb_build_object('requested',true);
   end if;
   return jsonb_build_object('id',j.id,'state',j.state,'result',j.result,'error',j.error,'cancel_requested',j.cancel);
 end if;
 return jsonb_build_object('status',400,'error','Unknown action.');
end $$;
revoke all on function public.solar_command(text,jsonb) from public,anon,authenticated;
grant execute on function public.solar_command(text,jsonb) to service_role;
commit;
