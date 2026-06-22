import { api } from "./api";

import {
  ensureArray,
  ensureObject,
} from "./responseValidator";

/*
|--------------------------------------------------------------------------
| History List
|--------------------------------------------------------------------------
|
| Returns:
| [
|   historyRecord
| ]
|
*/

export async function getHistory() {
  const response = await api.get("/history");

  return ensureArray(response.data);
}

/*
|--------------------------------------------------------------------------
| Single History Record
|--------------------------------------------------------------------------
|
| Returns:
| {
|   _id,
|   profileName,
|   status,
|   results
| }
|
*/

export async function getHistoryById(id) {
  if (!id) {
    throw new Error("History ID is required");
  }

  const response = await api.get(`/history/${id}`);

  return ensureObject(response.data);
}
