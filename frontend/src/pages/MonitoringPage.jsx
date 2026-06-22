import { useEffect, useState } from "react";

import { getMonitoringDashboard } from "../services/monitoringService";

export default function MonitoringPage() {
  /*
  |--------------------------------------------------------------------------
  | State
  |--------------------------------------------------------------------------
  */

  const [monitoring, setMonitoring] = useState([]);

  const [loading, setLoading] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | Load Monitoring Data
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadMonitoring();

    // Auto refresh every 30 seconds
    const interval = setInterval(loadMonitoring, 30000);

    return () => clearInterval(interval);
  }, []);

  async function loadMonitoring() {
    try {
      const data = await getMonitoringDashboard();

      setMonitoring(data);
    } catch (error) {
      console.error("Failed to load monitoring:", error);
    } finally {
      setLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Loading State
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return <div>Loading monitoring...</div>;
  }

  /*
  |--------------------------------------------------------------------------
  | Page UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-6">
      {/* Page Header */}

      <div>
        <h1 className="text-3xl font-bold">Monitoring</h1>

        <p className="text-slate-500">SMTP monitoring overview</p>
      </div>

      {/* Empty State */}

      {monitoring.length === 0 ? (
        <div className="bg-white border rounded-xl p-8 text-center">
          No monitored SMTP profiles found.
          <br />
          Enable monitoring on a profile to begin scheduled health checks.
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full">
            {/* Table Header */}

            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4">Profile</th>

                {/* Admin Only Columns */}

                {monitoring.length > 0 && monitoring[0].ownerName && (
                  <>
                    <th className="text-left p-4">Owner</th>

                    <th className="text-left p-4">Email</th>
                  </>
                )}

                <th className="text-left p-4">Enabled</th>

                <th className="text-left p-4">Status</th>

                <th className="text-left p-4">Frequency</th>

                <th className="text-left p-4">Success Rate</th>

                <th className="text-left p-4">Health</th>

                <th className="text-left p-4">Last Check</th>

                <th className="text-left p-4">Failures</th>

                <th className="text-left p-4">Total Checks</th>
              </tr>
            </thead>

            {/* Table Body */}

            <tbody>
              {monitoring.map((item) => (
                <tr key={item.profileId} className="border-t">
                  {/* Profile Name */}

                  <td className="p-4">{item.profileName}</td>

                  {/* Admin Only Data */}

                  {item.ownerName && (
                    <>
                      <td className="p-4">{item.ownerName}</td>

                      <td className="p-4">{item.ownerEmail}</td>
                    </>
                  )}

                  {/* Monitoring Enabled */}

                  <td className="p-4">
                    {item.enabled ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-red-600">No</span>
                    )}
                  </td>

                  {/* Current Status */}

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === "pass"
                          ? "bg-green-100 text-green-700"
                          : item.status === "fail"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Monitoring Frequency */}

                  <td className="p-4">{item.frequency}</td>

                  {/* Success Rate */}

                  <td className="p-4">{item.successRate}%</td>

                  {/* Health Rating */}

                  <td className="p-4">
                    {item.successRate >= 95 && (
                      <span className="text-green-600 font-medium">
                        Excellent
                      </span>
                    )}

                    {item.successRate >= 80 && item.successRate < 95 && (
                      <span className="text-yellow-600 font-medium">
                        Warning
                      </span>
                    )}

                    {item.successRate < 80 && (
                      <span className="text-red-600 font-medium">Critical</span>
                    )}
                  </td>

                  {/* Last Monitoring Run */}

                  <td className="p-4">
                    {item.lastCheck
                      ? new Date(item.lastCheck).toLocaleString()
                      : "-"}
                  </td>

                  {/* Failure Count */}

                  <td className="p-4">{item.failures}</td>

                  {/* Total Checks */}

                  <td className="p-4">{item.totalChecks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
