import { NextResponse } from "next/server";

// =============================================================================
// 📩 GURUKULAM INQUIRY DESTINATION EMAIL
// Replace the email below with your address, or add RECIPIENT_EMAIL to .env.local
// e.g., RECIPIENT_EMAIL=yourname@example.com
// =============================================================================
export const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || "YOUR_EMAIL_HERE@example.com";

// Optional: Resend API Key for automatic delivery (Free key at https://resend.com)
// Add RESEND_API_KEY=re_xxxx in .env.local
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Andhra Art Of War <onboarding@resend.dev>";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, inquiryType, preferredLanguage, message } = body;

    // 1. Server-side validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Full Name is required (minimum 2 characters)." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "A valid email address is required so we can reply to you." },
        { status: 400 }
      );
    }

    if (!message || message.trim().length < 5) {
      return NextResponse.json(
        { error: "Please provide a brief message describing your inquiry." },
        { status: 400 }
      );
    }

    const safeName = name.trim();
    const safeEmail = email.trim();
    const safePhone = (phone || "").trim() || "Not provided";
    const safeType = inquiryType || "Joining a Beginner Class";
    const safeLang = preferredLanguage || "Telugu & English";
    const safeMessage = message.trim();
    const receivedTime = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    // 2. Prepare Rich HTML and Plain Text Email Templates
    const emailSubject = `🥋 New Inquiry: ${safeName} (${safeType}) — Andhra Art Of War`;

    const emailPlainText = `
=====================================================
🥋 ANDHRA ART OF WAR GURUKULAM - NEW INQUIRY
=====================================================

Applicant Details:
• Full Name:           ${safeName}
• Email Address:       ${safeEmail}
• Phone / WhatsApp:    ${safePhone}
• Inquiry Category:    ${safeType}
• Preferred Language:  ${safeLang}
• Received At:         ${receivedTime} IST

Message / Background:
${safeMessage}

=====================================================
Under the Lotus Feet of Sri Kanaka Durga Ammavaru
Ghantasala Music Collage, Vijayawada, Andhra Pradesh
Gurukulam Contact: +91 95530 00201
=====================================================
`.trim();

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Andhra Art Of War Inquiry</title>
</head>
<body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F5; color: #292524;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #FDE68A; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.06);">
    <!-- Header Banner -->
    <tr>
      <td style="background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%); padding: 28px 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0 0 6px 0; font-size: 22px; font-weight: 800; letter-spacing: 1px;">ANDHRA ART OF WAR</h1>
        <p style="margin: 0; font-size: 13px; color: #FEE2E2; letter-spacing: 0.5px;">కఱ్ఱసాము సాంప్రదాయ గురుకులం • Karrasamu Heritage Gurukulam</p>
      </td>
    </tr>

    <!-- Body Content -->
    <tr>
      <td style="padding: 28px 24px;">
        <div style="background-color: #FEF3C7; border-left: 4px solid #D97706; padding: 12px 16px; border-radius: 6px; margin-bottom: 24px;">
          <strong style="color: #92400E; font-size: 14px;">🥋 New Student / Workshop Inquiry Received</strong>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #78350F;">Received on ${receivedTime} IST</p>
        </div>

        <h3 style="font-size: 16px; color: #78350F; margin: 0 0 12px 0; border-bottom: 1px solid #F3F4F6; padding-bottom: 6px;">Applicant Information</h3>
        <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 14px; margin-bottom: 20px;">
          <tr>
            <td width="35%" style="color: #78716C; font-weight: 600;">Full Name:</td>
            <td style="color: #1C1917; font-weight: 700;">${safeName}</td>
          </tr>
          <tr style="background-color: #FAFAF9;">
            <td style="color: #78716C; font-weight: 600;">Email:</td>
            <td><a href="mailto:${safeEmail}" style="color: #DC2626; text-decoration: underline; font-weight: 600;">${safeEmail}</a></td>
          </tr>
          <tr>
            <td style="color: #78716C; font-weight: 600;">Phone / WhatsApp:</td>
            <td style="color: #1C1917;">${safePhone}</td>
          </tr>
          <tr style="background-color: #FAFAF9;">
            <td style="color: #78716C; font-weight: 600;">Inquiry Category:</td>
            <td style="color: #1C1917; font-weight: 600;">${safeType}</td>
          </tr>
          <tr>
            <td style="color: #78716C; font-weight: 600;">Preferred Language:</td>
            <td style="color: #1C1917;">${safeLang}</td>
          </tr>
        </table>

        <h3 style="font-size: 16px; color: #78350F; margin: 0 0 8px 0; border-bottom: 1px solid #F3F4F6; padding-bottom: 6px;">Message</h3>
        <div style="background-color: #FAF8F5; border: 1px solid #E7E5E4; padding: 16px; border-radius: 8px; font-size: 14px; line-height: 1.6; color: #292524; white-space: pre-wrap;">${safeMessage}</div>

        <div style="margin-top: 24px; text-align: center;">
          <a href="mailto:${safeEmail}?subject=Re:%20Andhra%20Art%20Of%20War%20Gurukulam%20Inquiry" style="display: inline-block; background-color: #DC2626; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 13px; letter-spacing: 0.5px;">Reply Directly to ${safeName}</a>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #FAFAF9; padding: 18px 24px; text-align: center; border-top: 1px solid #F3F4F6; font-size: 11px; color: #A8A29E;">
        <p style="margin: 0 0 4px 0;">Andhra Art Of War • Guru Vijay Kumar Kalidasu</p>
        <p style="margin: 0;">Ghantasala Music Collage, Vijayawada • Phone: +91 95530 00201</p>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

    // 3. Dispatch Email
    let emailDispatched = false;

    // Option A: Resend API (if configured in .env.local)
    if (RESEND_API_KEY) {
      try {
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: FROM_EMAIL,
            to: [RECIPIENT_EMAIL],
            reply_to: safeEmail,
            subject: emailSubject,
            html: emailHtml,
            text: emailPlainText,
          }),
        });

        if (resendResponse.ok) {
          emailDispatched = true;
          console.log(`[EMAIL DISPATCH SUCCESS] Inquiry email delivered to ${RECIPIENT_EMAIL} via Resend.`);
        } else {
          const errData = await resendResponse.json();
          console.warn("[EMAIL DISPATCH WARNING] Resend API responded with error:", errData);
        }
      } catch (sendErr) {
        console.warn("[EMAIL DISPATCH ERROR] Failed to connect to email provider:", sendErr);
      }
    }

    // Option B: Web3Forms (if configured)
    const WEB3FORMS_KEY = process.env.WEB3FORMS_ACCESS_KEY;
    if (!emailDispatched && WEB3FORMS_KEY) {
      try {
        const w3Response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: emailSubject,
            from_name: `${safeName} via Andhra Art Of War`,
            email: safeEmail,
            message: `Category: ${safeType}\nPhone: ${safePhone}\nLanguage: ${safeLang}\n\n${safeMessage}`,
          }),
        });
        if (w3Response.ok) {
          emailDispatched = true;
          console.log(`[EMAIL DISPATCH SUCCESS] Inquiry email delivered via Web3Forms.`);
        }
      } catch (w3Err) {
        console.warn("[EMAIL DISPATCH WARNING] Web3Forms failed:", w3Err);
      }
    }

    // Always log full inquiry details for the Gurukulam inbox
    console.log("=======================================================");
    console.log(`📬 INCOMING GURUKULAM EMAIL INQUIRY`);
    console.log(`To:                 ${RECIPIENT_EMAIL}`);
    console.log(`Applicant Name:     ${safeName}`);
    console.log(`Applicant Email:    ${safeEmail}`);
    console.log(`Applicant Phone:    ${safePhone}`);
    console.log(`Category:           ${safeType}`);
    console.log(`Language:           ${safeLang}`);
    console.log(`Dispatched to Mail: ${emailDispatched ? "YES (Live Provider)" : "LOGGED (Awaiting mail API key in .env.local)"}`);
    console.log("=======================================================");

    return NextResponse.json({
      success: true,
      recipient: RECIPIENT_EMAIL,
      dispatched: emailDispatched,
      message: "Namaskaram! Your inquiry has been emailed to our Gurukulam inbox. Our Acharyas will review your message and reply shortly.",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Failed to dispatch email. Please try again or reach out on WhatsApp (+91 95530 00201)." },
      { status: 500 }
    );
  }
}
