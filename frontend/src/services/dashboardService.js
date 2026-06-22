import { api } from "./api";

export async function getDashboardStats() {
  const response = await api.get("/dashboard/stats");
  return response.data;
}

export async function getPassFailData() {
  const response = await api.get("/dashboard/pass-fail");
  return response.data;
}

export async function getActivityData() {
  const response = await api.get("/dashboard/activity");
  return response.data;
}

export async function getRecentFailures() {
  const response = await api.get("/dashboard/recent-failures");
  return response.data;
}