import { useEffect, useState } from "react";

import StatCard from "../components/dashboard/StatCard";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import {
  getDashboardStats,
  getPassFailData,
  getActivityData,
  getRecentFailures,
} from "../services/dashboardService";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);

  const [passFail, setPassFail] = useState([]);

  const [activity, setActivity] = useState([]);

  const [failures, setFailures] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [statsData, passFailData, activityData, failureData] =
          await Promise.all([
            getDashboardStats(),
            getPassFailData(),
            getActivityData(),
            getRecentFailures(),
          ]);

        setStats(statsData);

        setPassFail([
          {
            name: "Passed",
            value: passFailData.passed,
          },
          {
            name: "Failed",
            value: passFailData.failed,
          },
        ]);

        setActivity(activityData);

        setFailures(failureData);
      } catch (err) {
        setError(
          err?.response?.data?.error ||
            err.message ||
            "Failed to load dashboard",
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return <div className="text-slate-600">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="text-slate-500 mt-1">
          Signalwave SMTP monitoring overview
        </p>
      </div>

      {/* KPI Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard title="SMTP Profiles" value={stats.profiles} />

        <StatCard title="Total Tests" value={stats.tests} />

        <StatCard title="Pass Rate" value={`${stats.passRate}%`} />

        <StatCard title="Recent Failures" value={stats.recentFailures} />
      </div>

      {/* Admin Only */}

      {stats.isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <StatCard title="Users" value={stats.users} />

          <StatCard title="Diagnostics" value={stats.diagnostics} />

          <StatCard title="Send Tests" value={stats.sendTests} />

          <StatCard title="Failed Checks" value={stats.failed} />
        </div>
      )}

      {/* Charts */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Pass vs Fail</h2>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={passFail}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  <Cell fill="#16a34a" />

                  <Cell fill="#dc2626" />
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Last 7 Days Activity</h2>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activity}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="date" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="tests"
                  stroke="#2563eb"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Failures */}

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Recent Failures</h2>
        </div>

        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-4">Profile</th>

              <th className="text-left p-4">Status</th>

              <th className="text-left p-4">Date</th>
            </tr>
          </thead>

          <tbody>
            {failures.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="p-4">{item.profileName}</td>

                <td className="p-4 text-red-600 font-medium">{item.status}</td>

                <td className="p-4">
                  {new Date(item.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}

            {failures.length === 0 && (
              <tr>
                <td colSpan="3" className="p-6 text-center text-slate-500">
                  No failures found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
