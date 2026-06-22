import nodemailer from "nodemailer";

export async function sendTestEmail({
  host,
  port,
  secure,
  username,
  password,
  fromAddress,
  toAddress,
  subject,
}) {
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,

    auth: username
      ? {
          user: username,
          pass: password,
        }
      : undefined,

    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,

    tls: {
      rejectUnauthorized: false,
    },
  });

  const timestamp = new Date().toISOString();

  const info = await transporter.sendMail({
    from: fromAddress || username,

    to: toAddress,

    subject: subject || `Signalwave SMTP Test - ${timestamp}`,

    text: `This is a Signalwave SMTP test email.\n\nSent: ${timestamp}\nHost: ${host}:${port}`,

    html: `
        <h3>Signalwave SMTP Test</h3>
        <p>Sent: ${timestamp}</p>
        <p>Host: ${host}:${port}</p>
      `,
  });

  return {
    messageId: info.messageId,

    accepted: info.accepted,

    rejected: info.rejected,

    response: info.response,

    envelope: info.envelope,
  };
}
