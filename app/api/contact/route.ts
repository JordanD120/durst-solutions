import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { supabasePublic } from "@/lib/supabasePublic";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = clean(body.name);
    const email = clean(body.email);
    const businessWebsite = clean(body.businessWebsite);
    const service = clean(body.service);
    const message = clean(body.message);

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const { error: supabaseError } = await supabasePublic.from("leads").insert({
      name,
      email,
      business_website: businessWebsite || null,
      service: service || null,
      message,
      status: "new",
    });

    if (supabaseError) {
      console.error("SUPABASE LEAD ERROR:", supabaseError);
      return NextResponse.json(
        { error: "Lead could not be saved." },
        { status: 500 }
      );
    }

    const from = process.env.RESEND_FROM;
    const contactEmail = process.env.CONTACT_EMAIL;

    if (!from || !contactEmail) {
      console.error("Missing email environment variables.");
      return NextResponse.json(
        { error: "Lead saved, but email is not configured." },
        { status: 500 }
      );
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeWebsite = escapeHtml(businessWebsite || "N/A");
    const safeService = escapeHtml(service || "N/A");
    const safeMessage = escapeHtml(message);

    const notificationEmail = await resend.emails.send({
      from,
      to: contactEmail,
      replyTo: email,
      subject: `New Durst Solutions Lead: ${name}`,
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;max-width:650px;margin:auto;color:#1f2937;">
          <h2>New Contact Form Lead</h2>

          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Website:</strong> ${safeWebsite}</p>
          <p><strong>Service:</strong> ${safeService}</p>

          <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;">

          <p><strong>Message:</strong></p>
          <p style="white-space:pre-line;">${safeMessage}</p>
        </div>
      `,
    });

    const confirmationEmail = await resend.emails.send({
      from,
      to: email,
      replyTo: contactEmail,
      subject: "We've received your request | Durst Solutions",
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;max-width:650px;margin:auto;color:#1f2937;">
          <h1 style="color:#0ea5e9;margin-bottom:0;">Durst Solutions</h1>
          <p style="margin-top:4px;color:#64748b;">Websites • Automation • AI Solutions</p>

          <hr style="margin:30px 0;border:none;border-top:1px solid #e5e7eb;">

          <h2>Hello ${safeName},</h2>

          <p>
            Thank you for contacting <strong>Durst Solutions</strong>.
            Your request has been received successfully.
          </p>

          <p>
            I’ll personally review your message and respond within
            <strong>24 hours</strong>.
          </p>

          <h3>What happens next?</h3>

          <ol>
            <li>I review your website or project requirements.</li>
            <li>I identify the best website, automation, or AI solution for your business.</li>
            <li>I follow up with recommendations and next steps.</li>
          </ol>

          <div style="margin:30px 0;padding:18px;background:#f8fafc;border-left:4px solid #0ea5e9;border-radius:8px;">
            <strong>Need to add more information?</strong><br>
            Simply reply to this email and it will be added to your request.
          </div>

          <hr style="margin:30px 0;border:none;border-top:1px solid #e5e7eb;">

          <p style="margin-bottom:0;">
            Thank you,<br><br>
            <strong>Jordan Durst</strong><br>
            Founder, Durst Solutions<br>
            <a href="https://jordandurst.com" style="color:#0ea5e9;">jordandurst.com</a>
          </p>
        </div>
      `,
    });

    console.log("NOTIFICATION EMAIL:", notificationEmail);
    console.log("CONFIRMATION EMAIL:", confirmationEmail);

    if (notificationEmail.error || confirmationEmail.error) {
      console.error("RESEND ERROR:", {
        notificationError: notificationEmail.error,
        confirmationError: confirmationEmail.error,
      });

      return NextResponse.json(
        {
          error: "Lead saved, but one or more emails failed.",
          notificationError: notificationEmail.error,
          confirmationError: confirmationEmail.error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      notificationId: notificationEmail.data?.id,
      confirmationId: confirmationEmail.data?.id,
    });
  } catch (error) {
    console.error("CONTACT API ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong while processing the contact form.",
      },
      { status: 500 }
    );
  }
}