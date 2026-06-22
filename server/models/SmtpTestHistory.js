import mongoose from "mongoose";

const SmtpTestHistorySchema = new mongoose.Schema(
  {
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SmtpProfile",
    },

    profileName: String,

    host: String,

    port: Number,

    securityMode: String,
    
    status: {
      type: String,
      enum: ["pass", "warn", "fail"],
      required: true,
    },

    testType: {
      type: String,
      required: true,
    },

    results: {
      type: Object,
      default: {},
    },

    executedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("SmtpTestHistory", SmtpTestHistorySchema);
