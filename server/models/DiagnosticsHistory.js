const mongoose = require("mongoose");

const DiagnosticHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["diagnostics", "send-test"],
      required: true,
    },

    host: String,

    port: Number,

    status: String,

    result: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("DiagnosticHistory", DiagnosticHistorySchema);
