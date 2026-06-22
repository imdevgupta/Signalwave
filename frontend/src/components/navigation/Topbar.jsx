import { useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

import { logout } from "../../services/authService";

export default function Topbar() {
  const navigate = useNavigate();

  const { user, setUser } = useAuth();

  async function handleLogout() {
    await logout();

    setUser(null);

    navigate("/login");
  }

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h2 className="font-semibold">Signalwave</h2>

      <div className="flex items-center gap-4">
        <div>{user?.name}</div>

        <button onClick={handleLogout} className="text-red-500">
          Logout
        </button>
      </div>
    </header>
  );
}
