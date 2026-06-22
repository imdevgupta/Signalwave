import nodemailer from "nodemailer";

export async function testAuthentication({
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

    auth: {
      user: username,
      pass: password,
    },

    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,

    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.verify();

  return {
    step: "Authentication",
    status: "pass",
    username,
  };
}
