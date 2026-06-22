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
  });

  await transporter.verify();

  return {
    step: "Authentication",
    status: "pass",
  };
}
