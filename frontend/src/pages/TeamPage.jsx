import { useEffect, useState } from "react";

import {
  getUsers,
  createUser,
  deleteUser,
  updateUserRole,
} from "../services/teamService";

export default function TeamPage() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });

  async function loadUsers() {
    try {
      const data = await getUsers();

      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleCreateUser() {
    try {
      await createUser(form);

      setForm({
        name: "",
        email: "",
        password: "",
        role: "member",
      });

      loadUsers();
    } catch (error) {
      alert(error?.response?.data?.error || "Failed to create user");
    }
  }

  async function handleDeleteUser(id) {
    if (!window.confirm("Delete this user?")) {
      return;
    }

    try {
      await deleteUser(id);

      loadUsers();
    } catch (error) {
      alert(error?.response?.data?.error || "Delete failed");
    }
  }

  async function handleRoleChange(id, role) {
    try {
      await updateUserRole(id, role);

      loadUsers();
    } catch (error) {
      alert(error?.response?.data?.error || "Role update failed");
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Team Management</h1>

        <p className="text-slate-500">Manage users and roles</p>
      </div>

      {/* Create User */}

      <div className="bg-white border rounded-xl p-6">
        <h2 className="font-semibold mb-4">Create User</h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="border rounded px-3 py-2"
          />

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            className="border rounded px-3 py-2"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
            className="border rounded px-3 py-2"
          />

          <select
            value={form.role}
            onChange={(e) =>
              setForm({
                ...form,
                role: e.target.value,
              })
            }
            className="border rounded px-3 py-2"
          >
            <option value="member">Member</option>

            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          onClick={handleCreateUser}
          className="mt-4 bg-slate-900 text-white px-4 py-2 rounded"
        >
          Create User
        </button>
      </div>

      {/* User Table */}

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Name</th>

              <th className="p-4 text-left">Email</th>

              <th className="p-4 text-left">Role</th>

              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-4">{user.name}</td>

                <td className="p-4">{user.email}</td>

                <td className="p-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="member">Member</option>

                    <option value="admin">Admin</option>
                  </select>
                </td>

                <td className="p-4">
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
