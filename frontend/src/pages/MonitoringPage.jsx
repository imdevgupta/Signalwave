import { useEffect, useState } from "react";

import { getMonitoringDashboard } from "../services/monitoringService";

export default function MonitoringPage() {
  const [monitoring, setMonitoring] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMonitoring();

    const interval = setInterval(loadMonitoring, 30000);

    return () => clearInterval(interval);
  }, []);

  async function loadMonitoring() {
    try {
      const data = await getMonitoringDashboard();

      setMonitoring(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading monitoring...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Monitoring</h1>

        <p className="text-slate-500">SMTP monitoring overview</p>
      </div>

      {monitoring.length === 0 ? (
        <div className="bg-white border rounded-xl p-8 text-center">
          No monitoring schedules found
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4">Profile</th>

                <th className="text-left p-4">Status</th>

                <th className="text-left p-4">Frequency</th>

                <th className="text-left p-4">Success Rate</th>

                <th className="text-left p-4">Failures</th>

                <th className="text-left p-4">Total Checks</th>
              </tr>
            </thead>

            <tbody>
              {monitoring.map((item) => (
                <tr key={item.profileId} className="border-t">
                  <td className="p-4">{item.profileName}</td>

                  <td className="p-4">
                    <span
                      className={
                        item.status === "pass"
                          ? "text-green-600 font-medium"
                          : "text-red-600 font-medium"
                      }
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="p-4">{item.frequency}</td>

                  <td className="p-4">{item.successRate}%</td>

                  <td className="p-4">{item.failures}</td>

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
