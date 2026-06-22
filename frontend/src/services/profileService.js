import { api } from "./api";

/*
|--------------------------------------------------------------------------
| Get All Profiles
|--------------------------------------------------------------------------
*/

export async function getProfiles() {
  const response = await api.get("/smtp-profiles");

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Get Single Profile
|--------------------------------------------------------------------------
*/

export async function getProfile(id) {
  const response = await api.get(`/smtp-profiles/${id}`);

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Create Profile
|--------------------------------------------------------------------------
*/

export async function createProfile(payload) {
  const response = await api.post("/smtp-profiles", payload);

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Delete Profile
|--------------------------------------------------------------------------
*/

export async function deleteProfile(id) {
  const response = await api.delete(`/smtp-profiles/${id}`);

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Run Diagnostics
|--------------------------------------------------------------------------
*/

export async function runDiagnostics(profileId) {
  const response = await api.post(`/diagnostics/run/${profileId}`);

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Send Test Email
|--------------------------------------------------------------------------
*/

export async function sendTestEmail(profileId, toAddress) {
  const response = await api.post("/send-test", {
    profileId,
    toAddress,
    subject: "Signalwave Test Email",
  });

  return response.data;
}

export async function updateMonitoring(id, payload) {
  const response = await api.patch(`/smtp-profiles/${id}/monitoring`, payload);

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Update Profile
|--------------------------------------------------------------------------
*/

export async function updateProfile(id, payload) {
  const response = await api.put(`/smtp-profiles/${id}`, payload);

  return response.data;
}
