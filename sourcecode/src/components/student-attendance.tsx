import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  Clock3,
  GraduationCap,
  Mail,
  X,
} from "lucide-react";
import { classRooms, findClassRoom } from "./classes";

type AttendanceStatus = "Present" | "Absent";
type AttendanceSelection = AttendanceStatus | null;

const attendanceHours = [
  "1st Hour",
  "2nd Hour",
  "3rd Hour",
  "4th Hour",
  "5th Hour",
  "6th Hour",
  "7th Hour",
  "8th Hour",
];

const formatDisplayDate = (date: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));

const getClassSubjects = (classId: string) => {
  const classRoom = findClassRoom(classId);

  if (!classRoom) {
    return [];
  }

  return Array.from(
    new Set(
      classRoom.students.flatMap((student) =>
        student.marks.map((mark) => mark.subject),
      ),
    ),
  );
};

export const StudentAttendanceClasses = () => {
  return (
    <main className="min-h-full bg-[#f6f8fb] px-4 py-5 text-slate-950 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="space-y-3">
          <div>
            <p className="text-sm font-medium text-slate-500">Operations</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
              Students Attendance
            </h1>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-base font-semibold text-slate-900">
              Select a class to start attendance
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Teachers can open a class, choose the subject and hour, then mark
              each student as present or absent.
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {classRooms.map((classRoom) => (
            <Link
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
              key={classRoom.id}
              to={`/student-attendance/${classRoom.id}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {classRoom.room}
                </span>
              </div>

              <div className="mt-6">
                <p className="text-2xl font-semibold text-slate-950">
                  {classRoom.className}
                </p>
                <p className="mt-1 text-sm font-medium text-emerald-600">
                  Section {classRoom.section}
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Students
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {classRoom.totalStudents}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Class Teacher
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {classRoom.classTeacher}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
};

export const StudentAttendanceClassDetails = () => {
  const { classId } = useParams();
  const classRoom = findClassRoom(classId);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedDate, setSelectedDate] = useState("2026-04-30");
  const [showValidation, setShowValidation] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showStudentValidation, setShowStudentValidation] = useState(false);

  const subjects = useMemo(
    () => (classId ? getClassSubjects(classId) : []),
    [classId],
  );

  const [attendanceByStudent, setAttendanceByStudent] = useState<
    Record<string, AttendanceSelection>
  >(() => {
    const initialAttendance: Record<string, AttendanceSelection> = {};

    if (classRoom) {
      classRoom.students.forEach((student) => {
        initialAttendance[student.id] = null;
      });
    }

    return initialAttendance;
  });

  if (!classRoom) {
    return <Navigate replace to="/student-attendance" />;
  }

  const selectionsComplete = Boolean(selectedSubject && selectedHour);
  const presentCount = Object.values(attendanceByStudent).filter(
    (status) => status === "Present",
  ).length;
  const absentCount = Object.values(attendanceByStudent).filter(
    (status) => status === "Absent",
  ).length;
  const unmarkedCount = classRoom.students.length - presentCount - absentCount;

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    if (!selectionsComplete) {
      setShowValidation(true);
      return;
    }

    setShowStudentValidation(false);
    setAttendanceByStudent((current) => ({
      ...current,
      [studentId]: status,
    }));
  };

  const handleSubmitAttendance = () => {
    if (!selectionsComplete) {
      setShowValidation(true);
      return;
    }

    if (unmarkedCount > 0) {
      setShowStudentValidation(true);
      return;
    }

    setShowValidation(false);
    setShowStudentValidation(false);
    setShowSuccessPopup(true);
  };

  return (
    <main className="min-h-full bg-[#f6f8fb] px-4 py-5 text-slate-950 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"
          to="/student-attendance"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to classes
        </Link>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-500">
                Attendance Register
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl">
                {classRoom.className} - Section {classRoom.section}
              </h1>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                  {classRoom.classTeacher}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600">
                  {classRoom.room}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Present
                </p>
                <p className="mt-1 text-2xl font-semibold text-emerald-700">
                  {presentCount}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Absent
                </p>
                <p className="mt-1 text-2xl font-semibold text-rose-700">
                  {absentCount}
                </p>
              </div>
              <div className="col-span-2 rounded-xl bg-amber-50 p-4 sm:col-span-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                  Not Marked
                </p>
                <p className="mt-1 text-2xl font-semibold text-amber-800">
                  {unmarkedCount}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-600" />
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                Session Details
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Select the subject and hour before marking attendance.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                Subject
              </span>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
                <BookOpen className="h-4 w-4 text-slate-500" />
                <select
                  className="h-12 w-full bg-transparent text-sm text-slate-800 outline-none"
                  onChange={(event) => {
                    setSelectedSubject(event.target.value);
                    setShowValidation(false);
                  }}
                  value={selectedSubject}
                >
                  <option value="">Select subject</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Hour</span>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
                <Clock3 className="h-4 w-4 text-slate-500" />
                <select
                  className="h-12 w-full bg-transparent text-sm text-slate-800 outline-none"
                  onChange={(event) => {
                    setSelectedHour(event.target.value);
                    setShowValidation(false);
                  }}
                  value={selectedHour}
                >
                  <option value="">Select hour</option>
                  {attendanceHours.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </select>
              </div>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Date</span>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
                <CalendarDays className="h-4 w-4 text-slate-500" />
                <input
                  className="h-12 w-full bg-transparent text-sm text-slate-800 outline-none"
                  onChange={(event) => setSelectedDate(event.target.value)}
                  type="date"
                  value={selectedDate}
                />
              </div>
            </label>
          </div>

          {showValidation ? (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
              Please select both subject and hour before marking attendance.
            </div>
          ) : null}

          {showStudentValidation ? (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              Please mark every student as present or absent before submitting attendance.
            </div>
          ) : null}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                Student Attendance List
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {selectedSubject && selectedHour
                  ? `${selectedSubject} • ${selectedHour} • ${formatDisplayDate(
                      selectedDate,
                    )}`
                  : "Choose subject and hour to enable attendance marking."}
              </p>
            </div>
            <button
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 lg:w-auto"
              onClick={handleSubmitAttendance}
              type="button"
            >
              Submit Attendance
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {classRoom.students.map((student) => {
              const status = attendanceByStudent[student.id] ?? null;
              const isPresent = status === "Present";
              const isAbsent = status === "Absent";

              return (
                <div
                  className="flex flex-col gap-4 px-4 py-4 sm:px-5 md:flex-row md:items-center md:justify-between"
                  key={student.id}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-700">
                      {student.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-950">
                        {student.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Roll No {student.rollNo}
                      </p>
                      <p className="mt-1 text-xs font-medium text-slate-400">
                        {student.admissionNo}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <span
                      className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                        isPresent
                          ? "bg-emerald-50 text-emerald-700"
                          : isAbsent
                            ? "bg-rose-50 text-rose-700"
                            : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {status ?? "Not marked"}
                    </span>
                    <button
                      className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition sm:w-auto ${
                        isPresent
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200"
                      }`}
                      onClick={() =>
                        handleStatusChange(student.id, "Present")
                      }
                      type="button"
                    >
                      <Check className="h-4 w-4" />
                      Present
                    </button>
                    <button
                      className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition sm:w-auto ${
                        isAbsent
                          ? "border-rose-200 bg-rose-50 text-rose-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-rose-200"
                      }`}
                      onClick={() => handleStatusChange(student.id, "Absent")}
                      type="button"
                    >
                      <X className="h-4 w-4" />
                      Absent
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {showSuccessPopup ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Check className="h-7 w-7" />
              </div>
              <button
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                onClick={() => setShowSuccessPopup(false)}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5">
              <h2 className="text-xl font-semibold text-slate-950">
                Attendance registered successfully
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {classRoom.className} - Section {classRoom.section} for{" "}
                {selectedSubject} during {selectedHour} on{" "}
                {formatDisplayDate(selectedDate)}.
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-emerald-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                  Present
                </p>
                <p className="mt-1 text-3xl font-semibold text-emerald-700">
                  {presentCount}
                </p>
              </div>
              <div className="rounded-2xl bg-rose-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">
                  Absent
                </p>
                <p className="mt-1 text-3xl font-semibold text-rose-700">
                  {absentCount}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-sky-100 bg-sky-50 p-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-sky-600" />
                <div>
                  <p className="font-semibold text-sky-800">
                    Mail sent to administration
                  </p>
                  <p className="mt-1 text-sm text-sky-700">
                    The attendance summary has been shared with the
                    administration office for records.
                  </p>
                </div>
              </div>
            </div>

            <button
              className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
              onClick={() => setShowSuccessPopup(false)}
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
};
