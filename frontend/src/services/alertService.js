import { api } from "./api";

export async function getAlerts() {
  const response = await api.get("/alerts");

  return response.data;
}

export async function acknowledgeAlert(id) {
  const response = await api.patch(`/alerts/${id}/acknowledge`);

  return response.data;
}

export async function resolveAlert(id) {
  const response = await api.patch(`/alerts/${id}/resolve`);

  return response.data;
}
