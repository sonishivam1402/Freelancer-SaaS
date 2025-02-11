import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { meetingScheduledTemplate } from "@/lib/emailTemplates";

export async function POST(req: Request) {
  try {
    const { to, client, date, meetLink } = await req.json();

    if (!to || !client || !date || !meetLink) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const { subject, html } = meetingScheduledTemplate(client, new Date(date).toLocaleString(), meetLink);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Follow-Up Scheduler" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      html, // Using HTML template
    });

    return NextResponse.json({ message: "Email sent successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
  }
}
