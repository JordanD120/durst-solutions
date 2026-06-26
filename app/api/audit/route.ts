import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { supabasePublic } from "@/lib/supabasePublic";

function scoreFromUrl(url: string, offset: number) {
  const clean = url.trim().toLowerCase();
  const total = clean.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return 58 + ((total + offset) % 38);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, website, businessInterest } = body;

    if (!name || !email || !website) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const designScore = scoreFromUrl(website, 3);
    const seoScore = scoreFromUrl(website, 11);
    const mobileScore = scoreFromUrl(website, 19);
    const automationScore = scoreFromUrl(website, 27);

    const recommendations = [
      "Make the main call-to-action clearer above the fold.",
      "Improve mobile layout and spacing for easier contact form submissions.",
      "Add stronger trust signals such as reviews, photos, and service proof.",
      "Use automation to capture, organize, and follow up with new leads.",
    ];

    const { error } = await supabasePublic.from("audit_requests").insert({
      name,
      email,
      website,
      business_interest: businessInterest,
      design_score: designScore,
      seo_score: seoScore,
      mobile_score: mobileScore,
      automation_score: automationScore,
      recommendations,
      status: "new",
    });

    if (error) {
      console.error("SUPABASE AUDIT ERROR:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: process.env.CONTACT_EMAIL!,
      subject: "New Website Audit Request",
      html: `
        <h2>New Website Audit Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Website:</strong> ${website}</p>
        <p><strong>Interest:</strong> ${businessInterest || "N/A"}</p>
        <p><strong>Scores:</strong></p>
        <ul>
          <li>Design: ${designScore}</li>
          <li>SEO: ${seoScore}</li>
          <li>Mobile: ${mobileScore}</li>
          <li>Automation: ${automationScore}</li>
        </ul>
      `,
    });

    await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: email,
      subject: "Your Durst Solutions Website Audit Preview",
      html: `
        <h2>Your website audit preview for ${website}</h2>
        <ul>
          <li><strong>Design:</strong> ${designScore}/100</li>
          <li><strong>SEO:</strong> ${seoScore}/100</li>
          <li><strong>Mobile:</strong> ${mobileScore}/100</li>
          <li><strong>Automation:</strong> ${automationScore}/100</li>
        </ul>
        <h3>Recommended improvements:</h3>
        <ul>
          ${recommendations.map((item) => `<li>${item}</li>`).join("")}
        </ul>
        <p>I’ll follow up with more specific recommendations soon.</p>
        <p>- Jordan Durst<br/>Durst Solutions</p>
      `,
    });

    return NextResponse.json({
      success: true,
      scores: {
        design: designScore,
        seo: seoScore,
        mobile: mobileScore,
        automation: automationScore,
      },
      recommendations,
    });
  } catch (error) {
    console.error("AUDIT API ERROR:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}