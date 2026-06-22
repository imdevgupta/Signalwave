import express from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import PasswordResetToken from "../models/PasswordResetToken.js";

import { createUser, authenticateUser } from "../services/authService.js";

import { sendPasswordResetEmail } from "../services/emailService.js";
import { writeAuditLog } from "../services/auditService.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Test Route
|--------------------------------------------------------------------------
*/

router.get("/test", (req, res) => {
  res.json({
    working: true,
  });
});

/*
|--------------------------------------------------------------------------
| Auth Status
|--------------------------------------------------------------------------
*/

router.get("/status", async (req, res) => {
  try {
    const user = req.session?.userId
      ? await User.findById(req.session.userId).select("-passwordHash")
      : null;

    const count = await User.countDocuments();

    res.json({
      setupRequired: count === 0,
      user,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| First Admin Setup
|--------------------------------------------------------------------------
*/

router.post("/setup", async (req, res) => {
  try {
    const count = await User.countDocuments();

    if (count > 0) {
      return res.status(403).json({
        error: "Setup already completed",
      });
    }

    const user = await createUser({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      role: "admin",
    });

    req.session.userId = user._id;

    await writeAuditLog({
      user,
      action: "INITIAL_ADMIN_SETUP",
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

router.post("/login", async (req, res) => {
  try {
    const user = await authenticateUser(req.body.email, req.body.password);

    req.session.userId = user._id;

    await writeAuditLog({
      user,
      action: "LOGIN",
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(401).json({
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

router.post("/logout", async (req, res) => {
  try {
    if (req.session?.userId) {
      const user = await User.findById(req.session.userId);

      if (user) {
        await writeAuditLog({
          user,
          action: "LOGOUT",
          ipAddress: req.ip,
        });
      }
    }

    req.session.destroy(() => {
      res.json({
        success: true,
      });
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Current User
|--------------------------------------------------------------------------
*/

router.get("/me", async (req, res) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({
        error: "Not authenticated",
      });
    }

    const user = await User.findById(req.session.userId).select(
      "-passwordHash",
    );

    if (!user) {
      return res.status(401).json({
        error: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Forgot Password
|--------------------------------------------------------------------------
*/

router.post("/forgot-password", async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase();

    const user = await User.findOne({
      email,
    });

    if (user) {
      await PasswordResetToken.deleteMany({
        userId: user._id,
      });

      const token = crypto.randomBytes(32).toString("hex");

      await PasswordResetToken.create({
        userId: user._id,
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      });

      const resetLink = `http://localhost:5173/reset-password/${token}`;

      await sendPasswordResetEmail(user.email, resetLink);

      await writeAuditLog({
        user,
        action: "PASSWORD_RESET_REQUESTED",
        ipAddress: req.ip,
      });
    }

    res.json({
      success: true,
      message: "If the account exists, a reset link has been sent.",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Reset Password
|--------------------------------------------------------------------------
*/

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    const resetRecord = await PasswordResetToken.findOne({
      token,
    });

    if (!resetRecord) {
      return res.status(400).json({
        error: "Invalid token",
      });
    }

    if (resetRecord.expiresAt < new Date()) {
      return res.status(400).json({
        error: "Token expired",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.findByIdAndUpdate(
      resetRecord.userId,
      {
        passwordHash,
      },
      {
        new: true,
      },
    );

    await PasswordResetToken.deleteOne({
      _id: resetRecord._id,
    });

    await writeAuditLog({
      user,
      action: "PASSWORD_RESET",
      ipAddress: req.ip,
    });

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
