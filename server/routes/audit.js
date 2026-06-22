import express from "express";

import AuditLog from "../models/AuditLog.js";

import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("userId", "email name")
      .sort({
        createdAt: -1,
      })
      .limit(500);

    res.json(logs);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;
