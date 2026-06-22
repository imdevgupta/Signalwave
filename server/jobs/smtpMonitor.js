import SmtpProfile from "../models/SmtpProfile.js";
import SmtpTestHistory from "../models/SmtpTestHistory.js";
import Alert from "../models/Alert.js";

import { runDiagnostics } from "../services/diagnosticEngine.js";

export async function runScheduledChecks() {
  try {
    const profiles = await SmtpProfile.find({
      monitoringEnabled: true,
    });

    for (const profile of profiles) {
      const diagnostics = await runDiagnostics({
        host: profile.host,
        port: profile.port,
      });

      const failed = diagnostics.some((d) => d.status === "fail");

      await SmtpTestHistory.create({
        profileId: profile._id,
        profileName: profile.name,
        host: profile.host,
        port: profile.port,
        status: failed ? "fail" : "pass",
        testType: "scheduled-monitor",
        results: diagnostics,
      });

      /*
      |--------------------------------------------------------------------------
      | Alert Handling
      |--------------------------------------------------------------------------
      */

      const existingAlert = await Alert.findOne({
        profileId: profile._id,
        status: "open",
      });

      if (failed) {
        if (!existingAlert) {
          await Alert.create({
            profileId: profile._id,
            profileName: profile.name,
            severity: "critical",
            status: "open",
            message: `SMTP monitoring failed for ${profile.name}`,
          });

          console.log(`Alert created for ${profile.name}`);
        }
      } else {
        if (existingAlert) {
          existingAlert.status = "resolved";

          existingAlert.resolvedAt = new Date();

          await existingAlert.save();

          console.log(`Alert resolved for ${profile.name}`);
        }
      }

      console.log(`Monitoring completed for ${profile.name}`);
    }

    console.log("Scheduled SMTP checks completed");
  } catch (error) {
    console.error(error);
  }
}
