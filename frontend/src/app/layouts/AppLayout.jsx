import { Outlet } from "react-router-dom";

import Sidebar from "../../components/navigation/Sidebar";
import Topbar from "../../components/navigation/Topbar";

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Topbar />

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
