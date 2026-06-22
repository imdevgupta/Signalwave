import { api } from "./api";

/*
|--------------------------------------------------------------------------
| Get Audit Logs
|--------------------------------------------------------------------------
*/

export async function getAuditLogs() {
  const response = await api.get("/audit");

  return response.data;
}
