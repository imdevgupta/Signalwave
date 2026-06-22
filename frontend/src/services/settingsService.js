import { api } from "./api";

export async function getSettings() {
  const response = await api.get("/settings");

  return response.data;
}

export async function saveSettings(payload) {
  const response = await api.put("/settings", payload);

  return response.data;
}
