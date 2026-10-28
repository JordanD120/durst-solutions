import { createHash } from "node:crypto";
import { authClient, command, config, COOKIE, handle, reply, user } from "@/lib/solar-server";
import { boundedJson, object, requireOrigin, SolarError } from "@/lib/solar-policy";

export const runtime = "nodejs";
export async function GET() { return handle(async () => { await user(); return reply({ signed_in: true }); }); }
export async function POST(request: Request) {
  return handle(async () => {
    const c = config(); requireOrigin(request, c.origin);
    const body = object(await boundedJson(request, 4096));
    if (typeof body.email !== "string" || body.email.length > 254 || typeof body.password !== "string" || body.password.length > 256 || !body.password) throw new SolarError(400, "Enter your email and password.");
    // Vercel overwrites this header. A global ceiling also bounds attempts if it is absent.
    const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0] || "unknown";
    await command("login_limit", { fingerprint: createHash("sha256").update(ip).digest("hex") });
    const { data, error } = await authClient().auth.signInWithPassword({ email: body.email, password: body.password });
    if (error || !data.session || !data.user || data.user.is_anonymous) throw new SolarError(401, "Sign-in failed.");
    await command("authorize", { user_id: data.user.id });
    const response = reply({ signed_in: true });
    response.cookies.set(COOKIE, data.session.access_token, { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: Math.min(data.session.expires_in, 3600) });
    return response;
  });
}
export async function DELETE(request: Request) {
  return handle(async () => {
    requireOrigin(request, config().origin);
    const response = reply({ signed_in: false });
    response.cookies.set(COOKIE, "", { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 0 });
    return response;
  });
}
