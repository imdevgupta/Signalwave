import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import session from "express-session";
import MongoStore from "connect-mongo";
import { connectDatabase } from "./config/database.js";
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import auditRoutes from "./routes/audit.js";
import smtpProfileRoutes from "./routes/smtpProfiles.js";
import diagnosticsRoutes from "./routes/diagnostics.js";
import sendTestRoutes from "./routes/sendTest.js";
import dashboardRoutes from "./routes/dashboard.js";
import { startCronJobs } from "./jobs/cronJobs.js";
import monitoringRoutes from "./routes/monitoring.js";
import cors from "cors";
import historyRoutes from "./routes/history.js";
import alertRoutes from "./routes/alerts.js";
import settingsRoutes from "./routes/settings.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://signalwave-chi.vercel.app",
    ],
    credentials: true,
  }),
);
app.use(helmet());

app.use(express.json());

app.use(
  session({
    name: "signalwave.sid",

    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
    }),

    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  }),
);

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "Signalwave",
    timestamp: new Date().toISOString(),
  });
});

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/smtp-profiles", smtpProfileRoutes);
app.use("/api/diagnostics", diagnosticsRoutes);
app.use("/api/send-test", sendTestRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/monitoring", monitoringRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/settings", settingsRoutes);

/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: "Internal Server Error",
  });
});

/*
|--------------------------------------------------------------------------
| Server Startup
|--------------------------------------------------------------------------
*/

async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log("====================================");
      console.log("🚀 Signalwave Started");
      console.log(`🌐 Port: ${PORT}`);
      console.log(`🛢️ MongoDB Connected`);
      console.log("====================================");
      startCronJobs();
    });
  } catch (error) {
    console.error("Failed to start server");
    console.error(error);
    process.exit(1);
  }
}

startServer();
