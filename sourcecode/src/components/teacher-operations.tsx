import { useMemo, useState } from "react";
import {
  BookOpenCheck,
  CalendarDays,
  Download,
  FileBarChart2,
  FileText,
  Mail,
  Send,
  UserPlus,
  UserRoundCheck,
} from "lucide-react";
import { toast } from "react-toastify";
import { classRooms } from "./classes";
import { teachers } from "./teachers";
import {
  type LateMark,
  type LeaveApplication,
  getLateMarks,
  getLeaveApplications,
  saveLateMarks,
  saveLeaveApplications,
} from "./teacher-records";

type AssignmentRecord = {
  id: string;
  teacherName: string;
  teacherSubject: string;
  classLabel: string;
  assignedMonth: string;
};

const initialAssignments: AssignmentRecord[] = [
  {
    id: "assign-1",
    teacherName: "Ananya Sharma",
    teacherSubject: "Mathematics",
    classLabel: "Class 10 - Section A",
    assignedMonth: "2026-04",
  },
  {
    id: "assign-2",
    teacherName: "Meera Nair",
    teacherSubject: "English",
    classLabel: "Class 9 - Section B",
    assignedMonth: "2026-04",
  },
];

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

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));

const downloadExcel = (filename: string, worksheet: string) => {
  const blob = new Blob([worksheet], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const getTeacherContribution = (teacherName: string, monthValue: string) => {
  const teacher = teachers.find((item) => item.name === teacherName) ?? teachers[0];
  const monthNumber = Number(monthValue.split("-")[1] ?? "1");
  const monthPrefix = monthValue;
  const leaveApplications = getLeaveApplications().filter(
    (leave) =>
      leave.teacherName === teacherName &&
      leave.status === "Approved" &&
      (leave.fromDate.startsWith(monthPrefix) || leave.toDate.startsWith(monthPrefix)),
  );
  const lateMarks = getLateMarks().filter(
    (lateMark) =>
      lateMark.teacherName === teacherName && lateMark.date.startsWith(monthPrefix),
  );
  const approvedLeaveDates = leaveApplications.flatMap((leave) => {
    const dates: string[] = [];
    const currentDate = new Date(`${leave.fromDate}T00:00:00`);
    const endDate = new Date(`${leave.toDate}T00:00:00`);

    while (currentDate <= endDate) {
      const isoDate = currentDate.toISOString().slice(0, 10);

      if (isoDate.startsWith(monthPrefix)) {
        dates.push(isoDate);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  });
  const workingDays = 24;
  const approvedLeaveDays = approvedLeaveDates.length;
  const lateMarkCount = lateMarks.length;
  const attendanceDays = Math.max(
    0,
    Math.max(18, 22 - ((teacher.name.length + monthNumber) % 4)) - approvedLeaveDays,
  );
  const leaveTaken = approvedLeaveDays;
  const classesWorked = Math.max(
    0,
    teacher.classesTaught.length * 8 + monthNumber - approvedLeaveDays * 2,
  );
  const attendancePercent = Math.round((attendanceDays / workingDays) * 100);

  const classesHandled = teacher.classesTaught.map((className, index) => ({
    className,
    sessions: Math.max(2, 6 + ((index + monthNumber) % 4) - approvedLeaveDays),
  }));

  return {
    teacher,
    workingDays,
    attendanceDays,
    leaveTaken,
    lateMarkCount,
    classesWorked,
    attendancePercent,
    classesHandled,
    approvedLeaveDates,
  };
};

export const AssignTeacher = () => {
  const [teacherId, setTeacherId] = useState(teachers[0]?.id ?? "");
  const [classId, setClassId] = useState(classRooms[0]?.id ?? "");
  const [assignedMonth, setAssignedMonth] = useState("2026-04");
  const [assignments, setAssignments] = useState<AssignmentRecord[]>(initialAssignments);

  const selectedTeacher = teachers.find((item) => item.id === teacherId) ?? teachers[0];
  const selectedClass = classRooms.find((item) => item.id === classId) ?? classRooms[0];

  const handleAssignTeacher = () => {
    if (!selectedTeacher || !selectedClass) {
      return;
    }

    const nextAssignment: AssignmentRecord = {
      id: crypto.randomUUID(),
      teacherName: selectedTeacher.name,
      teacherSubject: selectedTeacher.subject,
      classLabel: `${selectedClass.className} - Section ${selectedClass.section}`,
      assignedMonth,
    };

    setAssignments((current) => [nextAssignment, ...current]);
    toast.success("Teacher assigned successfully for the selected class.");
  };

  return (
    <main className="min-h-full bg-[#f6f8fb] px-4 py-5 text-slate-950 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="space-y-3">
          <div>
            <p className="text-sm font-medium text-slate-500">Operations</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
              Assign Teacher
            </h1>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-base font-semibold text-slate-950">
              Assign teachers to classes by month
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Pick a teacher, select the class, and confirm the assignment for the chosen month.
            </p>
          </div>
        </header>

        <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-[26px] shadow-sm">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-indigo-600" />
              <div>
                <h2 className="text-base font-semibold text-slate-950">
                  New Assignment
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Create or update the class teacher assignment.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Teacher</span>
                <select
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none"
                  onChange={(event) => setTeacherId(event.target.value)}
                  value={teacherId}
                >
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} - {teacher.subject}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Class</span>
                <select
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none"
                  onChange={(event) => setClassId(event.target.value)}
                  value={classId}
                >
                  {classRooms.map((classRoom) => (
                    <option key={classRoom.id} value={classRoom.id}>
                      {classRoom.className} - Section {classRoom.section}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold text-slate-700">Month</span>
                <input
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none"
                  onChange={(event) => setAssignedMonth(event.target.value)}
                  type="month"
                  value={assignedMonth}
                />
              </label>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-950">Assignment preview</p>
              <p className="mt-2 text-sm text-slate-500">
                {selectedTeacher?.name} will handle {selectedClass?.className} - Section{" "}
                {selectedClass?.section} for {formatMonthLabel(assignedMonth)}.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-500 sm:w-auto"
                onClick={handleAssignTeacher}
                type="button"
              >
                <Send className="h-4 w-4" />
                Assign Teacher
              </button>
            </div>
          </article>

          <aside className="space-y-5">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <BookOpenCheck className="h-5 w-5 text-emerald-600" />
                <div>
                  <h2 className="text-base font-semibold text-slate-950">
                    Recent Assignments
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Latest teacher-to-class assignment records.
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {assignments.map((assignment) => (
                  <div
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    key={assignment.id}
                  >
                    <p className="text-sm font-semibold text-slate-950">
                      {assignment.teacherName}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {assignment.teacherSubject}
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-700">
                      {assignment.classLabel}
                    </p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {formatMonthLabel(assignment.assignedMonth)}
                    </p>
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

export const TeacherMonthlyAttendance = () => {
  const [teacherId, setTeacherId] = useState(teachers[0]?.id ?? "");
  const [selectedMonth, setSelectedMonth] = useState("2026-04");

  const contribution = useMemo(() => {
    const teacher = teachers.find((item) => item.id === teacherId) ?? teachers[0];
    return getTeacherContribution(teacher.name, selectedMonth);
  }, [teacherId, selectedMonth]);

  const handleDownload = () => {
    const worksheet = `
      <html>
        <head>
          <meta charset="UTF-8" />
        </head>
        <body>
          <h2>${contribution.teacher.name} Monthly Contribution Report</h2>
          <p>Month: ${formatMonthLabel(selectedMonth)}</p>
          <p>Attendance: ${contribution.attendanceDays}/${contribution.workingDays}</p>
          <p>Attendance Percentage: ${contribution.attendancePercent}%</p>
          <p>Classes Worked: ${contribution.classesWorked}</p>
          <p>Leave Taken: ${contribution.leaveTaken}</p>
          <p>Late Marks: ${contribution.lateMarkCount}</p>
          <p>Leave Dates: ${contribution.approvedLeaveDates.join(", ") || "None"}</p>
          <table border="1">
            <thead>
              <tr>
                <th>Class</th>
                <th>Sessions Taken</th>
              </tr>
            </thead>
            <tbody>
              ${contribution.classesHandled
                .map(
                  (item) => `
                    <tr>
                      <td>${item.className}</td>
                      <td>${item.sessions}</td>
                    </tr>
                  `,
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    downloadExcel(
      `${contribution.teacher.name.replaceAll(" ", "-")}-${selectedMonth}-monthly-contribution.xls`,
      worksheet,
    );
    toast.success("Teacher monthly contribution report downloaded.");
  };

  return (
    <main className="min-h-full bg-[#f6f8fb] px-4 py-5 text-slate-950 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="space-y-3">
          <div>
            <p className="text-sm font-medium text-slate-500">Operations</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
              Teacher Monthly Attendance
            </h1>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-base font-semibold text-slate-950">
              Review a teacher&apos;s monthly contribution
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Select the teacher and month to see attendance, classes worked, leave dates, late marks, and downloadable contribution data.
            </p>
          </div>
        </header>

        <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-[26px] shadow-sm">
            <div className="flex items-center gap-2">
              <FileBarChart2 className="h-5 w-5 text-indigo-600" />
              <div>
                <h2 className="text-base font-semibold text-slate-950">
                  Monthly Contribution
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Filter by teacher and month to inspect performance.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Teacher</span>
                <select
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none"
                  onChange={(event) => setTeacherId(event.target.value)}
                  value={teacherId}
                >
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} - {teacher.subject}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Month</span>
                <input
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none"
                  onChange={(event) => setSelectedMonth(event.target.value)}
                  type="month"
                  value={selectedMonth}
                />
              </label>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Attendance
                </p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">
                  {contribution.attendancePercent}%
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {contribution.attendanceDays}/{contribution.workingDays} days
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Classes Worked
                </p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">
                  {contribution.classesWorked}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Leaves
                </p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">
                  {contribution.leaveTaken}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Late Marks
                </p>
                <p className="mt-1 text-2xl font-semibold text-rose-700">
                  {contribution.lateMarkCount}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-500 sm:w-auto"
                onClick={handleDownload}
                type="button"
              >
                <Download className="h-4 w-4" />
                Download Overall Data
              </button>
            </div>
          </article>

          <aside className="space-y-5">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-emerald-600" />
                <div>
                  <h2 className="text-base font-semibold text-slate-950">
                    Classes Taken in Month
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {contribution.teacher.name} for {formatMonthLabel(selectedMonth)}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {contribution.classesHandled.map((item) => (
                  <div
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    key={item.className}
                  >
                    <p className="text-sm font-semibold text-slate-950">
                      {item.className}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      Sessions taken: {item.sessions}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-950">
                  Leave Dates in Selected Month
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {contribution.approvedLeaveDates.length > 0 ? (
                    contribution.approvedLeaveDates.map((date) => (
                      <span
                        className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700"
                        key={date}
                      >
                        {formatDate(date)}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      No leave dates in this month
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-sky-100 bg-sky-50 p-4">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-sky-600" />
                  <div>
                    <p className="font-semibold text-sky-800">
                      Monthly contribution ready
                    </p>
                    <p className="mt-1 text-sm text-sky-700">
                      Leave dates and late marks are included in this teacher&apos;s monthly summary.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </aside>
        </section>
      </div>
    </main>
  );
};

export const ApprovalAndMark = () => {
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>(
    () => getLeaveApplications(),
  );
  const [lateMarks, setLateMarks] = useState<LateMark[]>(() => getLateMarks());
  const [teacherId, setTeacherId] = useState(teachers[0]?.id ?? "");
  const [lateDate, setLateDate] = useState("2026-04-30");
  const [lateTime, setLateTime] = useState("09:10");
  const [lateMinutes, setLateMinutes] = useState("10");
  const [lateReason, setLateReason] = useState("Traffic delay");

  const pendingLeaveCount = leaveApplications.filter(
    (leave) => leave.status === "Pending",
  ).length;
  const selectedTeacher = teachers.find((item) => item.id === teacherId) ?? teachers[0];

  const updateLeaveStatus = (leaveId: string, status: LeaveApplication["status"]) => {
    const updatedLeaves = leaveApplications.map((leave) =>
      leave.id === leaveId ? { ...leave, status } : leave,
    );

    setLeaveApplications(updatedLeaves);
    saveLeaveApplications(updatedLeaves);
    toast.success(`Leave request ${status.toLowerCase()} successfully.`);
  };

  const handleMarkLate = () => {
    if (!selectedTeacher || !lateDate || !lateTime || !lateMinutes) {
      toast.error("Please complete the late mark details.");
      return;
    }

    const nextLateMark: LateMark = {
      id: crypto.randomUUID(),
      teacherName: selectedTeacher.name,
      date: lateDate,
      time: lateTime,
      lateMinutes: Number(lateMinutes),
      reason: lateReason.trim() || "Late arrival",
    };
    const updatedLateMarks = [nextLateMark, ...lateMarks];

    setLateMarks(updatedLateMarks);
    saveLateMarks(updatedLateMarks);
    toast.success("Late mark added successfully for the selected teacher.");
  };

  return (
    <main className="min-h-full bg-[#f6f8fb] px-4 py-5 text-slate-950 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="space-y-3">
          <div>
            <p className="text-sm font-medium text-slate-500">Operations</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
              Approval &amp; Mark
            </h1>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-base font-semibold text-slate-950">
              Approve teacher leave and mark late arrivals
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Review all teacher leave requests and record late entries that will reflect in monthly attendance.
            </p>
          </div>
        </header>

        <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <article className="space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-[26px] shadow-sm">
              <div className="flex items-center gap-2">
                <UserRoundCheck className="h-5 w-5 text-indigo-600" />
                <div>
                  <h2 className="text-base font-semibold text-slate-950">
                    Leave Approval
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Approve or reject teacher leave requests from one place.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Pending
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-amber-700">
                    {pendingLeaveCount}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Approved
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-emerald-700">
                    {leaveApplications.filter((leave) => leave.status === "Approved").length}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Rejected
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-rose-700">
                    {leaveApplications.filter((leave) => leave.status === "Rejected").length}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {leaveApplications.map((leave) => (
                  <div
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    key={leave.id}
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">
                          {leave.teacherName}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {leave.type} • {leave.fromDate} to {leave.toDate}
                        </p>
                        <p className="mt-2 text-sm text-slate-500">{leave.reason}</p>
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            leave.status === "Approved"
                              ? "bg-emerald-50 text-emerald-700"
                              : leave.status === "Pending"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {leave.status}
                        </span>
                        <button
                          className="inline-flex h-10 items-center justify-center rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={leave.status === "Approved"}
                          onClick={() => updateLeaveStatus(leave.id, "Approved")}
                          type="button"
                        >
                          Approve
                        </button>
                        <button
                          className="inline-flex h-10 items-center justify-center rounded-xl bg-rose-600 px-4 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={leave.status === "Rejected"}
                          onClick={() => updateLeaveStatus(leave.id, "Rejected")}
                          type="button"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </article>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-[26px] shadow-sm">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                <div>
                  <h2 className="text-base font-semibold text-slate-950">
                    Mark Late
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Record late arrivals for teachers and reflect them in monthly attendance.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">Teacher</span>
                  <select
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none"
                    onChange={(event) => setTeacherId(event.target.value)}
                    value={teacherId}
                  >
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name} - {teacher.subject}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Date</span>
                  <input
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none"
                    onChange={(event) => setLateDate(event.target.value)}
                    type="date"
                    value={lateDate}
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Time</span>
                  <input
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none"
                    onChange={(event) => setLateTime(event.target.value)}
                    type="time"
                    value={lateTime}
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Late Minutes
                  </span>
                  <input
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none"
                    min="1"
                    onChange={(event) => setLateMinutes(event.target.value)}
                    type="number"
                    value={lateMinutes}
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Reason</span>
                  <input
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none"
                    onChange={(event) => setLateReason(event.target.value)}
                    placeholder="Enter reason"
                    type="text"
                    value={lateReason}
                  />
                </label>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-500 sm:w-auto"
                  onClick={handleMarkLate}
                  type="button"
                >
                  <Send className="h-4 w-4" />
                  Save Late Mark
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-emerald-600" />
                <div>
                  <h2 className="text-base font-semibold text-slate-950">
                    Recent Late Marks
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Latest late entries recorded for teachers.
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {lateMarks.map((item) => (
                  <div
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    key={item.id}
                  >
                    <p className="text-sm font-semibold text-slate-950">
                      {item.teacherName}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.date} • {item.time}
                    </p>
                    <p className="mt-2 text-sm text-slate-700">
                      {item.lateMinutes} minutes late
                    </p>
                    <p className="mt-2 text-xs text-slate-500">{item.reason}</p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
};
