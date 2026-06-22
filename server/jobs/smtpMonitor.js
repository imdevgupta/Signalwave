import { decrypt } from "../services/cryptoService.js";
import { testAuthentication } from "../services/authenticationTester.js";
import SmtpProfile from "../models/SmtpProfile.js";
import SmtpTestHistory from "../models/SmtpTestHistory.js";
import Alert from "../models/Alert.js";
import SystemSetting from "../models/SystemSetting.js";
import { runDiagnostics } from "../services/diagnosticEngine.js";

export async function runScheduledChecks() {
  try {
    /*
|--------------------------------------------------------------------------
| Load Global Settings
|--------------------------------------------------------------------------
*/

    const settings = await SystemSetting.findOne();
    const profiles = await SmtpProfile.find({
      monitoringEnabled: true,
    });

    for (const profile of profiles) {
      const diagnostics = await runDiagnostics({
        host: profile.host,
        port: profile.port,
      });

      try {
        const password = decrypt(profile.encryptedPassword);

        const authResult = await testAuthentication({
          host: profile.host,
          port: profile.port,
          securityMode: profile.securityMode,
          username: profile.username,
          password,
        });

        diagnostics.push(authResult);
      } catch (error) {
        diagnostics.push({
          step: "Authentication",
          status: "fail",
          error: error.message,
        });
      }

      const failed = diagnostics.some((d) => d.status === "fail");

      await SmtpTestHistory.create({
        profileId: profile._id,
        profileName: profile.name,
        host: profile.host,
        port: profile.port,
        securityMode: profile.secure
          ? "SSL/TLS"
          : profile.port === 587
            ? "STARTTLS"
            : "Plain SMTP",
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

      /*
|--------------------------------------------------------------------------
| Create Alert
|--------------------------------------------------------------------------
|
| Alerts can be globally disabled from Settings.
|
*/

      if (failed) {
        if (settings?.enableAlerts === false) {
          console.log(
            `Alerts disabled. Skipping alert creation for ${profile.name}`,
          );
        } else if (!existingAlert) {
          const failedChecks = diagnostics
            .filter((d) => d.status === "fail")
            .map((d) => d.step)
            .join(", ");

          await Alert.create({
            profileId: profile._id,

            profileName: profile.name,

            severity: "critical",

            status: "open",

            message:
              failedChecks.length > 0
                ? `Failed checks: ${failedChecks}`
                : `SMTP monitoring failed for ${profile.name}`,
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
