import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    userEmail: String,

    action: {
      type: String,
      required: true,
    },

    details: {
      type: Object,
      default: {},
    },

    ipAddress: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("AuditLog", AuditLogSchema);
