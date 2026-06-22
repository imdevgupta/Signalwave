import express from "express";

import SystemSetting from "../models/SystemSetting.js";

import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Get Settings
|--------------------------------------------------------------------------
*/

router.get("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    let settings = await SystemSetting.findOne();

    if (!settings) {
      settings = await SystemSetting.create({});
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Save Settings
|--------------------------------------------------------------------------
*/

router.put("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    let settings = await SystemSetting.findOne();

    if (!settings) {
      settings = await SystemSetting.create({});
    }

    settings.appName = req.body.appName;
    settings.defaultFrequency = req.body.defaultFrequency;
    settings.alertEmail = req.body.alertEmail;
    settings.sessionTimeout = req.body.sessionTimeout;
    settings.failureThreshold = req.body.failureThreshold;
    settings.diagnosticTimeout = req.body.diagnosticTimeout;
    settings.smtpConnectionTimeout = req.body.smtpConnectionTimeout;
    settings.enableAlerts = req.body.enableAlerts;
    settings.autoResolveAlerts = req.body.autoResolveAlerts;

    await settings.save();

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
