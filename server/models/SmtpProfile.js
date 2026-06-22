import mongoose from "mongoose";

const SmtpProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    host: {
      type: String,
      required: true,
    },

    port: {
      type: Number,
      required: true,
    },
    
    secure: {
      type: Boolean,
      default: false,
    },

    securityMode: {
      type: String,
      enum: ["auto", "ssl", "starttls", "none"],
      default: "auto",
    },

    username: {
      type: String,
      default: "",
    },

    encryptedPassword: {
      type: String,
      default: "",
    },

    fromAddress: {
      type: String,
      default: "",
    },

    monitoringEnabled: {
      type: Boolean,
      default: true,
    },

    monitoringFrequency: {
      type: String,
      enum: ["15m", "30m", "1h", "1d"],
      default: "15m",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("SmtpProfile", SmtpProfileSchema);
