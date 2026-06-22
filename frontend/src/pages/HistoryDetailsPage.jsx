import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getHistoryById } from "../services/historyService";

export default function HistoryDetailsPage() {
  const { id } = useParams();

  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getHistoryById(id);

        setHistory(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [id]);

  if (loading) {
    return <div>Loading history details...</div>;
  }

  if (!history) {
    return <div>History record not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">History Details</h1>

        <p className="text-slate-500">SMTP test execution details</p>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Profile</strong>
            <br />
            {history.profileName}
          </div>

          <div>
            <strong>Type</strong>
            <br />
            {history.testType}
          </div>

          <div>
            <strong>Status</strong>
            <br />
            <span
              className={
                history.status === "pass" ? "text-green-600" : "text-red-600"
              }
            >
              {history.status}
            </span>
          </div>

          <div>
            <strong>Date</strong>
            <br />
            {new Date(history.createdAt).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">Results</h2>

        <pre className="bg-slate-100 p-4 rounded overflow-auto text-sm">
          {JSON.stringify(history.results, null, 2)}
        </pre>
      </div>
    </div>
  );
}
