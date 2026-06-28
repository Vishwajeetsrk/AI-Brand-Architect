import * as nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    const host = process.env.EMAIL_HOST;
    if (host) {
      transporter = nodemailer.createTransport({
        host,
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });
    }
  }
  return transporter;
}

export async function sendEmail(to: string, subject: string, html: string, from?: string): Promise<{ sent: boolean; messageId?: string; error?: string }> {
  const t = getTransporter();
  if (!t) return { sent: false, error: 'Email not configured (EMAIL_HOST not set)' };
  try {
    const info = await t.sendMail({
      from: from || process.env.EMAIL_FROM || 'noreply@nexora.ai',
      to, subject, html,
    });
    return { sent: true, messageId: info.messageId };
  } catch (err: any) {
    return { sent: false, error: err.message };
  }
}
