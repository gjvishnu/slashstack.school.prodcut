import { useMemo, useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  FileClock,
  FileText,
  MapPin,
  Send,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  CURRENT_TEACHER_NAME,
  type LeaveApplication,
  type LeaveStatus,
  getLateMarks,
  getLeaveApplications,
  saveLeaveApplications,
} from "./teacher-records";

const todaySchedule = [
  { hour: "1st Hour", time: "08:45 AM - 09:30 AM", className: "Class 9-A", subject: "Mathematics", room: "Room 109" },
  { hour: "2nd Hour", time: "09:35 AM - 10:20 AM", className: "Class 10-A", subject: "Mathematics", room: "Room 204" },
  { hour: "3rd Hour", time: "10:30 AM - 11:15 AM", className: "Class 10-B", subject: "Mathematics", room: "Room 205" },
  { hour: "4th Hour", time: "11:20 AM - 12:05 PM", className: "Class 9-A", subject: "Revision", room: "Room 109" },
  { hour: "5th Hour", time: "12:45 PM - 01:30 PM", className: "Class 8-C", subject: "Activity Support", room: "Room 302" },
  { hour: "6th Hour", time: "01:35 PM - 02:20 PM", className: "Class 10-A", subject: "Problem Solving", room: "Room 204" },
  { hour: "7th Hour", time: "02:25 PM - 03:10 PM", className: "Class 10-B", subject: "Test Discussion", room: "Room 205" },
  { hour: "8th Hour", time: "03:15 PM - 04:00 PM", className: "Class 9-A", subject: "Doubt Clearance", room: "Room 109" },
];

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));

const formatMonthLabel = (monthValue: string) => {
  const [year, month] = monthValue.split("-");

  if (!year || !month) {
    return monthValue;
  }

  return new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
  }).format(new Date(Number(year), Number(month) - 1, 1));
};

const getStatusClasses = (status: LeaveStatus) => {
  if (status === "Approved") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (status === "Pending") {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-rose-50 text-rose-700";
};

const getApprovedLeaveDatesForMonth = (
  leaveApplications: LeaveApplication[],
  monthValue: string,
) =>
  leaveApplications.flatMap((leave) => {
    const dates: string[] = [];
    const currentDate = new Date(`${leave.fromDate}T00:00:00`);
    const endDate = new Date(`${leave.toDate}T00:00:00`);

    while (currentDate <= endDate) {
      const isoDate = currentDate.toISOString().slice(0, 10);

      if (isoDate.startsWith(monthValue)) {
        dates.push(isoDate);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  });

export const MyAttendance = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("2026-04");
  const today = "2026-04-30";
  const currentTeacherLateMarks = useMemo(
    () =>
      getLateMarks().filter((item) => item.teacherName === CURRENT_TEACHER_NAME),
    [],
  );
  const approvedLeavesForMonth = useMemo(
    () =>
      getLeaveApplications().filter(
        (leave) =>
          leave.teacherName === CURRENT_TEACHER_NAME &&
          leave.status === "Approved" &&
          (leave.fromDate.startsWith(selectedMonth) || leave.toDate.startsWith(selectedMonth)),
      ),
    [selectedMonth],
  );
  const leaveDates = useMemo(
    () => getApprovedLeaveDatesForMonth(approvedLeavesForMonth, selectedMonth),
    [approvedLeavesForMonth, selectedMonth],
  );
  const monthlyWorkingDays = 24;
  const monthlyPresentDays = Math.max(0, monthlyWorkingDays - leaveDates.length);

  const handleSubmitAttendance = () => {
    if (isSubmitted) {
      return;
    }

    setIsSubmitted(true);
    toast.success(
      "Your attendance has been submitted. Your reporting manager will review this.",
    );
  };

  return (
    <main className="min-h-full bg-[#f6f8fb] px-4 py-5 text-slate-950 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="space-y-3">
          <div>
            <p className="text-sm font-medium text-slate-500">Teacher house</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
              My Attendance
            </h1>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-base font-semibold text-slate-950">
              Mark your attendance for today
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Submit your presence for the day and your reporting manager will review it.
            </p>
          </div>
        </header>

        <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-[26px] shadow-sm">
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-emerald-600" />
              <div>
                <h2 className="text-base font-semibold text-slate-950">
                  Today&apos;s Check-in
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  One tap is enough to confirm you are present today.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Date
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-950">
                {formatDate(today)}
              </p>
              <p className="mt-3 text-sm text-slate-500">
                Status: {isSubmitted ? "Submitted for manager review" : "Not submitted yet"}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white transition sm:w-auto ${
                  isSubmitted ? "bg-emerald-500" : "bg-indigo-600 hover:bg-indigo-500"
                }`}
                onClick={handleSubmitAttendance}
                type="button"
              >
                <CheckCircle2 className="h-4 w-4" />
                {isSubmitted ? "Attendance Submitted" : "I am Present Today"}
              </button>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-950">
                    Attendance Review Preview
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Review the selected month&apos;s presence and leave dates.
                  </p>
                </div>

                <input
                  className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none"
                  onChange={(event) => setSelectedMonth(event.target.value)}
                  type="month"
                  value={selectedMonth}
                />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Selected Month
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">
                    {formatMonthLabel(selectedMonth)}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Present Days
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-emerald-700">
                    {monthlyPresentDays}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Leave Dates
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-rose-700">
                    {leaveDates.length}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-white p-4">
                <p className="text-sm font-semibold text-slate-950">
                  Approved Leave Dates
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {leaveDates.length > 0 ? (
                    leaveDates.map((date) => (
                      <span
                        className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700"
                        key={date}
                      >
                        {formatDate(date)}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      No approved leave dates
                    </span>
                  )}
                </div>
              </div>
            </div>
          </article>

          <aside className="space-y-5">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-slate-950">
                This Week Summary
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Present Days
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950">5</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Late Marks
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950">
                    {currentTeacherLateMarks.length}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Review Queue
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950">
                    {isSubmitted ? 1 : 0}
                  </p>
                </div>
              </div>
            </article>
          </aside>
        </section>
      </div>
    </main>
  );
};

export const LeaveTracker = () => {
  const [leaveType, setLeaveType] = useState("Casual Leave");
  const [fromDate, setFromDate] = useState("2026-05-14");
  const [toDate, setToDate] = useState("2026-05-14");
  const [reason, setReason] = useState("");
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>(() =>
    getLeaveApplications().filter((leave) => leave.teacherName === CURRENT_TEACHER_NAME),
  );

  const approvedLeaves = leaveApplications.filter(
    (leave) => leave.status === "Approved",
  ).length;
  const pendingLeaves = leaveApplications.filter(
    (leave) => leave.status === "Pending",
  ).length;
  const totalLeaveBalance = 18;
  const usedLeaves = approvedLeaves;
  const availableLeaves = totalLeaveBalance - usedLeaves;

  const handleApplyLeave = () => {
    if (!reason.trim() || !fromDate || !toDate) {
      toast.error("Please fill the leave dates and reason.");
      return;
    }

    const nextLeave: LeaveApplication = {
      id: crypto.randomUUID(),
      teacherName: CURRENT_TEACHER_NAME,
      type: leaveType,
      fromDate,
      toDate,
      reason: reason.trim(),
      status: "Pending",
    };
    const updatedLeaves = [nextLeave, ...leaveApplications];

    setLeaveApplications(updatedLeaves);
    saveLeaveApplications([
      ...getLeaveApplications().filter(
        (leave) => leave.teacherName !== CURRENT_TEACHER_NAME,
      ),
      ...updatedLeaves,
    ]);
    setReason("");
    setLeaveType("Casual Leave");
    setFromDate("2026-05-14");
    setToDate("2026-05-14");
    toast.success(
      "Your leave is applied. Your reporting manager will review this.",
    );
  };

  return (
    <main className="min-h-full bg-[#f6f8fb] px-4 py-5 text-slate-950 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="space-y-3">
          <div>
            <p className="text-sm font-medium text-slate-500">Teacher house</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
              Leave Tracker
            </h1>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-base font-semibold text-slate-950">
              Track leave balance and apply for new leave
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Review your leave counts, submit requests, and follow application status.
            </p>
          </div>
        </header>

        <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-[26px] shadow-sm">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              <div>
                <h2 className="text-base font-semibold text-slate-950">
                  Apply Leave
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Fill the request and send it to your reporting manager.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Total Leave
                </p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">
                  {totalLeaveBalance}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Available
                </p>
                <p className="mt-1 text-2xl font-semibold text-emerald-700">
                  {availableLeaves}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Taken
                </p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">
                  {usedLeaves}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Pending
                </p>
                <p className="mt-1 text-2xl font-semibold text-amber-700">
                  {pendingLeaves}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">
                  Leave Type
                </span>
                <select
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none"
                  onChange={(event) => setLeaveType(event.target.value)}
                  value={leaveType}
                >
                  <option>Casual Leave</option>
                  <option>Medical Leave</option>
                  <option>Emergency Leave</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">
                  From Date
                </span>
                <input
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none"
                  onChange={(event) => setFromDate(event.target.value)}
                  type="date"
                  value={fromDate}
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">
                  To Date
                </span>
                <input
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none"
                  onChange={(event) => setToDate(event.target.value)}
                  type="date"
                  value={toDate}
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold text-slate-700">
                  Reason
                </span>
                <textarea
                  className="min-h-28 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none"
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="Enter your leave reason"
                  value={reason}
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-500 sm:w-auto"
                onClick={handleApplyLeave}
                type="button"
              >
                <Send className="h-4 w-4" />
                Apply Leave
              </button>
            </div>
          </article>

          <aside className="space-y-5">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-slate-950">
                Applied Leave Status
              </h2>
              <div className="mt-4 space-y-3">
                {leaveApplications.map((leave) => (
                  <div
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    key={leave.id}
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">
                          {leave.type}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {formatDate(leave.fromDate)} to {formatDate(leave.toDate)}
                        </p>
                        <p className="mt-2 text-sm text-slate-500">{leave.reason}</p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                          leave.status,
                        )}`}
                      >
                        {leave.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </aside>
        </section>
      </div>
    </main>
  );
};

export const MyTimeTable = () => {
  return (
    <main className="min-h-full bg-[#f6f8fb] px-4 py-5 text-slate-950 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="space-y-3">
          <div>
            <p className="text-sm font-medium text-slate-500">Teacher house</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
              My Time Table
            </h1>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-base font-semibold text-slate-950">
              Today&apos;s 8-hour teaching schedule
            </p>
            <p className="mt-1 text-sm text-slate-500">
              View your class-by-class plan for the full teaching day.
            </p>
          </div>
        </header>

        <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-[26px] shadow-sm">
            <div className="flex items-center gap-2">
              <FileClock className="h-5 w-5 text-indigo-600" />
              <div>
                <h2 className="text-base font-semibold text-slate-950">
                  Today&apos;s Schedule
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Eight periods with class, subject, and room details.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {todaySchedule.map((item) => (
                <div
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  key={item.hour}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">
                        {item.hour}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">{item.time}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                      {item.className}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Subject
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {item.subject}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Room
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        {item.room}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <aside className="space-y-5">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-slate-950">
                Day Summary
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Total Hours
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950">8</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Classes Today
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950">4</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Main Subject
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">
                    Mathematics
                  </p>
                </div>
              </div>
            </article>
          </aside>
        </section>
      </div>
    </main>
  );
};
