# Solar integration — review and deployment runbook

## Current staged release

Jordan approved publishing the solar project after replacing the business site.
The new release retains the generic personal homepage, links to `/solar`, and
publishes the web integration with computations locked in code by
`lib/solar-release.ts` (`SOLAR_RELEASE_READY=false`). Every solar API returns
503 before any database or authentication call, even if SOLAR_ENABLED=true.
Vercel's connector refused the environment-setting change with HTTP 403; no
Vercel CLI was available. The code lock therefore does not depend on that setting.
Supabase remains INACTIVE; no migration, worker, or remote computation is started.
Activation requires all checks below, a deliberate reviewed code change, and
explicit approval to enable desktop computations. The older preparation notes
below describe the original integration; original business pages stay removed.

Prepared October 28, 2026. **Nothing in this runbook has been deployed.**
The source changes are on the local `solar-desktop-integration` branches.
Do not push either branch or create a Vercel preview until Jordan approves:
Git pushes can automatically deploy previews and publish new endpoints.

## Verified targets and scope

- Website: `JordanD120/durst-solutions`, Vercel project `durst-solutions`,
  project ID `prj_Uxvh5B4mdW9ZZxFKGbDOHIdXLzhl`, team `team_w0gIeCoalDwYjPaXWjVtuBPP`.
  The live custom domains map to production commit `de70149cfd7f14d88f01edacbf7f0bd0fb230080`.
- Supabase: `Durst Solutions Database`, project `anryvdctwotlplkayams`, reported
  **INACTIVE** during inspection. It has not been resumed or changed.
- Actual existing application: the owner-provided existing Helioforge desktop folder.
  It has real FastAPI/PySAM code; the supplied `meen439-ug5` GitHub repository
  instead contains the classroom scaffold. No original Helioforge files were edited.
- `meen439-ug5/desktop_bridge` contains the adapter and worker; it calls the existing
  `app.optimization.evaluate` and existing schemas/parsers. No engineering model is replaced.

The first release uses **export/upload/run** at `/solar`: the full map editor,
catalog review, sensitivity editor and hourly exports remain available in the
existing desktop application. The website returns calculated candidate summary
metrics. It does not claim to host the complete desktop editor. Public visitors
see explanatory text and a sign-in screen, with no sample engineering results.

## Architecture and enforced boundaries

Browser → same-origin Next.js API → private Supabase queue ← outbound Windows worker.
The desktop has **no listener**, inbound tunnel, port forwarding or DNS record.
The worker knows one exact HTTPS origin, `https://jordandurst.com`, and refuses
redirects and environment proxy settings. The public website receives normal
outbound connections, but the browser never receives the desktop IP or address.
Hosting/provider network logs can necessarily observe an outbound client's IP;
disable application IP logging and restrict provider log access. There is no
promise that an outbound internet connection hides its source from its recipient.

- Invited Supabase email/password accounts; no shared application password.
- The server verifies the access token with Supabase on every protected request
  and checks an administrator-maintained membership table. User-editable metadata
  is never used to grant access. No signup or password-reset API is added.
- Access token only in a Secure, HttpOnly, SameSite=Strict, host-only cookie;
  one-hour maximum, no browser local storage or refresh token. Sign-out clears
  the local cookie; removing membership immediately revokes solar access. The
  provider token naturally expires; cookie deletion is not global token revocation.
- Exact configured Origin check on all browser mutations, no credentialed CORS,
  private no-store responses, anti-framing headers and a page-specific CSP.
  The CSP permits inline scripts/styles required by the existing Next runtime;
  it is defense in depth, not a claim of nonce-based XSS prevention.
- Private schema, RLS with no client policies, no grants to anon/authenticated.
  Only server-side `service_role` can invoke the SECURITY INVOKER queue RPC.
  The desktop token grants access to three fixed worker operations, not database
  administration. No Supabase service key is installed on the desktop.
- Transaction lock and unique index enforce one running web job globally.
  Queue limit 2; one unfinished job per member; 3 submissions/hour/member;
  authenticated API limit 90 database checks/minute/member. Each normal API
  call uses two checks. Login: 5 attempts/15 minutes per trusted-IP hash and
  60/minute globally, plus Supabase provider limits. No in-memory rate counters.
- Worker heartbeat stale after 20 seconds: new submissions rejected. Queued jobs
  expire after five minutes. A job starts only when the worker claims it.
- A lost worker's running job **never automatically requeues or releases the
  active slot**. Its journal permits only a failed acknowledgement on restart.
  Failed acknowledgements are idempotently retried without rerunning work.
- Upload max 3 MiB (below Vercel's request ceiling); resource max 1,400,000 decoded
  bytes each, two resources, 16 equipment records, eight surfaces, bounded JSON
  depth/arrays/geometry, six SAM evaluations and 60 candidates. Existing Pydantic
  validation, geometry confirmation, checksums and normalization checks apply.
  Large historical exports, complex imagery and large resources must use the
  desktop application. Historical jobs are stripped before queuing.
- New per-job SQLite database and random temporary directory. No desktop
  database, local projects or credentials are opened. No user string becomes a
  path, command, module import, URL destination or unrestricted SAM parameter.
  Web jobs cannot acquire NSRDB weather; upload resources instead.
- Windows Job Objects apply **before execution**: one process, 2 GiB combined
  committed memory, 25% CPU hard cap, kill-on-close. Parent enforces five-minute
  wall limit and cancellation; heartbeat failure kills the child. BLAS/OMP use
  one thread. No inherited handles or environment credentials. Temporary files
  are deleted after completion/cancellation/failure.
- Python audit restrictions block sockets, process creation, private file reads
  and writes outside the job directory. **Audit hooks are not an OS sandbox.**
  A dedicated non-admin Windows account with restrictive ACLs and outbound
  firewall rules is required below; the worker refuses the desktop owner's account.
- Output is finite numeric candidate metrics and fixed status/limitation text,
  not raw exception messages, environment, adapter snapshots, private provenance
  or original resources. Summary response capped at 512 KiB.

One-active-job enforcement applies to web submissions. Do not run independent
local editor simulations while the web worker is enabled if a total machine-wide
single-simulation policy is required; the original local editor is unchanged.

## Approval gate

Jordan must explicitly approve deployment/public cloud endpoints and enabling
desktop computation before continuing past local work. Ask for approval of this
concrete implementation, including the export/upload scope, Supabase use and
Windows account/firewall setup. No home-facing endpoint will be created.
Do not turn on live features until all release checks below pass.

## 1. Prepare the cloud after approval

1. Confirm the above Vercel project/team and repository mapping. Keep existing
   environment values and existing website APIs unchanged. Resume the inactive
   Supabase project through its dashboard and confirm its backup/health status.
   This may affect the existing site's database-backed features; verify them.
2. Back up the database. Review and run `db/solar.sql` once in the Supabase SQL
   editor. It creates only new `solar_private` objects and `public.solar_command`.
   Do not add `solar_private` to the Data API exposed schemas. Keep `public`
   exposed so server-only RPC works. Run the Supabase security advisors.
3. Disable public Auth signups if compatible with existing users. Create/invite
   a separate confirmed email/password account for each approved person through
   Supabase Auth. Give each person their own password through the provider flow.
   Configure provider login rate limits and MFA as appropriate. Do not paste
   passwords, service keys or worker tokens into this chat or Git.
4. Grant access explicitly in the SQL editor, using the verified Auth UUID:

   ```sql
   insert into solar_private.members(user_id) values ('VERIFIED-AUTH-USER-UUID');
   -- Revoke access (also signals cancellation of that user's active job):
   update solar_private.members set enabled=false where user_id='VERIFIED-AUTH-USER-UUID';
   ```

5. In Vercel **Production** settings only, retain the existing Supabase URL,
   anon/publishable-compatible key and `SUPABASE_SERVICE_ROLE_KEY`. Add:

   | Variable | Value |
   |---|---|
   | `SOLAR_ENABLED` | `false` for initial deploy; `true` only for approved activation |
   | `SOLAR_ORIGIN` | `https://jordandurst.com` |
   | `SOLAR_WORKER_TOKEN` | Unique cryptographically random 32-byte base64url secret |

   Store the token as a sensitive server-only variable. Use a password manager
   or approved secret generator. Never prefix it or the service key with
   `NEXT_PUBLIC_`; never use the website's existing admin shared password.
   The website already uses public Supabase URL/anon settings; those identifiers
   are intentionally public and grant no access to this private schema.
   Do not expose production database/service credentials to preview builds.
6. Configure Vercel WAF limits on `/api/solar/session` and `/api/solar/worker`
   (initially 20/minute/IP and 120/minute/IP respectively), with no worker-token
   or password values in request logging. Application-level limits remain active.
   No IP allowlist contains the home's IP and no desktop port is configured.
7. Schedule private terminal-job cleanup daily through Supabase Cron after
   confirming pg_cron is enabled. First check for an existing same-named task:

   ```sql
   select jobid,jobname from cron.job where jobname='solar-retention';
   select cron.schedule('solar-retention','17 * * * *',
     $$delete from solar_private.jobs where state not in ('queued','running') and created < now()-interval '24 hours';
       delete from solar_private.limits where since < now()-interval '24 hours';$$);
   ```

   This hourly job bounds retention to approximately 24–25 hours from creation.
   Inputs are removed immediately when a worker finishes or a queued job is
   cancelled/expired. Membership and worker lock records persist. Database
   backups and hosting logs have their own provider retention policies.

## 2. Prepare the desktop account after approval

Do this in a maintenance window. No changes to the existing Helioforge folder
or its private SQLite file are needed.

1. In Windows Settings, create a **local standard user** named exactly
   `HelioforgeWorker`. Give it no administrator membership, no access to your
   OneDrive/profile, no network shares and no stored personal credentials.
   Deny interactive/remote sign-in where supported; allow batch-job sign-in.
2. From the integration checkout, prepare a code-only distribution:

   ```powershell
   # Set this locally to the existing Helioforge folder; keep personal paths out of Git.
   $helioSource = Read-Host 'Existing Helioforge folder'
   & "$helioSource\.venv\Scripts\python.exe" -m desktop_bridge.package_worker `
     --app-root "$helioSource" `
     --output '.\worker-release'
   ```

   Run this in `meen439-ug5`. Review `worker-release/manifest.json`. The package
   includes only the existing application Python code, locked requirements and
   bridge, never its data, resources, secrets, history or browser bundles.
3. As administrator, place the reviewed release in `C:\ProgramData\HelioforgeWeb\code`.
   Create `C:\ProgramData\HelioforgeWeb\state`. Install an approved 64-bit Python
   3.12 runtime at an administrator-controlled path, create `code\.venv`, and
   install `code\requirements.lock`. Use that account-independent interpreter;
   do not grant the worker access to your personal venv or profile. `httpx` and
   all engineering dependencies are already in the existing lockfile.
4. Set NTFS ACLs: Administrators/SYSTEM full control; HelioforgeWorker read/execute
   on code/runtime and modify only on `state`. Remove inherited Users write
   rights from code/runtime and state. The worker must not be able to replace
   any Python code or dependency. Verify its effective access cannot read a
   private sentinel file in your profile and cannot change its installed code.
5. Install a second reviewed **base** Python 3.12 interpreter at
   `C:\ProgramData\HelioforgeWeb\compute-python\python.exe` (same patch/architecture;
   not a venv redirector). Its path is mandatory in `--compute-python`; the
   worker refuses to use its own network-enabled base executable for calculations.
   Set an outbound Windows firewall **block** rule for this compute executable,
   on all profiles/protocols. Allow the parent worker runtime HTTPS to the website
   plus required DNS/PKI; block inbound access. The child explicitly imports the
   reviewed pinned packages from `code\.venv\Lib\site-packages`. Verify both
   executable rules and the blocked network test before activation. No router
   port forwarding. Put state on a storage volume with an administrator-enforced
   per-worker quota (512 MiB initially); do not enable volume-wide quotas on a
   personal drive without a separate storage review.
6. Store the same worker token in the worker account's user-scoped secret store
   or protected service configuration. Restrict it to that account, SYSTEM and
   Administrators. The launcher should read it into `SOLAR_WORKER_TOKEN`, invoke
   the command below and remove it from the launcher's environment. Never put
   the token in command arguments, source, task arguments or logs. No Supabase
   service-role key or NSRDB key is required on the desktop.
7. Create a Task Scheduler task running as **HelioforgeWorker**, with highest
   privileges **off**, multiple instances set to **Do not start a new instance**,
   starting in `code`, using your protected secret-loading launcher to run:

   ```text
   C:\ProgramData\HelioforgeWeb\code\.venv\Scripts\python.exe -B -m desktop_bridge.worker --app-root C:\ProgramData\HelioforgeWeb\code\helioforge --state-dir C:\ProgramData\HelioforgeWeb\state --compute-python C:\ProgramData\HelioforgeWeb\compute-python\python.exe
   ```

   Do not run it under Jordan's account. Prevent concurrent original local
   editor simulations while the worker is in service. Configure restart on
   process failure; a held/uncertain cloud job will stay locked until safely
   acknowledged. Temporary-job cleanup after a power outage should remove only
   verified `state\job-*` directories after confirming no calculation is alive;
   never remove `pending.json` to make a slot appear free.

## 3. Deployment and activation after approval

1. Run `npm ci`, `npm run test:solar`, `npm run lint`, and `npm run build` using
   the reviewed security-fixed lockfile. In this Windows environment Webpack
   build was used to avoid a local Turbopack build-worker restriction. The default
   production build also needs to pass in the Vercel build environment.
2. Push the reviewed branch only after Jordan approves publication. Keep any
   generated preview behind Vercel Authentication with `SOLAR_ENABLED=false`.
   Existing Vercel settings protect deployment URLs but exempt custom domains;
   therefore `/solar` uses its own server-side account checks on production.
3. Verify the exact approved commit in Vercel. Deploy production initially with
   solar disabled; test the existing website pages/contact/reviews/admin flows
   and the new explanatory page before enabling computation. Do not change DNS.
4. After account/ACL/firewall verification, enable `SOLAR_ENABLED=true` in
   production and redeploy the same reviewed code. Start the dedicated worker.
   Visit `https://jordandurst.com/solar` with an invited test account.
5. Run the release checks below. Keep general access limited to the initial
   invited tester until these checks pass. This is a security-sensitive staged
   deployment, not an assertion of a completed independent security audit.

## Required release checks

- No cookie: all job endpoints reject; invalid credentials rejected; valid
  nonmember rejected; authorized user works; removing membership blocks access.
- Two invited accounts: neither can list, read, cancel or download the other's job.
- Cross-origin POST/DELETE and missing Origin rejected. OPTIONS/GET responses
  have no permissive credentialed CORS header. Confirm service-worker/CDN behavior
  cannot cache authenticated results and responses use no-store.
- Stop worker: UI shows offline within 20 seconds and submits fail. Restart:
  available. Kill worker during a run: child exits, slot stays locked, journal
  recovery acknowledges failure, no duplicate job executes.
- Submit with three test accounts: exactly one running, at most two waiting;
  a fourth is rejected. Queued work older than five minutes never starts.
- Cancel queued and running jobs; revoke the running user's membership; interrupt
  network; exceed five-minute, memory, input/depth and evaluation limits. Each
  fails closed and removes temporary resources when the process can clean up.
- Test a real bundle with validated resources and reviewed equipment. Confirm
  output matches the same existing desktop pipeline, while missing equipment
  evidence still blocks recommendations. Anonymous SAM smoke outputs do not
  establish independent engineering accuracy.
- Scan built browser JS: no service key, token, credentials, desktop path/home IP,
  debug URL, local API URL or environment dump. Confirm the child cannot read
  profile sentinels or make outbound network connections under its OS account.
- Confirm only expected listeners exist on the desktop; this worker creates none.
- Check the dependency audit, Supabase advisors, WAF and private retention job.

## Stop, rollback and recovery

- Immediate pause: stop the scheduled worker; set `SOLAR_ENABLED=false` and
  redeploy. Rotate `SOLAR_WORKER_TOKEN` if compromised. Revoke member access if
  needed. Existing local Helioforge and existing website routes stay unchanged.
- Web rollback: promote the recorded prior Vercel production deployment after
  approval. Keep solar disabled and stop the worker. No DNS change is required.
- If the journal is lost, first terminate/verify absence of every calculation
  process and worker, then mark the specific orphaned running cloud job failed
  and clear its input in an administrator-reviewed SQL transaction. Never
  release a running slot solely because a lease timed out.
- Schema rollback: after stopping workers and removing use by the website,
  review retention needs, then remove the new function/schema manually. Do not
  execute automatic DROP CASCADE or touch the website's existing tables.

## Documentation used

- Supabase [server token validation](https://supabase.com/docs/reference/javascript/auth-getuser)
  and [database function permissions](https://supabase.com/docs/guides/database/functions).
- Microsoft [Job Objects](https://learn.microsoft.com/en-us/windows/win32/procthread/job-objects)
  and [CPU hard caps](https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-jobobject_cpu_rate_control_information).
- Next.js [security advisory](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw)
  and [16.4.3 release](https://github.com/vercel/next.js/releases/tag/v16.4.3).
