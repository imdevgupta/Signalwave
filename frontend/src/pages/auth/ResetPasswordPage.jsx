import { useState } from "react";

import { useParams } from "react-router-dom";

import { resetPassword } from "../../services/authService";

export default function ResetPasswordPage() {
  const { token } = useParams();

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      await resetPassword(token, password);

      setSuccess(true);
    } catch (error) {
      alert(error?.response?.data?.error || "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-xl p-8 w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold">Reset Password</h1>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 text-white py-2 rounded"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {success && (
          <div className="text-green-600 text-sm">
            Password updated successfully.
          </div>
        )}
      </form>
    </div>
  );
}
