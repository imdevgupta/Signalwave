import { useEffect, useState } from "react";

import { getSettings, saveSettings } from "../services/settingsService";

export default function SettingsPage() {
  /*
  |--------------------------------------------------------------------------
  | Component State
  |--------------------------------------------------------------------------
  |
  | loading -> Initial page load state
  | saving  -> Save button state
  | form    -> Settings form values
  |
  */

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    appName: "",

    defaultFrequency: "15m",

    alertEmail: "",

    sessionTimeout: 60,

    enableAlerts: true,

    failureThreshold: 3,

    diagnosticTimeout: 10000,

    smtpConnectionTimeout: 10000,
  });

  /*
  |--------------------------------------------------------------------------
  | Load Settings
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSettings();

        setForm({
          appName: data.appName || "Signalwave",

          defaultFrequency: data.defaultFrequency || "15m",

          alertEmail: data.alertEmail || "",

          sessionTimeout: data.sessionTimeout || 60,

          enableAlerts: data.enableAlerts ?? true,

          failureThreshold: data.failureThreshold ?? 3,

          diagnosticTimeout: data.diagnosticTimeout ?? 10000,

          smtpConnectionTimeout: data.smtpConnectionTimeout ?? 10000,
        });
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Save Settings
  |--------------------------------------------------------------------------
  */

  async function handleSave() {
    try {
      setSaving(true);

      await saveSettings(form);

      alert("Settings saved successfully");
    } catch (error) {
      console.error("Failed to save settings:", error);

      alert(error?.response?.data?.error || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Loading State
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return <div className="text-slate-600">Loading settings...</div>;
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
        <h1 className="text-3xl font-bold">Settings</h1>

        <p className="text-slate-500 mt-1">
          Manage global system configuration
        </p>
      </div>

      {/* General Settings */}

      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">General Settings</h2>

        <div>
          <label className="block text-sm font-medium mb-2">
            Application Name
          </label>

          <input
            type="text"
            value={form.appName}
            onChange={(e) =>
              setForm({
                ...form,
                appName: e.target.value,
              })
            }
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
      </div>

      {/* Monitoring Settings */}

      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">Monitoring Settings</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Default Monitoring Frequency
            </label>

            <select
              value={form.defaultFrequency}
              onChange={(e) =>
                setForm({
                  ...form,
                  defaultFrequency: e.target.value,
                })
              }
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="15m">Every 15 Minutes</option>

              <option value="30m">Every 30 Minutes</option>

              <option value="1h">Every Hour</option>

              <option value="1d">Every Day</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Failure Threshold
            </label>

            <input
              type="number"
              min="1"
              value={form.failureThreshold}
              onChange={(e) =>
                setForm({
                  ...form,
                  failureThreshold: Number(e.target.value),
                })
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Alert Settings */}

      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">Alert Settings</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Alert Email Address
            </label>

            <input
              type="email"
              value={form.alertEmail}
              onChange={(e) =>
                setForm({
                  ...form,
                  alertEmail: e.target.value,
                })
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.enableAlerts}
              onChange={(e) =>
                setForm({
                  ...form,
                  enableAlerts: e.target.checked,
                })
              }
            />
            Enable Alert Generation
          </label>

          <p className="text-sm text-slate-500">
            When disabled, monitoring continues but no new alerts are created.
          </p>
        </div>
      </div>

      {/* SMTP Settings */}

      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">SMTP Settings</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Diagnostic Timeout (ms)
            </label>

            <input
              type="number"
              min="1000"
              value={form.diagnosticTimeout}
              onChange={(e) =>
                setForm({
                  ...form,
                  diagnosticTimeout: Number(e.target.value),
                })
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              SMTP Connection Timeout (ms)
            </label>

            <input
              type="number"
              min="1000"
              value={form.smtpConnectionTimeout}
              onChange={(e) =>
                setForm({
                  ...form,
                  smtpConnectionTimeout: Number(e.target.value),
                })
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Security Settings */}

      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">Security Settings</h2>

        <div>
          <label className="block text-sm font-medium mb-2">
            Session Timeout (Minutes)
          </label>

          <input
            type="number"
            min="5"
            value={form.sessionTimeout}
            onChange={(e) =>
              setForm({
                ...form,
                sessionTimeout: Number(e.target.value),
              })
            }
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
      </div>

      {/* Save Button */}

      <div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-slate-900 text-white px-6 py-3 rounded-lg disabled:opacity-50"
        >
          {saving ? "Saving Settings..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
