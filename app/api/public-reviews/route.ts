import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabasePublic";

export async function GET() {
  const { data, error } = await supabasePublic
    .from("reviews")
    .select("id, name, role, rating, quote, created_at")
    .eq("approved", true)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ reviews: data ?? [] });
}