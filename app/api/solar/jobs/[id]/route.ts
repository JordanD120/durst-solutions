import { command, config, handle, reply, user } from "@/lib/solar-server";
import { requireOrigin, SolarError } from "@/lib/solar-policy";
export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
async function id(context: Context) {
  const { id } = await context.params;
  if (!/^[a-f0-9-]{36}$/.test(id)) throw new SolarError(404, "Job not found."); return id;
}
export async function GET(_request: Request, context: Context) {
  return handle(async () => reply(await command("get", { user_id: await user(), id: await id(context) })));
}
export async function DELETE(request: Request, context: Context) {
  return handle(async () => {
    requireOrigin(request, config().origin);
    return reply(await command("cancel", { user_id: await user(), id: await id(context) }));
  });
}
