export default function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <div className="text-slate-500 text-sm">{title}</div>

      <div className="text-3xl font-bold mt-2">{value}</div>
    </div>
  );
}
