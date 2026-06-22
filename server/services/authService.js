import bcrypt from "bcryptjs";
import User from "../models/User.js";

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export async function findUserByEmail(email) {
  return User.findOne({
    email: email.toLowerCase(),
  });
}

export async function createUser({ email, password, name, role = "member" }) {
  const existing = await User.findOne({
    email: email.toLowerCase(),
  });

  if (existing) {
    throw new Error("User already exists");
  }

  const passwordHash = await hashPassword(password);

  const user = await User.create({
    email: email.toLowerCase(),
    passwordHash,
    name,
    role,
  });

  return user;
}

export async function authenticateUser(email, password) {
  const user = await User.findOne({
    email: email.toLowerCase(),
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const valid = await verifyPassword(password, user.passwordHash);

  if (!valid) {
    throw new Error("Invalid email or password");
  }

  return user;
}
