import { api } from "./api";

import { ensureArray, ensureObject } from "./responseValidator";

/*
|--------------------------------------------------------------------------
| Dashboard Statistics
|--------------------------------------------------------------------------
*/

export async function getDashboardStats() {
  const response = await api.get("/dashboard/stats");

  return ensureObject(response.data);
}

/*
|--------------------------------------------------------------------------
| Pass / Fail Chart
|--------------------------------------------------------------------------
|
| Backend returns:
| {
|   passed: Number,
|   failed: Number
| }
|
*/

export async function getPassFailData() {
  const response = await api.get("/dashboard/pass-fail");

  return ensureObject(response.data);
}

/*
|--------------------------------------------------------------------------
| Activity Chart
|--------------------------------------------------------------------------
|
| Backend returns:
| [
|   {
|     date,
|     tests
|   }
| ]
|
*/

export async function getActivityData() {
  const response = await api.get("/dashboard/activity");

  return ensureArray(response.data);
}

/*
|--------------------------------------------------------------------------
| Recent Failures
|--------------------------------------------------------------------------
|
| Backend returns:
| [
|   historyRecord
| ]
|
*/

export async function getRecentFailures() {
  const response = await api.get("/dashboard/recent-failures");

  return ensureArray(response.data);
}
