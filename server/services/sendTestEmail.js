import nodemailer from "nodemailer";

export async function sendTestEmail({
  host,
  port,
  securityMode = "auto",
  username,
  password,
  fromAddress,
  toAddress,
  subject,
}) {
  let secure = false;

  let requireTLS = false;

  switch (securityMode) {
    case "ssl":
      secure = true;
      break;

    case "starttls":
      requireTLS = true;
      break;

    case "none":
      break;

    case "auto":
    default:
      if (Number(port) === 465) {
        secure = true;
      }

      if (Number(port) === 587) {
        requireTLS = true;
      }

      break;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,

    secure,

    requireTLS,

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
