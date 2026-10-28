import { timingSafeEqual } from "node:crypto";
import { command, config, handle, reply } from "@/lib/solar-server";
import { boundedJson, object, SolarError } from "@/lib/solar-policy";
export const runtime = "nodejs";
export async function POST(request: Request) {
  return handle(async () => {
    config();
    const secret = process.env.SOLAR_WORKER_TOKEN;
    const supplied = request.headers.get("authorization")?.replace(/^Bearer /, "") || "";
    if (!secret || !/^[A-Za-z0-9_-]{43,128}$/.test(secret) || !/^[A-Za-z0-9_-]{43,128}$/.test(supplied) || supplied.length !== secret.length || !timingSafeEqual(Buffer.from(secret), Buffer.from(supplied))) throw new SolarError(401, "Unauthorized.");
    const body = object(await boundedJson(request, 600 * 1024));
    if (!["heartbeat", "claim", "finish"].includes(String(body.action)) || typeof body.session !== "string" || !/^[a-f0-9]{32}$/.test(body.session)) throw new SolarError(400, "Invalid worker request.");
    return reply(await command("worker_" + body.action, body));
  });
}
