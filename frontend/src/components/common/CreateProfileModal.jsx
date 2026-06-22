import { useState } from "react";

import { createProfile } from "../../services/profileService";

export default function CreateProfileModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    host: "",
    port: 587,
    secure: false,
    securityMode: "auto",
    username: "",
    password: "",
    fromAddress: "",
  });

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  if (!open) return null;

  function updateField(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSaving(true);

    try {
      await createProfile(form);

      onCreated();

      onClose();
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to create profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-xl">
        <h2 className="text-xl font-bold mb-4">Create SMTP Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Profile Name"
            className="w-full border p-3 rounded"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            required
          />

          <input
            placeholder="SMTP Host"
            className="w-full border p-3 rounded"
            value={form.host}
            onChange={(e) => updateField("host", e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Port"
            className="w-full border p-3 rounded"
            value={form.port}
            onChange={(e) => {
              const port = Number(e.target.value);

              updateField("port", port);

              if (port === 465) {
                updateField("securityMode", "ssl");
              }

              if (port === 587) {
                updateField("securityMode", "starttls");
              }

              if (port === 25) {
                updateField("securityMode", "none");
              }
            }}
            required
          />

          <p className="text-sm text-slate-500">
            465 = SSL/TLS • 587 = STARTTLS • 25 = Plain SMTP
          </p>

          <input
            placeholder="Username"
            className="w-full border p-3 rounded"
            value={form.username}
            onChange={(e) => updateField("username", e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            required
          />

          <input
            placeholder="From Email"
            className="w-full border p-3 rounded"
            value={form.fromAddress}
            onChange={(e) => updateField("fromAddress", e.target.value)}
            required
          />

          <div>
            <label className="block mb-2 font-medium">
              Connection Security
            </label>

            <select
              value={form.securityMode}
              onChange={(e) => updateField("securityMode", e.target.value)}
              className="w-full border p-3 rounded"
            >
              <option value="auto">Auto Detect (Recommended)</option>

              <option value="ssl">SSL/TLS</option>

              <option value="starttls">STARTTLS</option>

              <option value="none">None</option>
            </select>
          </div>

          {error && <div className="text-red-500">{error}</div>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-slate-900 text-white rounded"
            >
              {saving ? "Saving..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
