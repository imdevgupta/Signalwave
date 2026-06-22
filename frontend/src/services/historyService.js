import { api } from "./api";

/*
|--------------------------------------------------------------------------
| Get History
|--------------------------------------------------------------------------
*/

export async function getHistory() {
  const response = await api.get("/history");

  return response.data;
}

export async function getHistoryById(id) {
  const response = await api.get(`/history/${id}`);

  return response.data;
}
