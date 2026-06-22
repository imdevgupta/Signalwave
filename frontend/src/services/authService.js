import { api } from "./api";

/*
|--------------------------------------------------------------------------
| Auth Status
|--------------------------------------------------------------------------
*/

export async function getAuthStatus() {
  const response = await api.get("/auth/status");

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

export async function login(payload) {
  const response = await api.post("/auth/login", payload);

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

export async function logout() {
  const response = await api.post("/auth/logout");

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Current User
|--------------------------------------------------------------------------
*/

export async function getCurrentUser() {
  const response = await api.get("/auth/me");

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Initial Setup
|--------------------------------------------------------------------------
*/

export async function setup(payload) {
  const response = await api.post("/auth/setup", payload);

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Forgot Password
|--------------------------------------------------------------------------
*/

export async function forgotPassword(email) {
  const response = await api.post("/auth/forgot-password", {
    email,
  });

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Reset Password
|--------------------------------------------------------------------------
*/

export async function resetPassword(token, password) {
  const response = await api.post("/auth/reset-password", {
    token,
    password,
  });

  return response.data;
}
