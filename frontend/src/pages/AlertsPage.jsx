import { useEffect, useState } from "react";

import {
  getAlerts,
  acknowledgeAlert,
  resolveAlert,
} from "../services/alertService";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);

  async function loadAlerts() {
    const data = await getAlerts();

    setAlerts(data);
  }

  useEffect(() => {
    loadAlerts();
  }, []);

  async function handleAcknowledge(id) {
    await acknowledgeAlert(id);

    loadAlerts();
  }

  async function handleResolve(id) {
    await resolveAlert(id);

    loadAlerts();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Alerts</h1>

        <p className="text-slate-500">Monitoring alerts and incidents</p>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Profile</th>

              <th className="p-4 text-left">Severity</th>

              <th className="p-4 text-left">Status</th>

              <th className="p-4 text-left">Created</th>

              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {alerts.map((alert) => (
              <tr key={alert._id} className="border-t">
                <td className="p-4">{alert.profileName}</td>

                <td className="p-4 text-red-600">{alert.severity}</td>

                <td className="p-4">{alert.status}</td>

                <td className="p-4">
                  {new Date(alert.createdAt).toLocaleString()}
                </td>

                <td className="p-4 flex gap-2">
                  {alert.status === "open" && (
                    <button
                      onClick={() => handleAcknowledge(alert._id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Acknowledge
                    </button>
                  )}

                  {alert.status !== "resolved" && (
                    <button
                      onClick={() => handleResolve(alert._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Resolve
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {alerts.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-slate-500">
                  No alerts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
