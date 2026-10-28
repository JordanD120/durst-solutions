import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";

test("PostgreSQL enforces private access, queue ownership and fail-closed recovery", async t => {
  const db = new PGlite();
  await db.exec("create role anon; create role authenticated; create role service_role bypassrls; create schema auth; create table auth.users(id uuid primary key);");
  await db.exec(await readFile(new URL("../db/solar.sql", import.meta.url), "utf8"));
  const users = [1, 2, 3, 4, 5].map(i => `00000000-0000-4000-8000-${String(i).padStart(12, "0")}`);
  for (const id of users) { await db.query("insert into auth.users values($1)", [id]); await db.query("insert into solar_private.members values($1,true)", [id]); }
  async function cmd(action: string, payload: object = {}) {
    await db.exec("set role service_role");
    try { const r = await db.query<{ value: { status?: number; id?: string; state?: string; result?: unknown; cancel?: boolean; online?: boolean; jobs?: { id: string }[] } }>("select public.solar_command($1,$2::jsonb) as value", [action, JSON.stringify(payload)]); return r.rows[0].value; }
    finally { await db.exec("reset role"); }
  }
  const session = "a".repeat(32), other = "b".repeat(32);
  const bundle = { bundle_version: "1.0.0", project: {}, equipment: [], resources: {} };
  let running: string;
  await t.test("anon and authenticated cannot invoke queue RPC or read private tables", async () => {
    for (const role of ["anon", "authenticated"]) {
      await db.exec(`set role ${role}`);
      await assert.rejects(() => db.query("select public.solar_command('list','{}')"), /permission denied/);
      await assert.rejects(() => db.query("select * from solar_private.jobs"), /permission denied/);
      await db.exec("reset role");
    }
  });
  await t.test("offline rejects submissions; nonmember denied", async () => {
    assert.equal((await cmd("submit", { user_id: users[0], bundle })).status, 503);
    assert.equal((await cmd("authorize", { user_id: "99999999-0000-4000-8000-000000000000" })).status, 403);
  });
  await t.test("one active job and two queued jobs globally", async () => {
    await cmd("worker_heartbeat", { session });
    running = (await cmd("submit", { user_id: users[0], bundle })).id!;
    assert.equal((await cmd("worker_claim", { session })).id, running);
    assert.deepEqual(await cmd("worker_claim", { session }), {});
    assert.equal((await cmd("submit", { user_id: users[0], bundle })).status, 409);
    await cmd("submit", { user_id: users[1], bundle });
    await cmd("submit", { user_id: users[2], bundle });
    assert.equal((await cmd("submit", { user_id: users[3], bundle })).status, 429);
    const count = await db.query<{ n: number }>("select count(*)::int as n from solar_private.jobs where state='running'");
    assert.equal(count.rows[0].n, 1);
  });
  await t.test("users cannot read or cancel another user's job", async () => {
    assert.equal((await cmd("get", { user_id: users[1], id: running })).status, 404);
    assert.equal((await cmd("cancel", { user_id: users[1], id: running })).status, 404);
    const list = await cmd("list", { user_id: users[1] });
    assert.equal(list.jobs!.length, 1); assert.notEqual(list.jobs![0].id, running);
  });
  await t.test("lost heartbeat cannot allow concurrent takeover", async () => {
    await db.exec("update solar_private.worker set seen=now()-interval '1 minute'");
    assert.equal((await cmd("list", { user_id: users[0] })).online, false);
    assert.equal((await cmd("worker_claim", { session: other })).status, 409);
    assert.equal((await cmd("worker_finish", { session: other, id: running, state: "completed" })).status, 409);
  });
  await t.test("cancel signal reaches worker; acknowledgement clears uploaded input", async () => {
    await cmd("cancel", { user_id: users[0], id: running });
    assert.equal((await cmd("worker_heartbeat", { session })).cancel, true);
    await cmd("worker_finish", { session, id: running, state: "completed", result: { metrics: {} } });
    const value = await cmd("get", { user_id: users[0], id: running });
    assert.equal(value.state, "cancelled"); assert.equal(value.result, null);
    assert.deepEqual(await cmd("worker_finish", { session, id: running, state: "completed", result: {} }), {});
    const row = await db.query<{ bundle: unknown }>("select bundle from solar_private.jobs where id=$1", [running]);
    assert.equal(row.rows[0].bundle, null);
  });
  await t.test("revoked users and stale queued work never run", async () => {
    await db.query("update solar_private.members set enabled=false where user_id=$1", [users[1]]);
    await db.query("update solar_private.jobs set created=now()-interval '6 minutes' where user_id=$1", [users[2]]);
    assert.deepEqual(await cmd("worker_claim", { session }), {});
    assert.equal((await cmd("list", { user_id: users[1] })).status, 403);
  });
  await t.test("three submissions per user per hour; login counter persists", async () => {
    for (let i = 0; i < 3; i++) {
      const j = await cmd("submit", { user_id: users[4], bundle }); assert.ok(j.id);
      await cmd("cancel", { user_id: users[4], id: j.id });
    }
    assert.equal((await cmd("submit", { user_id: users[4], bundle })).status, 429);
    for (let i = 0; i < 5; i++) assert.deepEqual(await cmd("login_limit", { fingerprint: "test" }), {});
    assert.equal((await cmd("login_limit", { fingerprint: "test" })).status, 429);
  });
  await t.test("deleting an Auth user cannot release a running simulation slot", async () => {
    const j = await cmd("submit", { user_id: users[0], bundle });
    assert.equal((await cmd("worker_claim", { session })).id, j.id);
    await db.query("delete from auth.users where id=$1", [users[0]]);
    assert.equal((await cmd("worker_heartbeat", { session })).cancel, true);
    assert.deepEqual(await cmd("worker_claim", { session }), {});
    await cmd("worker_finish", { session, id: j.id, state: "cancelled", result: null });
  });
  await db.close();
});
