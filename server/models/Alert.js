import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema(
  {
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SmtpProfile",
      required: true,
    },

    profileName: {
      type: String,
      required: true,
    },

    severity: {
      type: String,
      enum: ["warning", "critical"],
      default: "warning",
    },

    status: {
      type: String,
      enum: ["open", "acknowledged", "resolved"],
      default: "open",
    },

    message: {
      type: String,
      required: true,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Alert", AlertSchema);
