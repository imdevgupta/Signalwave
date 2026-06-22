import express from "express";

import SmtpProfile from "../models/SmtpProfile.js";
import SystemSetting from "../models/SystemSetting.js";
import Alert from "../models/Alert.js";
import { requireAuth } from "../middleware/auth.js";
import { encrypt } from "../services/cryptoService.js";
import SmtpTestHistory from "../models/SmtpTestHistory.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const filter =
      req.user.role === "admin"
        ? {}
        : {
            createdBy: req.user._id,
          };

    const profiles = await SmtpProfile.find(filter);

    res.json(
      profiles.map((p) => ({
        id: p._id,
        name: p.name,
        host: p.host,
        port: p.port,
        secure: p.secure,
        username: p.username,
        fromAddress: p.fromAddress,
        hasPassword: !!p.encryptedPassword,
        createdBy: p.createdBy,
      })),
    );
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Create SMTP Profile
|--------------------------------------------------------------------------
*/

router.post("/", requireAuth, async (req, res) => {
  try {
    /*
|--------------------------------------------------------------------------
| Load Global Settings
|--------------------------------------------------------------------------
*/

    const settings = await SystemSetting.findOne();

    const profile = await SmtpProfile.create({
      name: req.body.name,
      host: req.body.host,
      port: req.body.port,
      secure: req.body.secure,
      username: req.body.username,
      encryptedPassword: encrypt(req.body.password),
      fromAddress: req.body.fromAddress,
      monitoringEnabled: true,
      monitoringFrequency: settings?.defaultFrequency || "15m",
      createdBy: req.user._id,
    });
    res.json(profile);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Get Single SMTP Profile
|--------------------------------------------------------------------------
*/

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const profile = await SmtpProfile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({
        error: "Profile not found",
      });
    }

    res.json({
      id: profile._id,
      name: profile.name,
      host: profile.host,
      port: profile.port,
      secure: profile.secure,
      username: profile.username,
      fromAddress: profile.fromAddress,
      createdBy: profile.createdBy,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Update SMTP Profile
|--------------------------------------------------------------------------
*/

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const profile = await SmtpProfile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({
        error: "Profile not found",
      });
    }

    const canEdit =
      req.user.role === "admin" ||
      String(profile.createdBy) === String(req.user._id);

    if (!canEdit) {
      return res.status(403).json({
        error: "Access denied",
      });
    }

    profile.name = req.body.name;
    profile.host = req.body.host;
    profile.port = req.body.port;
    profile.secure = req.body.secure;
    profile.username = req.body.username;
    profile.fromAddress = req.body.fromAddress;

    if (req.body.password) {
      profile.encryptedPassword = encrypt(req.body.password);
    }

    await profile.save();

    res.json({
      success: true,
      profile,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const profile = await SmtpProfile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({
        error: "Profile not found",
      });
    }

    const canDelete =
      req.user.role === "admin" ||
      String(profile.createdBy) === String(req.user._id);

    if (!canDelete) {
      return res.status(403).json({
        error: "Access denied",
      });
    }

    /*
|--------------------------------------------------------------------------
| Delete Related Test History
|--------------------------------------------------------------------------
*/

    await SmtpTestHistory.deleteMany({
      profileId: profile._id,
    });

    /*
|--------------------------------------------------------------------------
| Delete Related Alerts
|--------------------------------------------------------------------------
|
| Prevent orphan alerts after a profile
| has been removed.
|
*/

    await Alert.deleteMany({
      profileId: profile._id,
    });

    /*
    |--------------------------------------------------------------------------
    | Delete Profile
    |--------------------------------------------------------------------------
    */

    await profile.deleteOne();

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Update Monitoring Settings
|--------------------------------------------------------------------------
*/

router.patch("/:id/monitoring", requireAuth, async (req, res) => {
  try {
    const profile = await SmtpProfile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({
        error: "Profile not found",
      });
    }

    profile.monitoringEnabled = req.body.monitoringEnabled;

    profile.monitoringFrequency = req.body.monitoringFrequency;

    await profile.save();

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;
