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
    
    /*
|--------------------------------------------------------------------------
| Monitoring Defaults
|--------------------------------------------------------------------------
*/

    failureThreshold: {
      type: Number,
      default: 3,
    },

    diagnosticTimeout: {
      type: Number,
      default: 10000,
    },

    smtpConnectionTimeout: {
      type: Number,
      default: 10000,
    },

    /*
|--------------------------------------------------------------------------
| Alert Settings
|--------------------------------------------------------------------------
*/

    enableAlerts: {
      type: Boolean,
      default: true,
    },

    autoResolveAlerts: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("SystemSetting", SystemSettingSchema);
