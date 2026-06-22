const mongoose = require("mongoose");

const SmtpProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

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

    username: String,

    encryptedPassword: String,

    fromAddress: String,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("SmtpProfile", SmtpProfileSchema);
