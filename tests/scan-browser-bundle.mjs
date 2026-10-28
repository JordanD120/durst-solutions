import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import assert from 'node:assert/strict';
const patterns = [/SUPABASE_SERVICE_ROLE_KEY/, /SOLAR_WORKER_TOKEN/, /SERVER_ONLY_TEST_CANARY/, /TEST_ONLY_WORKER_CANARY/, /C:\\+Users\\+/i, /127\.0\.0\.1:8765/, /localhost:8765/];
let files = 0;
async function scan(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await scan(p);
    else if (p.endsWith('.js')) {
      files++; const text = await readFile(p, 'utf8');
      for (const pattern of patterns) assert.ok(!pattern.test(text), `Forbidden server/private marker in ${p}`);
    }
  }
}
await scan('.next/static');
assert.ok(files > 0); console.log(`PASS: scanned ${files} browser JS files; no forbidden server/private markers`);
