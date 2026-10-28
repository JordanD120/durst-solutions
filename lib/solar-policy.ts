export const MAX_UPLOAD = 3 * 1024 * 1024;
export class SolarError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export function requireOrigin(request: Request, origin: string) {
  if (request.headers.get("origin") !== origin || request.headers.get("sec-fetch-site") === "cross-site") {
    throw new SolarError(403, "Use this website to make changes.");
  }
}
export async function boundedJson(request: Request, limit: number): Promise<unknown> {
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") throw new SolarError(415, "JSON required.");
  if (Number(request.headers.get("content-length") || 0) > limit) throw new SolarError(413, "Upload is too large.");
  const reader = request.body?.getReader();
  if (!reader) throw new SolarError(400, "Missing input.");
  const chunks: Uint8Array[] = []; let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.length;
      if (size > limit) { await reader.cancel(); throw new SolarError(413, "Upload is too large."); }
      chunks.push(value);
    }
    const all = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { all.set(chunk, offset); offset += chunk.length; }
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(all));
  } catch (error) { if (error instanceof SolarError) throw error; throw new SolarError(400, "Invalid JSON."); }
}
export function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new SolarError(400, "Invalid input.");
  return value as Record<string, unknown>;
}
// Reject pathological JSON before it is serialized into a database RPC. The
// desktop independently repeats these bounds before parsing project schemas.
export function boundedTree(value: unknown) {
  const pending: { value: unknown; depth: number }[] = [{ value, depth: 0 }];
  let count = 0;
  while (pending.length) {
    const item = pending.pop()!;
    if (++count > 300000 || item.depth > 24) throw new SolarError(400, "Input structure exceeds web limits.");
    const current = item.value;
    if (typeof current === "number" && !Number.isFinite(current)) throw new SolarError(400, "Invalid numeric input.");
    if (typeof current === "string" && current.length > 2 * 1024 * 1024) throw new SolarError(400, "Input string exceeds web limits.");
    if (Array.isArray(current)) {
      if (current.length > 10000) throw new SolarError(400, "Input array exceeds web limits.");
      for (const child of current) pending.push({ value: child, depth: item.depth + 1 });
    } else if (current && typeof current === "object") {
      const entries = Object.entries(current);
      if (entries.length > 300 || entries.some(([key]) => key.length > 256)) throw new SolarError(400, "Input fields exceed web limits.");
      for (const [, child] of entries) pending.push({ value: child, depth: item.depth + 1 });
    }
  }
}
export function validateBundle(value: unknown) {
  boundedTree(value);
  const bundle = object(value);
  const allowed = new Set(["bundle_version", "project", "equipment", "resources", "jobs", "resource_license_note", "versions"]);
  if (Object.keys(bundle).some(k => !allowed.has(k)) || bundle.bundle_version !== "1.0.0") throw new SolarError(400, "Use a Helioforge 1.0.0 export.");
  const project = object(bundle.project), search = object(project.search);
  if (!Number.isInteger(search.max_runs) || Number(search.max_runs) < 1 || Number(search.max_runs) > 6 || !Number.isInteger(search.max_candidates) || Number(search.max_candidates) < 1 || Number(search.max_candidates) > 60) throw new SolarError(400, "Web runs allow 6 SAM evaluations and 60 candidates.");
  if (!Array.isArray(bundle.equipment) || bundle.equipment.length > 16 || Object.keys(object(bundle.resources)).length > 2) throw new SolarError(400, "Bundle exceeds web limits.");
  // Historical jobs are never executed or sent to the desktop.
  return { bundle_version: bundle.bundle_version, project, equipment: bundle.equipment, resources: bundle.resources };
}
