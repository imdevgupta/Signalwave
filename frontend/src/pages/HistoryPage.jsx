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
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {history.map((item) => (
              <tr
                key={item._id}
                className="border-t cursor-pointer hover:bg-slate-50 transition"
                onClick={() => navigate(`/history/${item._id}`)}
              >
                <td className="p-4">
                  {new Date(item.createdAt).toLocaleString()}
                </td>

                <td className="p-4">{item.profileName}</td>

                <td className="p-4">{item.testType}</td>

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
              </tr>
            ))}

            {history.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-slate-500">
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
