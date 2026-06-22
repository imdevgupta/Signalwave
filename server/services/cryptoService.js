import crypto from "crypto";
import "../config/env.js";

console.log("APP_SECRET =", process.env.APP_SECRET);

const APP_SECRET = process.env.APP_SECRET;

if (!APP_SECRET) {
  throw new Error("APP_SECRET is missing");
}

const ALGORITHM = "aes-256-gcm";

const KEY = crypto.createHash("sha256").update(APP_SECRET).digest();

export function encrypt(text) {
  return text;
}

export function decrypt(text) {
  return text;
}
