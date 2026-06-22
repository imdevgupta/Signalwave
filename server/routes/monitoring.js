import express from "express";
import SmtpProfile from "../models/SmtpProfile.js";
import SmtpTestHistory from "../models/SmtpTestHistory.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Monitoring Dashboard Data
|--------------------------------------------------------------------------
*/

router.get("/dashboard", requireAuth, async (req, res) => {
  try {
    const profileFilter =
      req.user.role === "admin"
        ? {
            monitoringEnabled: true,
          }
        : {
            monitoringEnabled: true,
            createdBy: req.user._id,
          };

    const profiles = await SmtpProfile.find(profileFilter);

    const dashboard = [];

    for (const profile of profiles) {
      const history = await SmtpTestHistory.find({
        profileId: profile._id,
        testType: "scheduled-monitor",
      }).sort({
        createdAt: -1,
      });

      const totalChecks = history.length;

      const failures = history.filter((item) => item.status === "fail").length;

      const successRate =
        totalChecks === 0
          ? 0
          : Number((((totalChecks - failures) / totalChecks) * 100).toFixed(1));

      dashboard.push({
        profileId: profile._id,

        profileName: profile.name,

        owner: req.user.role === "admin" ? profile.createdBy : undefined,

        frequency: profile.monitoringFrequency,

        enabled: profile.monitoringEnabled,

        status: history[0]?.status || "unknown",

        lastCheck: history[0]?.createdAt || null,

        totalChecks,

        failures,

        successRate,
      });
    }

    res.json(dashboard);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;
