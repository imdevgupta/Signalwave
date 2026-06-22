import express from "express";
import User from "../models/User.js";
import { createUser } from "../services/authService.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { writeAuditLog } from "../services/auditService.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| List Users
|--------------------------------------------------------------------------
*/

router.get("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash").sort({
      createdAt: -1,
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Create User
|--------------------------------------------------------------------------
*/

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const user = await createUser({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      role: req.body.role || "member",
    });

    await writeAuditLog({
      user: req.user,
      action: "CREATE_USER",
      details: {
        createdUserEmail: user.email,
        role: user.role,
      },
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Delete User
|--------------------------------------------------------------------------
*/

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    if (String(req.params.id) === String(req.user._id)) {
      return res.status(400).json({
        error: "You cannot delete your own account.",
      });
    }

    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    await writeAuditLog({
      user: req.user,
      action: "DELETE_USER",
      details: {
        deletedUserEmail: targetUser.email,
      },
      ipAddress: req.ip,
    });

    await User.findByIdAndDelete(req.params.id);

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
| Update User Role
|--------------------------------------------------------------------------
*/

router.patch("/:id/role", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    if (!["admin", "member"].includes(role)) {
      return res.status(400).json({
        error: "Invalid role",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    user.role = role;

    await user.save();

    await writeAuditLog({
      user: req.user,
      action: "UPDATE_USER_ROLE",
      details: {
        targetUser: user.email,
        role,
      },
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;
