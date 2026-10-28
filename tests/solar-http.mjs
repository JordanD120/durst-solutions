// Local production HTTP smoke checks. No live credentials or cloud calls.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
const origin = 'http://127.0.0.1:3019';
const enabled = false; // This release has a code-level activation lock.
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3019'], {
  env: { SystemRoot: process.env.SystemRoot, PATH: process.env.PATH, NEXT_TELEMETRY_DISABLED: '1',
    NEXT_PUBLIC_SUPABASE_URL: 'https://build-only.supabase.co', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'build-only-public-key',
    SUPABASE_SERVICE_ROLE_KEY: 'SERVER_ONLY_TEST_CANARY', RESEND_API_KEY: 're_build_only_placeholder',
    ...(enabled ? { SOLAR_ENABLED: 'true' } : {}), SOLAR_ORIGIN: 'https://jordandurst.com', SOLAR_WORKER_TOKEN: 'TEST_ONLY_WORKER_CANARY_0123456789012345678901234567' },
  stdio: 'ignore',
});
try {
  let ready = false;
  for (let i = 0; i < 50; i++) {
    try { await fetch(origin + '/solar', { signal: AbortSignal.timeout(500) }); ready = true; break; } catch { await setTimeout(100); }
  }
  assert.ok(ready, 'Local production server starts');
  for (const path of ["/", "/solar"]) {
    const r = await fetch(origin + path); assert.equal(r.status, 200, path);
  }
  const page = await fetch(origin + '/solar');
  assert.equal(page.headers.get('x-frame-options'), 'DENY');
  assert.match(page.headers.get('content-security-policy'), /frame-ancestors 'none'/);
  const html = await page.text();
  assert.match(html, enabled ? /Private simulation access/ : /Simulation access is paused/);
  if (!enabled) assert.ok(!html.includes('name="password"'), 'Disabled feature shows no login form');
  for (const path of ['/jobs', '/jobs/00000000-0000-4000-8000-000000000001', '/session']) {
    const r = await fetch(origin + '/api/solar' + path);
    assert.equal(r.status, enabled ? 401 : 503); assert.match(r.headers.get('cache-control'), /no-store/);
    assert.equal(r.headers.get('access-control-allow-origin'), null);
  }
  for (const method of ['POST', 'DELETE']) {
    const r = await fetch(origin + '/api/solar/session', { method, headers: { origin: 'https://evil.example', 'content-type': 'application/json' }, body: method === 'POST' ? '{}' : undefined });
    assert.equal(r.status, enabled ? 403 : 503, method + ' cross-site rejected or feature disabled');
  }
  const worker = await fetch(origin + '/api/solar/worker', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' });
  assert.equal(worker.status, enabled ? 401 : 503, 'Worker requires separate credential and enabled feature');
  for (const path of ['/jobs', '/jobs/00000000-0000-4000-8000-000000000001']) {
    for (const suppliedOrigin of [undefined, 'https://evil.example']) {
      const method = path === '/jobs' ? 'POST' : 'DELETE';
      const r = await fetch(origin + '/api/solar' + path, { method, headers: { ...(suppliedOrigin ? { origin: suppliedOrigin } : {}), 'content-type': 'application/json' }, body: method === 'POST' ? '{}' : undefined });
      assert.equal(r.status, enabled ? 403 : 503, 'Job mutations require Origin and enabled feature');
    }
  }
  const preflight = await fetch(origin + '/api/solar/jobs', { method: 'OPTIONS', headers: { origin: 'https://evil.example', 'access-control-request-method': 'POST' } });
  assert.equal(preflight.headers.get('access-control-allow-origin'), null);
  console.log(`PASS (${enabled ? 'enabled, synthetic credentials' : 'disabled by default'}): existing pages, solar page, security headers, unauthorized API access, CSRF rejection, worker auth and CORS preflight`);
} finally { child.kill(); }
