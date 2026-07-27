import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "pucnotesnsolutions@gmail.com";

const VALID_CATEGORIES = [
  "General Enquiry",
  "Report Broken PDF",
  "Content Correction",
  "Suggest a Feature",
  "Collaboration",
  "Advertisement",
  "Copyright / DMCA",
  "Other",
] as const;

interface ContactPayload {
  name?: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  pageUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ContactPayload;
    const { name, email, category, subject, message, pageUrl } = body;

    // ── Validation ──
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!subject || subject.trim().length === 0) {
      return NextResponse.json(
        { error: "Subject is required." },
        { status: 400 }
      );
    }

    if (!message || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters." },
        { status: 400 }
      );
    }

    if (!category || !VALID_CATEGORIES.includes(category as typeof VALID_CATEGORIES[number])) {
      return NextResponse.json(
        { error: "Please select a valid category." },
        { status: 400 }
      );
    }

    // ── Build email ──
    const senderName = name?.trim() || "Anonymous";
    const timestamp = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f8f9fa; border-radius: 12px; padding: 24px; margin-bottom: 16px;">
          <h2 style="margin: 0 0 4px; color: #1a1a1a;">New Contact Form Submission</h2>
          <p style="margin: 0; color: #666; font-size: 14px;">${timestamp} IST</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; font-weight: 600; color: #555; width: 120px;">Name</td>
            <td style="padding: 12px 8px; color: #1a1a1a;">${senderName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; font-weight: 600; color: #555;">Email</td>
            <td style="padding: 12px 8px; color: #1a1a1a;"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; font-weight: 600; color: #555;">Category</td>
            <td style="padding: 12px 8px; color: #1a1a1a;">
              <span style="background: #e8f0fe; color: #1a56db; padding: 2px 10px; border-radius: 12px; font-size: 13px;">${category}</span>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; font-weight: 600; color: #555;">Subject</td>
            <td style="padding: 12px 8px; color: #1a1a1a;">${subject}</td>
          </tr>
          ${pageUrl ? `
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; font-weight: 600; color: #555;">Page URL</td>
            <td style="padding: 12px 8px; color: #1a1a1a;"><a href="${pageUrl}" style="color: #2563eb;">${pageUrl}</a></td>
          </tr>
          ` : ""}
        </table>

        <div style="margin-top: 20px; padding: 20px; background: #fafafa; border-radius: 8px; border-left: 4px solid #2563eb;">
          <p style="margin: 0 0 8px; font-weight: 600; color: #555; font-size: 13px;">MESSAGE</p>
          <p style="margin: 0; color: #1a1a1a; white-space: pre-wrap; line-height: 1.6;">${message}</p>
        </div>

        <p style="margin-top: 20px; font-size: 12px; color: #999; text-align: center;">
          Sent from PUC Notes Contact Form
        </p>
      </div>
    `;

    // ── Send via Resend ──
    const { error } = await resend.emails.send({
      from: "PUC Notes <onboarding@resend.dev>",
      to: [CONTACT_EMAIL],
      replyTo: email,
      subject: `[${category}] ${subject}`,
      html: htmlBody,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Your message has been sent successfully." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
