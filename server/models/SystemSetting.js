import mongoose from "mongoose";

const SystemSettingSchema = new mongoose.Schema(
  {
    appName: {
      type: String,
      default: "Signalwave",
    },

    defaultFrequency: {
      type: String,
      enum: ["15m", "30m", "1h", "1d"],
      default: "15m",
    },

    alertEmail: {
      type: String,
      default: "",
    },

    sessionTimeout: {
      type: Number,
      default: 60,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("SystemSetting", SystemSettingSchema);
