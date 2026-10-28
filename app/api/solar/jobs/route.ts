import { command, config, handle, reply, user } from "@/lib/solar-server";
import { boundedJson, MAX_UPLOAD, requireOrigin, validateBundle } from "@/lib/solar-policy";
export const runtime = "nodejs";
export async function GET() { return handle(async () => reply(await command("list", { user_id: await user() }))); }
export async function POST(request: Request) {
  return handle(async () => {
    requireOrigin(request, config().origin);
    const user_id = await user();
    const bundle = validateBundle(await boundedJson(request, MAX_UPLOAD));
    return reply(await command("submit", { user_id, bundle }), 202);
  });
}
