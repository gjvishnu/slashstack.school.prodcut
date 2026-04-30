import { NavLink } from "react-router-dom";
import {
  BadgeCheck,
  BookOpen,
  BookUser,
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  FileSpreadsheet,
  FileText,
  FileClock,
  FileStack,
  LogOut,
  LayoutDashboard,
  MoveUpRight,
  UsersRound,
  X,
} from "lucide-react";

const generalLinks = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/" },
  { label: "Teachers", icon: UsersRound, to: "/teachers" },
  { label: "Classes & Students", icon: BookOpen, to: "/classes" },
  { label: "Exam and Attendance Report", icon: FileSpreadsheet, to: "/reports" },
];

const operationLinks = [
  { label: "Students Attendance", icon: LayoutDashboard, to: "/student-attendance" },
  { label: "Exams", icon: ClipboardList, to: "/exams" },
  { label: "Assign Teacher", icon: BookUser, to: "/assign-teacher" },
  { label: "Teacher Monthly Attendance", icon: FileStack, to: "/teacher-monthly-attendance" },
  { label: "Approval & Mark", icon: BadgeCheck, to: "/approval-mark" },
  { label: "Announcement", icon: UsersRound, to: "/announcement" },
  { label: "Events", icon: CalendarDays, to: "/events" },
  { label: "Promote", icon: MoveUpRight, to: "/promote" },
];

const teacherHouseLinks = [
  { label: "My Attendance", icon: CalendarCheck, to: "/my-attendance" },
  { label: "Leave Tracker", icon: FileText, to: "/leave-tracker" },
  { label: "My Time Table", icon: FileClock, to: "/my-time-table" },
];

const loggedInUser = {
  name: "Ananya Sharma",
  role: "Mathematics Teacher",
 
};

type SidebarProps = {
  isMobile?: boolean;
  onNavigate?: () => void;
  onClose?: () => void;
};

export const Sidebar = ({
  isMobile = false,
  onNavigate,
  onClose,
}: SidebarProps) => {
  const initials = loggedInUser.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <aside className="flex h-full flex-col border-r border-slate-200 bg-white/95 px-4 py-5 backdrop-blur">
      <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-sm font-bold text-emerald-700">
              {initials}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-slate-950">
                {loggedInUser.name}
              </h2>
              <p className="truncate text-xs text-slate-500">
                {loggedInUser.role}
              </p>
            </div>
          </div>

          {isMobile ? (
            <button
              className="rounded-full p-2 text-slate-500 transition hover:bg-white hover:text-slate-900"
              onClick={onClose}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          ) : null}
        </div>

        
      </div>

      <div className="space-y-7 overflow-y-auto pr-1">
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
                onClick={onNavigate}
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
                onClick={onNavigate}
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
            Teacher house
          </p>
          <div className="space-y-1">
            {teacherHouseLinks.map(({ label, icon: Icon, to }) => (
              <NavLink
                key={label}
                className={({ isActive }) =>
                  `flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition ${
                    isActive
                      ? "bg-slate-100 font-semibold text-slate-950"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`
                }
                onClick={onNavigate}
                to={to}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1 text-left">{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-slate-500">Academic Year</p>
            <p className="mt-1 text-sm font-semibold text-slate-950">
              2026 - 2027
            </p>
          </div>
          <button
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
            type="button"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-slate-200">
          <div className="h-full w-2/3 rounded-full bg-teal-500" />
        </div>
      </div>
    </aside>
  );
};
