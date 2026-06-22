import express from "express";
import { requireAuth } from "../middleware/auth.js";
import SmtpTestHistory from "../models/SmtpTestHistory.js";
import SmtpProfile from "../models/SmtpProfile.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Get History
|--------------------------------------------------------------------------
*/

router.get("/", requireAuth, async (req, res) => {
  try {
    let filter = {};

    if (req.user.role !== "admin") {
      const profiles = await SmtpProfile.find({
        createdBy: req.user._id,
      }).select("_id");

      const profileIds = profiles.map((p) => p._id);

      filter.profileId = {
        $in: profileIds,
      };
    }

    const history = await SmtpTestHistory.find(filter)
      .sort({
        createdAt: -1,
      })
      .limit(100);

    res.json(history);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Get Single History Record
|--------------------------------------------------------------------------
*/

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const item = await SmtpTestHistory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        error: "History not found",
      });
    }

    if (req.user.role !== "admin") {
      const profile = await SmtpProfile.findById(item.profileId);

      const canAccess =
        profile && String(profile.createdBy) === String(req.user._id);

      if (!canAccess) {
        return res.status(403).json({
          error: "Access denied",
        });
      }
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;
