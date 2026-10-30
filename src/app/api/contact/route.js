import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, contact, inquiryType, preferredLanguage, message } = body;

    // Server-side validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Full Name is required (minimum 2 characters)." },
        { status: 400 }
      );
    }

    if (!contact || contact.trim().length < 6) {
      return NextResponse.json(
        { error: "A valid Phone number or Email address is required." },
        { status: 400 }
      );
    }

    if (!message || message.trim().length < 5) {
      return NextResponse.json(
        { error: "Please provide a brief message describing your inquiry." },
        { status: 400 }
      );
    }

    // In production, this can hook to Resend or school SMTP server
    console.log("New Karrasamu Gurukulam Inquiry Received:", {
      name,
      contact,
      inquiryType: inquiryType || "Joining a Class",
      preferredLanguage: preferredLanguage || "English / Telugu",
      message,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Namaskaram! Your inquiry has been received. Our Acharyas will reach out shortly.",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Failed to process inquiry. Please try again or message via WhatsApp." },
      { status: 500 }
    );
  }
}
