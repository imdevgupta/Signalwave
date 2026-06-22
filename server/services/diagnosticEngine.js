import dns from "dns/promises";
import net from "net";
import tls from "tls";

/*
|--------------------------------------------------------------------------
| DNS Lookup
|--------------------------------------------------------------------------
*/

async function dnsLookup(host) {
  const start = Date.now();

  const addresses = await dns.lookup(host, {
    all: true,
  });

  return {
    step: "DNS Resolution",
    status: "pass",
    durationMs: Date.now() - start,
    addresses,
  };
}

/*
|--------------------------------------------------------------------------
| TCP Connection
|--------------------------------------------------------------------------
*/

async function tcpConnect(host, port) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const socket = net.createConnection({
      host,
      port,
    });

    socket.setTimeout(10000);

    socket.once("connect", () => {
      socket.destroy();

      resolve({
        step: "TCP Connection",
        status: "pass",
        durationMs: Date.now() - start,
      });
    });

    socket.once("timeout", () => {
      socket.destroy();

      reject(new Error(`Connection timeout after 10000ms`));
    });

    socket.once("error", (error) => {
      socket.destroy();
      reject(error);
    });
  });
}

/*
|--------------------------------------------------------------------------
| SMTP Banner
|--------------------------------------------------------------------------
*/

async function smtpBanner(host, port) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const socket = net.createConnection({
      host,
      port,
    });

    socket.setTimeout(10000);

    socket.once("data", (data) => {
      const banner = data.toString("utf8").trim();

      socket.destroy();

      resolve({
        step: "SMTP Banner",
        status: banner.startsWith("220") ? "pass" : "fail",
        durationMs: Date.now() - start,
        banner,
      });
    });

    socket.once("timeout", () => {
      socket.destroy();

      reject(new Error(`SMTP banner timeout after 10000ms`));
    });

    socket.once("error", (error) => {
      socket.destroy();
      reject(error);
    });
  });
}

/*
|--------------------------------------------------------------------------
| Main Diagnostic Runner
|--------------------------------------------------------------------------
*/

export async function runDiagnostics({ host, port }) {
  const results = [];

  /*
  --------------------------------------------------------------------------
  DNS
  --------------------------------------------------------------------------
  */

  try {
    const dnsResult = await dnsLookup(host);

    results.push(dnsResult);
  } catch (error) {
    results.push({
      step: "DNS Resolution",
      status: "fail",
      error: error.message,
    });

    return results;
  }

  /*
  --------------------------------------------------------------------------
  TCP
  --------------------------------------------------------------------------
  */

  try {
    const tcpResult = await tcpConnect(host, port);

    results.push(tcpResult);
  } catch (error) {
    results.push({
      step: "TCP Connection",
      status: "fail",
      error: error.message,
    });

    return results;
  }

  /*
  --------------------------------------------------------------------------
  SMTP Banner
  --------------------------------------------------------------------------
  */

  try {
    const bannerResult = await smtpBanner(host, port);

    results.push(bannerResult);
  } catch (error) {
    results.push({
      step: "SMTP Banner",
      status: "fail",
      error: error.message,
    });

    return results;
  }

  try {
    const ehloResult = await ehloCapabilities(host, port);

    results.push(ehloResult);
  } catch (error) {
    results.push({
      step: "EHLO Capabilities",
      status: "fail",
      error: error.message,
    });
  }

  try {
    const tlsResult = await startTlsCheck(host, port);

    results.push(tlsResult);
  } catch (error) {
    results.push({
      step: "STARTTLS",
      status: "fail",
      error: error.message,
    });
  }

  return results;
}

async function ehloCapabilities(host, port) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({
      host,
      port,
    });

    socket.setTimeout(10000);

    let gotBanner = false;
    let responseBuffer = "";

    socket.on("data", (data) => {
      const response = data.toString("utf8");

      // First response = SMTP banner
      if (!gotBanner) {
        gotBanner = true;

        socket.write("EHLO signalwave.local\r\n");

        return;
      }

      responseBuffer += response;

      // Multi-line EHLO responses end with "250 "
      if (
        responseBuffer.includes("\r\n250 ") ||
        responseBuffer.startsWith("250 ")
      ) {
        const capabilities = [];

        if (responseBuffer.includes("STARTTLS")) capabilities.push("STARTTLS");

        if (responseBuffer.includes("AUTH")) capabilities.push("AUTH");

        if (responseBuffer.includes("PIPELINING"))
          capabilities.push("PIPELINING");

        if (responseBuffer.includes("8BITMIME")) capabilities.push("8BITMIME");

        if (responseBuffer.includes("SMTPUTF8")) capabilities.push("SMTPUTF8");

        if (responseBuffer.includes("SIZE")) capabilities.push("SIZE");

        socket.destroy();

        resolve({
          step: "EHLO Capabilities",
          status: "pass",
          capabilities,
          raw: responseBuffer,
        });
      }
    });

    socket.once("timeout", () => {
      socket.destroy();

      reject(new Error("EHLO timeout"));
    });

    socket.once("error", reject);
  });
}

async function startTlsCheck(host, port) {
  if (Number(port) === 465) {
    return {
      step: "STARTTLS",
      status: "pass",
      message: "Implicit SSL/TLS Port",
    };
  }
  
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({
      host,
      port,
    });

    socket.setTimeout(10000);

    let stage = "banner";

    socket.on("data", (data) => {
      const response = data.toString();

      if (stage === "banner") {
        socket.write("EHLO signalwave.local\r\n");
        stage = "ehlo";
        return;
      }

      if (stage === "ehlo") {
        if (!response.includes("STARTTLS")) {
          socket.destroy();

          return resolve({
            step: "STARTTLS",
            status: "warn",
            message: "Server does not advertise STARTTLS",
          });
        }

        socket.write("STARTTLS\r\n");
        stage = "starttls";
        return;
      }

      if (stage === "starttls") {
        if (!response.startsWith("220")) {
          socket.destroy();

          return reject(new Error("STARTTLS command rejected"));
        }

        const secureSocket = tls.connect({
          socket,
          servername: host,
          rejectUnauthorized: false,
        });

        secureSocket.once("secureConnect", () => {
          const cert = secureSocket.getPeerCertificate();

          const protocol = secureSocket.getProtocol();

          secureSocket.destroy();

          resolve({
            step: "STARTTLS",
            status: "pass",
            tlsVersion: protocol,
            subject: cert.subject?.CN,
            issuer: cert.issuer?.CN,
          });
        });

        secureSocket.once("error", reject);
      }
    });

    socket.once("timeout", () => {
      socket.destroy();
      reject(new Error("STARTTLS timeout"));
    });

    socket.once("error", reject);
  });
}
