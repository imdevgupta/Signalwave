import nodemailer from "nodemailer";

export async function testAuthentication({
  host,
  port,
  securityMode = "auto",
  username,
  password,
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

    auth: {
      user: username,
      pass: password,
    },

    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.verify();

  return {
    step: "Authentication",
    status: "pass",
    securityMode,
  };
}
