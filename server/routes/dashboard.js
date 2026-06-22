import express from "express";
import User from "../models/User.js";
import SmtpProfile from "../models/SmtpProfile.js";
import SmtpTestHistory from "../models/SmtpTestHistory.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/stats", requireAuth, async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";

    const profileFilter = isAdmin
      ? {}
      : {
          createdBy: req.user._id,
        };

    const profiles = await SmtpProfile.find(profileFilter).select("_id");

    const profileIds = profiles.map((p) => p._id);

    const historyFilter = isAdmin
      ? {}
      : {
          profileId: {
            $in: profileIds,
          },
        };

    const [users, profileCount, tests, passed, failed, sendTests, diagnostics] =
      await Promise.all([
        isAdmin ? User.countDocuments() : 0,

        SmtpProfile.countDocuments(profileFilter),

        SmtpTestHistory.countDocuments(historyFilter),

        SmtpTestHistory.countDocuments({
          ...historyFilter,
          status: "pass",
        }),

        SmtpTestHistory.countDocuments({
          ...historyFilter,
          status: "fail",
        }),

        SmtpTestHistory.countDocuments({
          ...historyFilter,
          testType: "send-test",
        }),

        SmtpTestHistory.countDocuments({
          ...historyFilter,
          testType: "diagnostics",
        }),
      ]);

    const recentFailures = await SmtpTestHistory.countDocuments({
      ...historyFilter,
      status: "fail",
      createdAt: {
        $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    });

    const passRate =
      tests === 0 ? 0 : Number(((passed / tests) * 100).toFixed(2));

    const failRate =
      tests === 0 ? 0 : Number(((failed / tests) * 100).toFixed(2));

    res.json({
      users,
      profiles: profileCount,
      tests,
      diagnostics,
      sendTests,
      passed,
      failed,
      passRate,
      failRate,
      recentFailures,
      isAdmin,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Pass / Fail Chart
|--------------------------------------------------------------------------
*/

router.get("/pass-fail", requireAuth, async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";

    const profileFilter = isAdmin
      ? {}
      : {
          createdBy: req.user._id,
        };

    const profiles = await SmtpProfile.find(profileFilter).select("_id");

    const profileIds = profiles.map((p) => p._id);

    const historyFilter = isAdmin
      ? {}
      : {
          profileId: {
            $in: profileIds,
          },
        };

    const passed = await SmtpTestHistory.countDocuments({
      ...historyFilter,
      status: "pass",
    });

    const failed = await SmtpTestHistory.countDocuments({
      ...historyFilter,
      status: "fail",
    });

    res.json({
      passed,
      failed,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Last 7 Days Activity
|--------------------------------------------------------------------------
*/

router.get("/activity", requireAuth, async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";

    const profileFilter = isAdmin
      ? {}
      : {
          createdBy: req.user._id,
        };

    const profiles = await SmtpProfile.find(profileFilter).select("_id");

    const profileIds = profiles.map((p) => p._id);

    const historyFilter = isAdmin
      ? {}
      : {
          profileId: {
            $in: profileIds,
          },
        };

    const data = [];

    for (let i = 6; i >= 0; i--) {
      const start = new Date();

      start.setDate(start.getDate() - i);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);

      end.setHours(23, 59, 59, 999);

      const count = await SmtpTestHistory.countDocuments({
        ...historyFilter,
        createdAt: {
          $gte: start,
          $lte: end,
        },
      });

      data.push({
        date: start.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        tests: count,
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Recent Failures
|--------------------------------------------------------------------------
*/

router.get("/recent-failures", requireAuth, async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";

    const profileFilter = isAdmin
      ? {}
      : {
          createdBy: req.user._id,
        };

    const profiles = await SmtpProfile.find(profileFilter).select("_id");

    const profileIds = profiles.map((p) => p._id);

    const historyFilter = isAdmin
      ? {}
      : {
          profileId: {
            $in: profileIds,
          },
        };

    const failures = await SmtpTestHistory.find({
      ...historyFilter,
      status: "fail",
    })
      .sort({
        createdAt: -1,
      })
      .limit(10);

    res.json(failures);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});
export default router;
