import express from "express";
import Alert from "../models/Alert.js";
import SmtpProfile from "../models/SmtpProfile.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Get Alerts
|--------------------------------------------------------------------------
|
| Admin:
|   Can view all alerts.
|
| Member:
|   Can view alerts only for profiles they own.
|
*/

router.get("/", requireAuth, async (req, res) => {
  try {
    /*
    --------------------------------------------------------------------------
    | Admin
    --------------------------------------------------------------------------
    */

    if (req.user.role === "admin") {
      const alerts = await Alert.find().sort({
        createdAt: -1,
      });

      return res.json(alerts);
    }

    /*
    --------------------------------------------------------------------------
    | Member / Viewer
    --------------------------------------------------------------------------
    */

    const profiles = await SmtpProfile.find({
      createdBy: req.user._id,
    }).select("_id");

    const profileIds = profiles.map((p) => p._id);

    const alerts = await Alert.find({
      profileId: {
        $in: profileIds,
      },
    }).sort({
      createdAt: -1,
    });

    res.json(alerts);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});
/*
|--------------------------------------------------------------------------
| Acknowledge Alert
|--------------------------------------------------------------------------
*/

router.patch("/:id/acknowledge", requireAuth, async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        error: "Alert not found",
      });
    }

    alert.status = "acknowledged";

    await alert.save();

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
| Resolve Alert
|--------------------------------------------------------------------------
*/

router.patch("/:id/resolve", requireAuth, async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        error: "Alert not found",
      });
    }

    alert.status = "resolved";

    alert.resolvedAt = new Date();

    await alert.save();

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
