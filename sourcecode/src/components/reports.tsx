import { useMemo, useState } from "react";
import {
  CalendarCheck,
  Check,
  ChevronDown,
  Download,
  FileSpreadsheet,
  GraduationCap,
  ScrollText,
} from "lucide-react";
import { classRooms, type ClassRoom, type Student } from "./classes";

type ReportMode = "exam" | "attendance";
type AttendanceRangeMode = "all" | "selected";

const examMeta: Record<string, { displayName: string; date: string }> = {
  "Unit Test 1": { displayName: "Monthly Exam", date: "2026-04-18" },
  "Mid Term": { displayName: "Mid-Term Exam", date: "2026-06-24" },
  "Quarterly Exam": { displayName: "Quarterly Exam", date: "2026-08-12" },
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));

const monthToDateRangeLabel = (month: string) => {
  const monthIndex = new Date(`${month} 1, 2026`).getMonth();
  const start = new Date(2026, monthIndex, 1);
  const end = new Date(2026, monthIndex + 1, 0);

  return `${month} (${new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
  }).format(start)} - ${new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
  }).format(end)})`;
};

const getAttendancePercent = (attendance: Student["attendance"]) => {
  const totalPresent = attendance.reduce((sum, item) => sum + item.present, 0);
  const totalDays = attendance.reduce((sum, item) => sum + item.total, 0);

  return totalDays ? Math.round((totalPresent / totalDays) * 100) : 0;
};

const downloadExcel = (filename: string, worksheet: string) => {
  const blob = new Blob([worksheet], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const downloadClassExamReport = (classRoom: ClassRoom, selectedExam: string) => {
  const rows = classRoom.students
    .flatMap((student) =>
      student.marks
        .filter((mark) => selectedExam === "all" || mark.exam === selectedExam)
        .map((mark) => {
          const meta = examMeta[mark.exam] ?? {
            displayName: mark.exam,
            date: "2026-04-01",
          };

          return `
            <tr>
              <td>${student.name}</td>
              <td>${student.admissionNo}</td>
              <td>${student.rollNo}</td>
              <td>${meta.displayName}</td>
              <td>${formatDate(meta.date)}</td>
              <td>${mark.subject}</td>
              <td>${mark.marks}</td>
              <td>${mark.grade}</td>
            </tr>
          `;
        }),
    )
    .join("");

  const examLabel =
    selectedExam === "all"
      ? "All Exams"
      : examMeta[selectedExam]?.displayName ?? selectedExam;
  const worksheet = `
    <html>
      <head>
        <meta charset="UTF-8" />
      </head>
      <body>
        <h2>${classRoom.className} - Section ${classRoom.section} Exam Report</h2>
        <p>Class Teacher: ${classRoom.classTeacher}</p>
        <p>Total Students: ${classRoom.students.length}</p>
        <p>Exam Filter: ${examLabel}</p>
        <table border="1">
          <thead>
            <tr>
              <th>Student</th>
              <th>Admission No</th>
              <th>Roll No</th>
              <th>Exam</th>
              <th>Exam Date</th>
              <th>Subject</th>
              <th>Marks</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
    </html>
  `;

  downloadExcel(
    `${classRoom.className.replaceAll(" ", "-")}-${classRoom.section}-${examLabel.replaceAll(" ", "-")}-exam-report.xls`,
    worksheet,
  );
};

const downloadClassAttendanceReport = (
  classRoom: ClassRoom,
  selectedMonths: string[],
) => {
  const allMonthHeaders = Array.from(
    new Set(
      classRoom.students.flatMap((student) =>
        student.attendance.map((item) => item.month),
      ),
    ),
  );
  const monthHeaders =
    selectedMonths.length > 0
      ? allMonthHeaders.filter((month) => selectedMonths.includes(month))
      : allMonthHeaders;

  const rows = classRoom.students
    .map((student) => {
      const filteredAttendance =
        selectedMonths.length > 0
          ? student.attendance.filter((item) => selectedMonths.includes(item.month))
          : student.attendance;
      const monthCells = monthHeaders
        .map((month) => {
          const record = student.attendance.find((item) => item.month === month);

          return `<td>${record ? `${record.present}/${record.total}` : "-"}</td>`;
        })
        .join("");

      return `
        <tr>
          <td>${student.name}</td>
          <td>${student.admissionNo}</td>
          <td>${student.rollNo}</td>
          ${monthCells}
          <td>${getAttendancePercent(filteredAttendance)}%</td>
        </tr>
      `;
    })
    .join("");

  const monthLabel =
    selectedMonths.length > 0 ? selectedMonths.join(", ") : "All Months";
  const worksheet = `
    <html>
      <head>
        <meta charset="UTF-8" />
      </head>
      <body>
        <h2>${classRoom.className} - Section ${classRoom.section} Attendance Report</h2>
        <p>Class Teacher: ${classRoom.classTeacher}</p>
        <p>Total Students: ${classRoom.students.length}</p>
        <p>Month Filter: ${monthLabel}</p>
        <table border="1">
          <thead>
            <tr>
              <th>Student</th>
              <th>Admission No</th>
              <th>Roll No</th>
              ${monthHeaders.map((month) => `<th>${month}</th>`).join("")}
              <th>Overall %</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
    </html>
  `;

  downloadExcel(
    `${classRoom.className.replaceAll(" ", "-")}-${classRoom.section}-attendance-report.xls`,
    worksheet,
  );
};

export const Reports = () => {
  const [mode, setMode] = useState<ReportMode>("exam");
  const [selectedClassId, setSelectedClassId] = useState(classRooms[0]?.id ?? "");
  const [selectedExam, setSelectedExam] = useState("all");
  const [attendanceRangeMode, setAttendanceRangeMode] =
    useState<AttendanceRangeMode>("all");
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

  const selectedClass = useMemo(
    () => classRooms.find((room) => room.id === selectedClassId) ?? classRooms[0],
    [selectedClassId],
  );

  const availableExams = useMemo(
    () =>
      Array.from(
        new Set(
          selectedClass?.students.flatMap((student) =>
            student.marks.map((mark) => mark.exam),
          ) ?? [],
        ),
      ),
    [selectedClass],
  );

  const availableMonths = useMemo(
    () =>
      Array.from(
        new Set(
          selectedClass?.students.flatMap((student) =>
            student.attendance.map((item) => item.month),
          ) ?? [],
        ),
      ),
    [selectedClass],
  );

  const totalExamEntries =
    selectedClass?.students.reduce((sum, student) => sum + student.marks.length, 0) ?? 0;
  const selectedExamEntries =
    selectedClass?.students.reduce(
      (sum, student) =>
        sum +
        student.marks.filter(
          (mark) => selectedExam === "all" || mark.exam === selectedExam,
        ).length,
      0,
    ) ?? 0;
  const filteredAverageAttendance =
    selectedClass?.students.length
      ? Math.round(
          selectedClass.students.reduce((sum, student) => {
            const filteredAttendance =
              attendanceRangeMode === "selected" && selectedMonths.length > 0
                ? student.attendance.filter((item) => selectedMonths.includes(item.month))
                : student.attendance;

            return sum + getAttendancePercent(filteredAttendance);
          }, 0) / selectedClass.students.length,
        )
      : 0;
  const monthsIncludedCount =
    attendanceRangeMode === "selected" && selectedMonths.length > 0
      ? selectedMonths.length
      : availableMonths.length;

  const toggleMonthSelection = (month: string) => {
    setSelectedMonths((current) =>
      current.includes(month)
        ? current.filter((item) => item !== month)
        : [...current, month],
    );
  };

  return (
    <main className="min-h-full bg-[#f6f8fb] px-4 py-5 text-slate-950 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="space-y-3">
          <div>
            <p className="text-sm font-medium text-slate-500">General</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
              Exam and Attendance Report
            </h1>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-base font-semibold text-slate-950">
              Export class-wise reports as Excel files
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Switch between exam and attendance reports, select a class, then
              choose a specific exam or selected months when needed.
            </p>
          </div>
        </header>

        <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-[26px] shadow-sm">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-indigo-600" />
              <div>
                <h2 className="text-base font-semibold text-slate-950">
                  Export Report
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Choose the report type, class, and filter before exporting.
                </p>
              </div>
            </div>

            <div className="mt-5 inline-flex rounded-2xl bg-slate-100 p-1">
              <button
                className={`inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold transition ${
                  mode === "exam"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                onClick={() => setMode("exam")}
                type="button"
              >
                Exam
              </button>
              <button
                className={`inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold transition ${
                  mode === "attendance"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                onClick={() => setMode("attendance")}
                type="button"
              >
                Attendance
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold text-slate-700">Class</span>
                <select
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:bg-white"
                  onChange={(event) => {
                    setSelectedClassId(event.target.value);
                    setSelectedExam("all");
                    setAttendanceRangeMode("all");
                    setSelectedMonths([]);
                    setIsMonthDropdownOpen(false);
                  }}
                  value={selectedClass?.id ?? ""}
                >
                  {classRooms.map((classRoom) => (
                    <option key={classRoom.id} value={classRoom.id}>
                      {classRoom.className} - Section {classRoom.section}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Class Teacher
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {selectedClass?.classTeacher}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Total Students
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {selectedClass?.students.length}
                </p>
              </div>
            </div>

            {mode === "exam" ? (
              <div className="mt-4 space-y-2">
                <span className="text-sm font-semibold text-slate-700">Exam Filter</span>
                <select
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:bg-white"
                  onChange={(event) => setSelectedExam(event.target.value)}
                  value={selectedExam}
                >
                  <option value="all">All Exams</option>
                  {availableExams.map((exam) => (
                    <option key={exam} value={exam}>
                      {(examMeta[exam]?.displayName ?? exam)} - {formatDate(examMeta[exam]?.date ?? "2026-04-01")}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <span className="text-sm me-2 font-semibold text-slate-700">
                    Attendance Filter
                  </span>
                  <div className="inline-flex rounded-2xl bg-slate-100 p-1">
                    <button
                      className={`inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold transition ${
                        attendanceRangeMode === "all"
                          ? "bg-white text-slate-950 shadow-sm"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                      onClick={() => {
                        setAttendanceRangeMode("all");
                        setSelectedMonths([]);
                        setIsMonthDropdownOpen(false);
                      }}
                      type="button"
                    >
                      All Months
                    </button>
                    <button
                      className={`inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold transition ${
                        attendanceRangeMode === "selected"
                          ? "bg-white text-slate-950 shadow-sm"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                      onClick={() => setAttendanceRangeMode("selected")}
                      type="button"
                    >
                      Selected Months
                    </button>
                  </div>
                </div>

                {attendanceRangeMode === "selected" ? (
                  <div className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Months</span>
                    <div className="relative">
                      <button
                        className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-800 transition hover:border-slate-300 hover:bg-white"
                        onClick={() => setIsMonthDropdownOpen((current) => !current)}
                        type="button"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">
                            {selectedMonths.length > 0
                              ? `${selectedMonths.length} months selected`
                              : "Select months"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Choose one month, multiple months, or switch back to all months.
                          </p>
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 shrink-0 text-slate-500 transition ${
                            isMonthDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isMonthDropdownOpen ? (
                        <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
                          <div className="mb-3 flex flex-wrap gap-2">
                            <button
                              className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                              onClick={() => setSelectedMonths(availableMonths)}
                              type="button"
                            >
                              Select all
                            </button>
                            <button
                              className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                              onClick={() => setSelectedMonths([])}
                              type="button"
                            >
                              Clear
                            </button>
                          </div>

                          <div className="grid gap-2 sm:grid-cols-2">
                            {availableMonths.map((month) => {
                              const isSelected = selectedMonths.includes(month);

                              return (
                                <button
                                  className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left transition ${
                                    isSelected
                                      ? "border-indigo-200 bg-indigo-50"
                                      : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
                                  }`}
                                  key={month}
                                  onClick={() => toggleMonthSelection(month)}
                                  type="button"
                                >
                                  <span
                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                                      isSelected
                                        ? "border-indigo-500 bg-indigo-500 text-white"
                                        : "border-slate-300 bg-white text-transparent"
                                    }`}
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                  </span>
                                  <span className="text-sm font-semibold text-slate-900">
                                    {monthToDateRangeLabel(month)}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {selectedMonths.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedMonths.map((month) => (
                          <span
                            className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700"
                            key={month}
                          >
                            {monthToDateRangeLabel(month)}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                {mode === "exam" ? (
                  <ScrollText className="mt-0.5 h-5 w-5 text-indigo-600" />
                ) : (
                  <CalendarCheck className="mt-0.5 h-5 w-5 text-emerald-600" />
                )}
                <div>
                  <p className="font-semibold text-slate-950">
                    {mode === "exam" ? "Exam report export" : "Attendance report export"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {mode === "exam"
                      ? `This file includes ${
                          selectedExam === "all"
                            ? "all exams"
                            : examMeta[selectedExam]?.displayName ?? selectedExam
                        } for the selected class.`
                      : `This file includes ${
                          attendanceRangeMode === "selected" && selectedMonths.length > 0
                            ? selectedMonths.join(", ")
                            : "all months"
                        } for the selected class.`}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-500 sm:w-auto"
                onClick={() => {
                  if (!selectedClass) {
                    return;
                  }

                  if (mode === "exam") {
                    downloadClassExamReport(selectedClass, selectedExam);
                    return;
                  }

                  downloadClassAttendanceReport(
                    selectedClass,
                    attendanceRangeMode === "selected" ? selectedMonths : [],
                  );
                }}
                type="button"
              >
                <Download className="h-4 w-4" />
                Export Excel
              </button>
            </div>
          </article>

          <aside className="space-y-5">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-emerald-600" />
                <div>
                  <h2 className="text-base font-semibold text-slate-950">
                    Report Preview
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Quick summary of what will be included in the export.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Selected Class
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {selectedClass?.className} - Section {selectedClass?.section}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">{selectedClass?.room}</p>
                </div>

                {mode === "exam" ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Exam Entries
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-slate-900">
                        {selectedExam === "all" ? totalExamEntries : selectedExamEntries}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Exam Selected
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {selectedExam === "all"
                          ? "All Exams"
                          : examMeta[selectedExam]?.displayName ?? selectedExam}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Average Attendance
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-slate-900">
                        {filteredAverageAttendance}%
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Months Included
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-slate-900">
                        {monthsIncludedCount}
                      </p>
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700">
                    Export fields
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    {mode === "exam"
                      ? "Student name, admission number, roll number, exam name, exam date, subject, marks, and grade."
                      : "Student name, admission number, roll number, selected monthly attendance totals, and overall attendance percentage."}
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
