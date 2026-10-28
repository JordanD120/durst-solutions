import "server-only";
import { SOLAR_RELEASE_READY } from "./solar-release";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SolarError } from "./solar-policy";

export const COOKIE = "__Host-solar-session";
export function config() {
  if (!SOLAR_RELEASE_READY) throw new SolarError(503, "Solar simulations are paused pending setup and verification.");
  const origin = process.env.SOLAR_ORIGIN;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (process.env.SOLAR_ENABLED !== "true" || !origin || new URL(origin).protocol !== "https:" || new URL(origin).origin !== origin || !url || !key || !service) throw new SolarError(503, "Solar access is not enabled.");
  return { origin, url, key, service };
}
export function authClient() {
  const c = config();
  return createClient(c.url, c.key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(8000) }) } });
}
export async function command(action: string, payload: Record<string, unknown> = {}) {
  const c = config();
  const client = createClient(c.url, c.service, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(8000) }) } });
  const { data, error } = await client.rpc("solar_command", { action, payload });
  if (error) throw new SolarError(503, "Solar service is unavailable.");
  if (data?.error) throw new SolarError(data.status || 400, data.error);
  return data;
}
export async function user() {
  config();
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token || token.length > 4096) throw new SolarError(401, "Sign in to continue.");
  const { data, error } = await authClient().auth.getUser(token);
  if (error || !data.user || data.user.is_anonymous) throw new SolarError(401, "Sign in to continue.");
  await command("authorize", { user_id: data.user.id });
  return data.user.id;
}
export function reply(value: unknown, status = 200) {
  return NextResponse.json(value, { status, headers: { "Cache-Control": "no-store, private", "Vary": "Cookie", "X-Content-Type-Options": "nosniff" } });
}
export async function handle(fn: () => Promise<Response>) {
  try { return await fn(); }
  catch (error) { return reply({ error: error instanceof SolarError ? error.message : "Solar service is unavailable." }, error instanceof SolarError ? error.status : 503); }
}
