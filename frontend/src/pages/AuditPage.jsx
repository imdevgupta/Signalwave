import { useEffect, useState } from "react";

import { getAuditLogs } from "../services/auditService";

export default function AuditPage() {
  const [logs, setLogs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("");

  useEffect(() => {
    async function loadLogs() {
      try {
        const data = await getAuditLogs();

        setLogs(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadLogs();
  }, []);

  const filteredLogs = filter
    ? logs.filter((log) => log.action === filter)
    : logs;

  if (loading) {
    return <div>Loading audit logs...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Logs</h1>

        <p className="text-slate-500">Track all important system actions</p>
      </div>

      <div className="bg-white border rounded-xl p-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Actions</option>

          <option value="LOGIN">LOGIN</option>

          <option value="LOGOUT">LOGOUT</option>

          <option value="CREATE_USER">CREATE_USER</option>

          <option value="DELETE_USER">DELETE_USER</option>

          <option value="PASSWORD_RESET">PASSWORD_RESET</option>

          <option value="INITIAL_ADMIN_SETUP">INITIAL_ADMIN_SETUP</option>
        </select>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Date</th>

              <th className="p-4 text-left">Action</th>

              <th className="p-4 text-left">User</th>

              <th className="p-4 text-left">IP Address</th>
            </tr>
          </thead>

          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log._id} className="border-t">
                <td className="p-4">
                  {new Date(log.createdAt).toLocaleString()}
                </td>

                <td className="p-4 font-medium">{log.action}</td>

                <td className="p-4">
                  {log.userEmail || log.userId?.email || "Unknown"}
                </td>

                <td className="p-4">{log.ipAddress || "-"}</td>
              </tr>
            ))}

            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-slate-500">
                  No audit logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
