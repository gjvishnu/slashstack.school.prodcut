import {
  ArrowUpRight,
  Calendar,
  Download,
  GraduationCap,
  Search,
  UserCheck,
  UserRoundCog,
  UsersRound,
} from "lucide-react";

const stats = [
  {
    label: "Total Students",
    value: "1,248",
    trend: "+12.4%",
    icon: GraduationCap,
    accent: "bg-indigo-50 text-indigo-600",
  },
  {
    label: "Total Teachers",
    value: "86",
    trend: "+4 new",
    icon: UsersRound,
    accent: "bg-teal-50 text-teal-600",
  },
  {
    label: "Other Staffs",
    value: "54",
    trend: "+2 new",
    icon: UserRoundCog,
    accent: "bg-amber-50 text-amber-600",
  },
];

const attendanceSummary = [
  { label: "Students Present", value: "1,180", total: "1,248", percent: "94.5%", accent: "bg-indigo-600" },
  { label: "Teachers Present", value: "80", total: "86", percent: "93.0%", accent: "bg-teal-500" },
  { label: "Staffs Present", value: "49", total: "54", percent: "90.7%", accent: "bg-amber-500" },
];

const upcomingExams = [
  { examType: "Monthly Exam", className: "Class 10-A", date: "Apr 30", time: "09:30 AM" },
  { examType: "Mid-Term Exam", className: "Class 12-B", date: "May 02", time: "10:00 AM" },
  { examType: "Unit Test", className: "Class 8-C", date: "May 04", time: "11:15 AM" },
  { examType: "Quarterly Exam", className: "Class 11-A", date: "May 06", time: "09:00 AM" },
];

const events = [
  { title: "Parent Teacher Meeting", scope: "All sections", date: "May 01", owner: "Admin Office" },
  { title: "Annual Sports Practice", scope: "Middle School", date: "May 03", owner: "Sports Dept." },
  { title: "Science Exhibition", scope: "Classes 9-12", date: "May 08", owner: "Academic Team" },
  { title: "Fee Reminder Cycle", scope: "Pending dues", date: "May 10", owner: "Accounts" },
];

export const Dashboard = () => {
  return (
    <main className="min-h-full bg-[#f6f8fb] p-6 text-slate-950">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Welcome back, Admin</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal">School Dashboard</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex h-10 min-w-72 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-500 shadow-sm">
              <Search className="h-4 w-4" />
              <input
                className="w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
                placeholder="Search students, staff, receipts"
                type="search"
              />
            </label>
            <button className="flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm" type="button">
              <Calendar className="h-4 w-4" />
              Apr 2026
            </button>
            <button className="flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm" type="button">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </header>

        <section className="grid gap-3 md:grid-cols-3">
          {stats.map(({ label, value, trend, icon: Icon, accent }) => (
            <article key={label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className={`flex h-8 w-8 items-center justify-center rounded-md ${accent}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="flex items-center gap-1 rounded bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
                  {trend}
                  <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold">{value}</p>
            </article>
          ))}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-950">Attendance Summary</p>
              <p className="mt-1 text-xs text-slate-500">Select a date to check previous attendance records</p>
            </div>

            <label className="flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm">
              <Calendar className="h-4 w-4 text-slate-500" />
              <input
                className="bg-transparent text-sm outline-none"
                defaultValue="2026-04-28"
                type="date"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {attendanceSummary.map((item) => (
              <article key={item.label} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-slate-700 shadow-sm">
                    <UserCheck className="h-4 w-4" />
                  </div>
                  <span className="rounded bg-white px-2 py-1 text-xs font-semibold text-slate-600">
                    {item.percent}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                <div className="mt-2 flex items-end gap-2">
                  <p className="text-3xl font-semibold text-slate-950">{item.value}</p>
                  <p className="pb-1 text-sm text-slate-500">/ {item.total}</p>
                </div>
                {/* <div className="mt-4 h-2 rounded-full bg-white">
                  <div className={`h-full rounded-full ${item.accent}`} style={{ width: item.percent }} />
                </div> */}
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
           

          <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-sm font-semibold">Upcoming Exams</p>
                <p className="mt-1 text-xs text-slate-500">List view for quick schedule scanning</p>
              </div>
              <button className="text-sm font-semibold text-indigo-600" type="button">View all</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Exam</th>
                    <th className="px-5 py-3 font-semibold">Class</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {upcomingExams.map((exam) => (
                    <tr key={`${exam.examType}-${exam.className}`} className="text-slate-700">
                      <td className="px-5 py-4 font-semibold text-slate-950">{exam.examType}</td>
                      <td className="px-5 py-4">{exam.className}</td>
                      <td className="px-5 py-4">{exam.date}</td>
                      <td className="px-5 py-4">{exam.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <p className="text-sm font-semibold">Events</p>
              <p className="mt-1 text-xs text-slate-500">Upcoming campus activities</p>
            </div>
            <div className="divide-y divide-slate-100">
              {events.map((event) => (
                <div key={event.title} className="grid grid-cols-[4.5rem_1fr] gap-4 px-5 py-4">
                  <div className="rounded-md bg-slate-50 px-3 py-2 text-center">
                    <p className="text-xs font-semibold text-slate-400">Date</p>
                    <p className="mt-1 text-sm font-semibold text-slate-950">{event.date}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-950">{event.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{event.scope}</p>
                    <p className="mt-2 text-xs font-medium text-slate-400">{event.owner}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
};
