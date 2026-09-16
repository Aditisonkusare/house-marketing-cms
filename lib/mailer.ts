import nodemailer from "nodemailer";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  auth:
    process.env.SMTP_USER && process.env.SMTP_PASS
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
});

export async function sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const from = process.env.SMTP_FROM;
  if (!from) {
    throw new Error("SMTP_FROM must be set to send email");
  }

  // Resend's HTTP API is used when configured (RESEND_API_KEY set) instead of
  // raw SMTP: serverless platforms like Vercel frequently can't make reliable
  // outbound SMTP connections (works fine locally, then fails with something
  // like "Greeting never received" once deployed). Local dev (Mailpit) has no
  // HTTP API, so it keeps using SMTP via nodemailer below.
  if (resend) {
    const { error } = await resend.emails.send({ from, to, subject, html });
    if (error) {
      throw new Error(error.message);
    }
    return;
  }

  await transporter.sendMail({ from, to, subject, html });
}
