import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import { login } from "../../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();

  const { setUser } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setBusy(true);

    try {
      const result = await login({
        email,
        password,
      });

      setUser(result.user);

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2">Signalwave</h1>

        <p className="text-slate-500 mb-6">SMTP Monitoring Platform</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-lg p-3 mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-lg p-3 mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          <div className="text-right mb-4">
            <a
              href="/forgot-password"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-slate-900 text-white rounded-lg p-3"
          >
            {busy ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
