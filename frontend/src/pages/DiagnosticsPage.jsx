import { useEffect, useState } from "react";

import { getProfiles, runDiagnostics } from "../services/profileService";

export default function DiagnosticsPage() {
  /*
  |--------------------------------------------------------------------------
  | State
  |--------------------------------------------------------------------------
  */

  const [profiles, setProfiles] = useState([]);

  const [selectedProfile, setSelectedProfile] = useState("");

  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Load Profiles
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    async function loadProfiles() {
      try {
        const data = await getProfiles();

        setProfiles(data);

        if (data.length > 0) {
          setSelectedProfile(data[0].id);
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadProfiles();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Run Diagnostics
  |--------------------------------------------------------------------------
  */

  async function handleRunDiagnostics() {
    if (!selectedProfile) {
      alert("Please select a profile");
      return;
    }

    try {
      setLoading(true);

      const response = await runDiagnostics(selectedProfile);

      setResults(response.diagnostics || []);
    } catch (error) {
      alert(error?.response?.data?.error || "Diagnostics failed");
    } finally {
      setLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">Diagnostics</h1>

        <p className="text-slate-500 mt-1">
          Run SMTP diagnostics against a profile
        </p>
      </div>

      {/* Profile Selection */}

      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">Select SMTP Profile</h2>

        <div className="flex gap-3">
          <select
            value={selectedProfile}
            onChange={(e) => setSelectedProfile(e.target.value)}
            className="border rounded-lg px-3 py-2 flex-1"
          >
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleRunDiagnostics}
            disabled={loading}
            className="bg-slate-900 text-white px-4 py-2 rounded-lg"
          >
            {loading ? "Running..." : "Run Diagnostics"}
          </button>
        </div>
      </div>

      {/* Results */}

      {results.length > 0 && (
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Results</h2>

          <div className="space-y-3">
            {results.map((result, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 flex justify-between"
              >
                <div>
                  <div className="font-medium">{result.step}</div>

                  {result.banner && (
                    <div className="text-sm text-slate-500">
                      {result.banner}
                    </div>
                  )}

                  {result.error && (
                    <div className="text-sm text-red-500">{result.error}</div>
                  )}
                </div>

                <div
                  className={
                    result.status === "pass"
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {result.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}

      {results.length === 0 && (
        <div className="bg-white rounded-xl border p-12 text-center text-slate-500">
          Run diagnostics to view results
        </div>
      )}
    </div>
  );
}
