import { api } from "./api";

/*
|--------------------------------------------------------------------------
| Get Users
|--------------------------------------------------------------------------
*/

export async function getUsers() {
  const response = await api.get("/users");

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Create User
|--------------------------------------------------------------------------
*/

export async function createUser(payload) {
  const response = await api.post("/users", payload);

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Delete User
|--------------------------------------------------------------------------
*/

export async function deleteUser(id) {
  const response = await api.delete(`/users/${id}`);

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Update User Role
|--------------------------------------------------------------------------
*/

export async function updateUserRole(id, role) {
  const response = await api.patch(`/users/${id}/role`, {
    role,
  });

  return response.data;
}
