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
            {{
              diagnostics: "Diagnostics",
              "send-test": "Send Test",
              "scheduled-monitor": "Scheduled Monitor",
            }[history.testType] || history.testType}
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

          <div>
            <strong>Host</strong>
            <br />
            {history.host || "-"}
          </div>

          <div>
            <strong>Port</strong>
            <br />
            {history.port || "-"}
          </div>

          <div>
            <strong>Security Mode</strong>
            <br />
            {history.securityMode || "-"}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">Diagnostic Results</h2>

        <div className="space-y-3">
          {history.results?.map((result, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div className="font-medium">{result.step}</div>

                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    result.status === "pass"
                      ? "bg-green-100 text-green-700"
                      : result.status === "warn"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {result.status}
                </span>
              </div>

              {result.error && (
                <div className="mt-2 text-red-600 text-sm">{result.error}</div>
              )}

              {result.banner && (
                <div className="mt-2 text-sm text-slate-600">
                  <strong>Banner:</strong> {result.banner}
                </div>
              )}

              {result.message && (
                <div className="mt-2 text-sm text-slate-600">
                  {result.message}
                </div>
              )}

              {result.capabilities && (
                <div className="mt-2 text-sm">
                  <strong>Capabilities:</strong>{" "}
                  {result.capabilities.join(", ")}
                </div>
              )}

              {result.tlsVersion && (
                <div className="mt-2 text-sm">
                  <strong>TLS Version:</strong> {result.tlsVersion}
                </div>
              )}

              {result.subject && (
                <div className="mt-2 text-sm">
                  <strong>Certificate:</strong> {result.subject}
                </div>
              )}

              {result.durationMs && (
                <div className="mt-2 text-xs text-slate-500">
                  Duration: {result.durationMs} ms
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
