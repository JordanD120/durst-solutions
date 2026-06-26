import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function isAuthorized(request: Request) {
  return request.headers.get("x-admin-password") === process.env.ADMIN_PASSWORD;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [leads, audits, reviews] = await Promise.all([
    supabaseAdmin.from("leads").select("*").order("created_at", { ascending: false }),
    supabaseAdmin.from("audit_requests").select("*").order("created_at", { ascending: false }),
    supabaseAdmin.from("reviews").select("*").order("created_at", { ascending: false }),
  ]);

  return NextResponse.json({
    leads: leads.data ?? [],
    audits: audits.data ?? [],
    reviews: reviews.data ?? [],
  });
}

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { type, id, action } = body;

  if (type === "review") {
    const { error } = await supabaseAdmin
      .from("reviews")
      .update({ approved: action === "approve" })
      .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  }

  if (type === "lead") {
    const { error } = await supabaseAdmin
      .from("leads")
      .update({ status: action })
      .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  }

  if (type === "audit") {
    const { error } = await supabaseAdmin
      .from("audit_requests")
      .update({ status: action })
      .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid request." }, { status: 400 });
}