import { api } from "./api";

export async function getMonitoringDashboard() {
  const response = await api.get("/monitoring/dashboard");

  return response.data;
}
