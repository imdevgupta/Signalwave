import express from "express";
import SmtpProfile from "../models/SmtpProfile.js";
import SmtpTestHistory from "../models/SmtpTestHistory.js";
import { requireAuth } from "../middleware/auth.js";
import { runDiagnostics } from "../services/diagnosticEngine.js";
import { decrypt } from "../services/cryptoService.js";
import { testAuthentication } from "../services/authenticationTester.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Run Diagnostics
|--------------------------------------------------------------------------
*/

router.post("/run/:profileId", requireAuth, async (req, res) => {
  try {
    const profile = await SmtpProfile.findById(req.params.profileId);

    if (!profile) {
      return res.status(404).json({
        error: "Profile not found",
      });
    }

    const canAccess =
      req.user.role === "admin" ||
      String(profile.createdBy) === String(req.user._id);

    if (!canAccess) {
      return res.status(403).json({
        error: "Access denied",
      });
    }

    const password = decrypt(profile.encryptedPassword);
    if (!profile) {
      return res.status(404).json({
        error: "Profile not found",
      });
    }
    const diagnostics = await runDiagnostics({
      host: profile.host,
      port: profile.port,
    });
    try {
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
    const hasFail = diagnostics.some((step) => step.status === "fail");

    const history = await SmtpTestHistory.create({
      profileId: profile._id,
      profileName: profile.name,
      host: profile.host,
      port: profile.port,
      securityMode: profile.secure
        ? "SSL/TLS"
        : profile.port === 587
          ? "STARTTLS"
          : "Plain SMTP",
      status: hasFail ? "fail" : "pass",
      testType: "diagnostics",
      results: diagnostics,
      executedBy: req.user._id,
    });

    res.json({
      success: true,
      historyId: history._id,
      diagnostics,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Test History
|--------------------------------------------------------------------------
*/

router.get("/history", requireAuth, async (req, res) => {
  try {
    const page = Number(req.query.page || 1);

    const limit = Number(req.query.limit || 20);

    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.type) {
      filter.testType = req.query.type;
    }

    const [items, total] = await Promise.all([
      SmtpTestHistory.find(filter)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      SmtpTestHistory.countDocuments(filter),
    ]);

    res.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      items,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;
