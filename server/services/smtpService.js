import nodemailer from "nodemailer";

export async function testConnection({
  host,
  port,
  secure,
  username,
  password,
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
    socketTimeout: 10000,

    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.verify();

  return {
    success: true,
  };
}
