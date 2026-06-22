import cron from "node-cron";

import { runScheduledChecks } from "./smtpMonitor.js";

export function startCronJobs() {
  cron.schedule("*/15 * * * *", async () => {
    console.log("Running scheduled SMTP monitoring...");

    await runScheduledChecks();
  });

  console.log("SMTP monitoring cron started");
}
