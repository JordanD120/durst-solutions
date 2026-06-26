import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { supabasePublic } from "@/lib/supabasePublic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, role, email, rating, quote } = body;

    if (!name || !quote) {
      return NextResponse.json({ error: "Name and review are required." }, { status: 400 });
    }

    const { error } = await supabasePublic.from("reviews").insert({
      name,
      role,
      email,
      rating: Number(rating || 5),
      quote,
      approved: false,
    });

    if (error) {
      console.error("SUPABASE REVIEW ERROR:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: process.env.CONTACT_EMAIL!,
      subject: "New Review Pending Approval",
      html: `
        <h2>New Review Pending Approval</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Role:</strong> ${role || "N/A"}</p>
        <p><strong>Email:</strong> ${email || "N/A"}</p>
        <p><strong>Rating:</strong> ${rating || 5}</p>
        <p>${quote}</p>
      `,
    });

    return NextResponse.json({ success: true });
    } catch (error) {
    console.error("REVIEW API ERROR:", error);
    return NextResponse.json(
        { error: error instanceof Error ? error.message : "Something went wrong." },
        { status: 500 }
    );
    }
}