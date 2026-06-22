import { useState } from "react";

import { forgotPassword } from "../../services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      await forgotPassword(email);

      setSuccess(true);
    } catch (error) {
      alert(error?.response?.data?.error || "Request failed");
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
        <h1 className="text-2xl font-bold">Forgot Password</h1>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 text-white py-2 rounded"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {success && (
          <div className="text-green-600 text-sm">
            If the account exists, a reset link has been sent.
          </div>
        )}
      </form>
    </div>
  );
}
