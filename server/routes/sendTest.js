import express from "express";

import SmtpProfile from "../models/SmtpProfile.js";
import SmtpTestHistory from "../models/SmtpTestHistory.js";
import { requireAuth } from "../middleware/auth.js";
import { decrypt } from "../services/cryptoService.js";
import { sendTestEmail } from "../services/sendTestEmail.js";

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  try {
    const { profileId, toAddress, subject } = req.body;

    const profile = await SmtpProfile.findById(profileId);

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

    const result = await sendTestEmail({
      host: profile.host,
      port: profile.port,
      secure: profile.secure,
      username: profile.username,
      password,
      fromAddress: profile.fromAddress,
      toAddress,
      subject,
    });

    const history = await SmtpTestHistory.create({
      profileId: profile._id,
      profileName: profile.name,
      host: profile.host,
      port: profile.port,
      status: "pass",
      testType: "send-test",
      results: result,
      executedBy: req.user._id,
    });

    res.json({
      success: true,
      historyId: history._id,
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
