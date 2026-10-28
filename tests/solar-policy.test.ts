import assert from "node:assert/strict";
import test from "node:test";
import { boundedJson, boundedTree, requireOrigin, validateBundle } from "../lib/solar-policy";

test("state changes require exact origin and reject cross-site requests", () => {
  const request = (origin?: string, site?: string) => new Request("https://jordandurst.com", { headers: { ...(origin ? { Origin: origin } : {}), ...(site ? { "sec-fetch-site": site } : {}) } });
  requireOrigin(request("https://jordandurst.com"), "https://jordandurst.com");
  for (const r of [request(), request("https://evil.example"), request("null"), request("https://jordandurst.com", "cross-site")]) assert.throws(() => requireOrigin(r, "https://jordandurst.com"));
});
test("streamed bodies cannot bypass upload limits", async () => {
  const stream = new ReadableStream({ start(c) { c.enqueue(new TextEncoder().encode('"123456789"')); c.close(); } });
  const request = new Request("https://jordandurst.com", { method: "POST", headers: { "content-type": "application/json" }, body: stream, duplex: "half" } as RequestInit);
  await assert.rejects(() => boundedJson(request, 5), /too large/);
  await assert.rejects(() => boundedJson(new Request("https://jordandurst.com", { method: "POST", body: "{}" }), 50), /JSON required/);
});
test("valid bundle drops historical jobs and unknown executable fields are rejected", () => {
  const b = { bundle_version: "1.0.0", project: { search: { max_runs: 6, max_candidates: 60 } }, equipment: [], resources: {}, jobs: [{ private: "history" }] };
  assert.equal("jobs" in validateBundle(b), false);
  assert.throws(() => validateBundle({ ...b, command: "powershell" }));
  assert.throws(() => validateBundle({ ...b, project: { search: { max_runs: 1000, max_candidates: 60 } } }));
});

test("pathological exports are rejected before database serialization", () => {
  let deep: unknown = 0;
  for (let i = 0; i < 26; i++) deep = [deep];
  for (const value of [deep, [0, Infinity], new Array(10001).fill(0), { ["x".repeat(257)]: 1 }, "x".repeat(2 * 1024 * 1024 + 1)]) {
    assert.throws(() => boundedTree(value));
  }
  const large = Array.from({ length: 31 }, () => new Array(10000).fill(0));
  assert.throws(() => boundedTree(large));
  boundedTree({ hourly: new Array(8760).fill(1.25) });
  assert.throws(() => validateBundle({ bundle_version: "1.0.0", project: { search: { max_runs: 1, max_candidates: 1 }, nested: deep }, equipment: [], resources: {} }));
});
