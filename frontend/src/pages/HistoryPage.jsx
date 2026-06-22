import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHistory } from "../services/historyService";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getHistory();

        setHistory(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  if (loading) {
    return <div>Loading history...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">History</h1>

        <p className="text-slate-500 mt-1">SMTP monitoring and test history</p>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-4">Date</th>

              <th className="text-left p-4">Profile</th>

              <th className="text-left p-4">Host</th>

              <th className="text-left p-4">Port</th>

              <th className="text-left p-4">Type</th>

              <th className="text-left p-4">Status</th>

              <th className="text-left p-4">Details</th>
            </tr>
          </thead>

          <tbody>
            {history.map((item) => (
              <tr
                key={item._id}
                className="border-t cursor-pointer hover:bg-slate-50 transition"
                onClick={() => navigate(`/history/${item._id}`)}
              >
                {/* Date */}

                <td className="p-4">
                  {new Date(item.createdAt).toLocaleString()}
                </td>

                {/* Profile */}

                <td className="p-4 font-medium">{item.profileName}</td>

                {/* Host */}

                <td className="p-4">{item.host || "-"}</td>

                {/* Port */}

                <td className="p-4">{item.port || "-"}</td>

                {/* Test Type */}

                <td className="p-4">
                  {item.testType === "diagnostics"
                    ? "Diagnostics"
                    : item.testType === "send-test"
                      ? "Send Test"
                      : item.testType === "scheduled-monitor"
                        ? "Scheduled Monitor"
                        : item.testType}
                </td>

                {/* Status */}

                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === "pass"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                {/* Details */}

                <td className="p-4 text-blue-600">View Details →</td>
              </tr>
            ))}

            {history.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-500">
                  No history found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
