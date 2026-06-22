import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Server,
  Activity,
  Search,
  History,
  Users,
  ClipboardList,
  Settings,
  Bell,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";

export default function Sidebar() {
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";

  const items = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "SMTP Profiles",
      path: "/profiles",
      icon: Server,
    },
    {
      name: "Monitoring",
      path: "/monitoring",
      icon: Activity,
    },
    {
      name: "Diagnostics",
      path: "/diagnostics",
      icon: Search,
    },
    {
      name: "Alerts",
      path: "/alerts",
      icon: Bell,
    },
    {
      name: "History",
      path: "/history",
      icon: History,
    },

    ...(isAdmin
      ? [
          {
            name: "Team",
            path: "/team",
            icon: Users,
          },
          {
            name: "Audit Logs",
            path: "/audit",
            icon: ClipboardList,
          },
          {
            name: "Settings",
            path: "/settings",
            icon: Settings,
          },
        ]
      : []),
  ];

  return (
    <aside className="w-64 bg-slate-950 text-white border-r border-slate-800 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold">Signalwave</h1>

        <p className="text-slate-400 text-sm mt-1">SMTP Monitoring Platform</p>

        <div className="mt-3 text-xs text-slate-500">
          {user?.name}
          <br />
          {user?.role}
        </div>
      </div>

      <nav className="flex-1 p-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition ${
                  isActive ? "bg-slate-800" : "hover:bg-slate-900"
                }`
              }
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
