import { NavLink } from "react-router-dom";
import {
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Settings,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

const generalLinks = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/" },
    { label: "Teachers", icon: UsersRound, to: "/teachers" },
   { label: "Classes & Students", icon: BookOpen, to: "/classes" },
];

const operationLinks = [
  { label: "Students Attendance", icon: LayoutDashboard, to: "/ff" },
  { label: "Exams", icon: ClipboardList, to: "/exams" },
  { label: "Announcement", icon: UsersRound, to: "/ggg" },
   { label: "Events", icon: CalendarDays, to: "/events" },
];

const supportLinks = [
  { label: "Messages", icon: MessageSquare, badge: "8" },
  { label: "Notice Board", icon: Bell },
  { label: "Settings", icon: Settings },
  { label: "Security", icon: ShieldCheck },
];

export const Sidebar = () => {
  return (
    <aside className="flex h-full flex-col border-r border-slate-200 bg-white/95 px-4 py-5">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
          S
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Slashstack</h2>
          <p className="text-xs text-slate-500">School ERP</p>
        </div>
      </div>

      <div className="space-y-7">
        <nav>
          <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            General
          </p>
          <div className="space-y-1">
            {generalLinks.map(({ label, icon: Icon, to }) => (
              <NavLink
                key={label}
                className={({ isActive }) =>
                  `flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition ${
                    isActive
                    ? "bg-slate-100 font-semibold text-slate-950"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`
                }
                to={to}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

         <nav>
          <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Operation
          </p>
          <div className="space-y-1">
            {operationLinks.map(({ label, icon: Icon, to }) => (
              <NavLink
                key={label}
                className={({ isActive }) =>
                  `flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition ${
                    isActive
                    ? "bg-slate-100 font-semibold text-slate-950"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`
                }
                to={to}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <nav>
          <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Support
          </p>
          <div className="space-y-1">
            {supportLinks.map(({ label, icon: Icon, badge }) => (
              <button
                key={label}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                type="button"
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1 text-left">{label}</span>
                {badge ? (
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                    {badge}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </nav>
      </div>

      <div className="mt-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold text-slate-500">Academic Year</p>
        <p className="mt-1 text-sm font-semibold text-slate-950">2026 - 2027</p>
        <div className="mt-3 h-1.5 rounded-full bg-slate-200">
          <div className="h-full w-2/3 rounded-full bg-teal-500" />
        </div>
      </div>
    </aside>
  );
};
