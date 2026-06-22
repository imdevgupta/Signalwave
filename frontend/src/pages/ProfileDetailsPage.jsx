import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getProfile,
  runDiagnostics,
  sendTestEmail,
  updateMonitoring,
  updateProfile,
} from "../services/profileService";

export default function ProfileDetailsPage() {
  /*
  |--------------------------------------------------------------------------
  | Route Params
  |--------------------------------------------------------------------------
  */

  const { id } = useParams();

  /*
  |--------------------------------------------------------------------------
  | Profile State
  |--------------------------------------------------------------------------
  */

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    host: "",
    port: "",
    secure: false,
    securityMode: "auto",
    username: "",
    password: "",
    fromAddress: "",
  });
  /*
  |--------------------------------------------------------------------------
  | Monitoring State
  |--------------------------------------------------------------------------
  */

  const [monitoringEnabled, setMonitoringEnabled] = useState(true);

  const [monitoringFrequency, setMonitoringFrequency] = useState("15m");

  /*
  |--------------------------------------------------------------------------
  | Diagnostics State
  |--------------------------------------------------------------------------
  */

  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Test Email State
  |--------------------------------------------------------------------------
  */

  const [recipient, setRecipient] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Load Profile
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    async function load() {
      try {
        const data = await getProfile(id);

        setProfile(data);

        setMonitoringEnabled(data.monitoringEnabled ?? true);
        setMonitoringFrequency(data.monitoringFrequency ?? "15m");
        setForm({
          name: data.name,
          host: data.host,
          port: data.port,
          secure: data.secure,
          securityMode: data.securityMode || "auto",
          username: data.username,
          password: "",
          fromAddress: data.fromAddress,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  /*
  |--------------------------------------------------------------------------
  | Save Monitoring Settings
  |--------------------------------------------------------------------------
  */

  async function handleSaveMonitoring() {
    try {
      await updateMonitoring(id, {
        monitoringEnabled,
        monitoringFrequency,
      });

      alert("Monitoring settings saved");
    } catch (error) {
      alert(error?.response?.data?.error || "Failed to save settings");
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Run SMTP Diagnostics
  |--------------------------------------------------------------------------
  */

  async function handleDiagnostics() {
    try {
      setRunning(true);

      const data = await runDiagnostics(id);

      setResults(data.diagnostics);
    } catch (error) {
      console.error(error);
    } finally {
      setRunning(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Send Test Email
  |--------------------------------------------------------------------------
  */

  async function handleSendTest() {
    try {
      setSending(true);

      const result = await sendTestEmail(id, recipient);

      setSendResult(result);
    } catch (error) {
      alert(error?.response?.data?.error || "Send failed");
    } finally {
      setSending(false);
    }
  }

  async function handleSaveProfile() {
    try {
      await updateProfile(id, form);

      const updated = await getProfile(id);

      setProfile(updated);

      setEditing(false);

      alert("Profile updated");
    } catch (error) {
      alert(error?.response?.data?.error || "Update failed");
    }
  }
  /*
  |--------------------------------------------------------------------------
  | Loading State
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return <div>Loading...</div>;
  }

  /*
  |--------------------------------------------------------------------------
  | Page UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">{profile.name}</h1>

        <p className="text-slate-500">SMTP Profile</p>
      </div>

      {/* Profile Information */}

      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Profile Information</h2>

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="bg-slate-900 text-white px-4 py-2 rounded"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSaveProfile}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>

              <button
                onClick={() => {
                  setEditing(false);

                  setForm({
                    name: profile.name,
                    host: profile.host,
                    port: profile.port,
                    secure: profile.secure,
                    securityMode: profile.securityMode || "auto",
                    username: profile.username,
                    password: "",
                    fromAddress: profile.fromAddress,
                  });
                }}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {!editing ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Name:</strong>
              <br />
              {profile.name}
            </div>

            <div>
              <strong>Host:</strong>
              <br />
              {profile.host}
            </div>

            <div>
              <strong>Port:</strong>
              <br />
              {profile.port}
            </div>

            <div>
              <strong>Username:</strong>
              <br />
              {profile.username}
            </div>

            <div>
              <strong>From Address:</strong>
              <br />
              {profile.fromAddress}
            </div>

            <div>
              <strong>Security Mode:</strong>
              <br />
              {profile.securityMode || "auto"}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Profile Name</label>

              <input
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Host</label>

              <input
                value={form.host}
                onChange={(e) =>
                  setForm({
                    ...form,
                    host: e.target.value,
                  })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Port</label>

              <input
                type="number"
                value={form.port}
                onChange={(e) => {
                  const port = Number(e.target.value);

                  let securityMode = form.securityMode;

                  if (port === 465) {
                    securityMode = "ssl";
                  }

                  if (port === 587) {
                    securityMode = "starttls";
                  }

                  if (port === 25) {
                    securityMode = "none";
                  }

                  setForm({
                    ...form,
                    port,
                    securityMode,
                  });
                }}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Username</label>

              <input
                value={form.username}
                onChange={(e) =>
                  setForm({
                    ...form,
                    username: e.target.value,
                  })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">New Password</label>

              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                className="w-full border rounded px-3 py-2"
                placeholder="Leave empty to keep existing password"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">From Address</label>

              <input
                value={form.fromAddress}
                onChange={(e) =>
                  setForm({
                    ...form,
                    fromAddress: e.target.value,
                  })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm mb-1">Connection Security</label>

              <select
                value={form.securityMode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    securityMode: e.target.value,
                  })
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="auto">Auto Detect (Recommended)</option>

                <option value="ssl">SSL/TLS</option>

                <option value="starttls">STARTTLS</option>

                <option value="none">None</option>
              </select>

              <p className="text-xs text-slate-500 mt-1">
                465 = SSL/TLS • 587 = STARTTLS • 25 = Plain SMTP
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Monitoring Settings */}

      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">Monitoring Settings</h2>

        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={monitoringEnabled}
              onChange={(e) => setMonitoringEnabled(e.target.checked)}
            />
            Monitoring Enabled
          </label>

          <div>
            <label className="block mb-2">Frequency</label>

            <select
              value={monitoringFrequency}
              onChange={(e) => setMonitoringFrequency(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="15m">Every 15 Minutes</option>

              <option value="30m">Every 30 Minutes</option>

              <option value="1h">Every Hour</option>

              <option value="1d">Every Day</option>
            </select>
          </div>

          <button
            onClick={handleSaveMonitoring}
            className="bg-slate-900 text-white px-4 py-2 rounded"
          >
            Save Settings
          </button>
        </div>
      </div>

      {/* Diagnostics */}

      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">Diagnostics</h2>

        <button
          onClick={handleDiagnostics}
          disabled={running}
          className="bg-slate-900 text-white px-4 py-2 rounded"
        >
          {running ? "Running..." : "Run Diagnostics"}
        </button>
      </div>

      {/* Send Test Email */}

      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">Send Test Email</h2>

        <div className="flex gap-3">
          <input
            type="email"
            placeholder="Recipient Email"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="border rounded px-3 py-2 flex-1"
          />

          <button
            onClick={handleSendTest}
            disabled={sending}
            className="bg-slate-900 text-white px-4 py-2 rounded"
          >
            {sending ? "Sending..." : "Send Test"}
          </button>
        </div>

        {sendResult && (
          <div className="mt-3 text-green-600">
            Test email sent successfully
          </div>
        )}
      </div>

      {/* Diagnostics Results */}

      {results && (
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Results</h2>

          <div className="space-y-3">
            {results.map((result, index) => (
              <div
                key={index}
                className="flex justify-between border rounded p-3"
              >
                <div>
                  <div className="font-medium">{result.step}</div>

                  {result.error && (
                    <div className="text-sm text-red-500">{result.error}</div>
                  )}

                  {result.banner && (
                    <div className="text-sm text-slate-500">
                      {result.banner}
                    </div>
                  )}
                </div>

                <div
                  className={
                    result.status === "pass" ? "text-green-600" : "text-red-600"
                  }
                >
                  {result.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
