import AuditLog from "../models/AuditLog.js";

export async function writeAuditLog({ user, action, details = {}, ipAddress }) {
  await AuditLog.create({
    userId: user?._id,
    userEmail: user?.email,
    action,
    details,
    ipAddress,
  });
}
