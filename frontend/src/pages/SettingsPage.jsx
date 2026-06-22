import { useEffect, useState } from "react";

import { getSettings, saveSettings } from "../services/settingsService";

export default function SettingsPage() {
  /*
  |--------------------------------------------------------------------------
  | State
  |--------------------------------------------------------------------------
  */

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    appName: "",
    defaultFrequency: "15m",
    alertEmail: "",
    sessionTimeout: 60,
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
        });
      } catch (error) {
        console.error(error);
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
      alert(error?.response?.data?.error || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">Settings</h1>

        <p className="text-slate-500 mt-1">Manage system configuration</p>
      </div>

      {/* General Settings */}

      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">General</h2>

        <div>
          <label className="block mb-2 text-sm font-medium">
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
        <h2 className="font-semibold mb-4">Monitoring</h2>

        <div>
          <label className="block mb-2 text-sm font-medium">
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
      </div>

      {/* Alert Settings */}

      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">Alerts</h2>

        <div>
          <label className="block mb-2 text-sm font-medium">
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
      </div>

      {/* Security Settings */}

      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">Security</h2>

        <div>
          <label className="block mb-2 text-sm font-medium">
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
          className="bg-slate-900 text-white px-6 py-3 rounded-lg"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
