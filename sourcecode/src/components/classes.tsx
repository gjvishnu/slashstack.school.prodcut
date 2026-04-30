import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  CalendarCheck,
  CalendarDays,
  Download,
  GraduationCap,
  IdCard,
  Mail,
  MapPin,
  Phone,
  Search,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";

export type Student = {
  id: string;
  admissionNo: string;
  name: string;
  rollNo: string;
  gender: string;
  dob: string;
  bloodGroup: string;
  guardian: string;
  guardianPhone: string;
  email: string;
  address: string;
  attendance: { month: string; present: number; total: number }[];
  marks: { exam: string; subject: string; marks: number; grade: string }[];
};

export type ClassRoom = {
  id: string;
  className: string;
  section: string;
  totalStudents: number;
  classTeacher: string;
  room: string;
  students: Student[];
};

type ExamReport = {
  name: string;
  displayName: string;
  date: string;
  subjects: Student["marks"];
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  grade: string;
};

export const classRooms: ClassRoom[] = [
  {
    id: "class-10-a",
    className: "Class 10",
    section: "A",
    totalStudents: 42,
    classTeacher: "Ananya Sharma",
    room: "Room 204",
    students: [
      {
        id: "std-1001",
        admissionNo: "ADM-1001",
        name: "Arjun Nair",
        rollNo: "01",
        gender: "Male",
        dob: "14 Sep 2010",
        bloodGroup: "O+",
        guardian: "Suresh Nair",
        guardianPhone: "+91 98765 11001",
        email: "arjun.nair@student.school",
        address: "Kakkanad, Kochi",
        attendance: [
          { month: "January", present: 21, total: 23 },
          { month: "February", present: 20, total: 22 },
          { month: "March", present: 22, total: 24 },
        ],
        marks: [
          { exam: "Unit Test 1", subject: "Mathematics", marks: 88, grade: "A" },
          { exam: "Unit Test 1", subject: "Science", marks: 82, grade: "A" },
          { exam: "Mid Term", subject: "English", marks: 76, grade: "B+" },
        ],
      },
      {
        id: "std-1002",
        admissionNo: "ADM-1002",
        name: "Diya Thomas",
        rollNo: "02",
        gender: "Female",
        dob: "22 Jan 2011",
        bloodGroup: "B+",
        guardian: "Linda Thomas",
        guardianPhone: "+91 98765 11002",
        email: "diya.thomas@student.school",
        address: "Vyttila, Kochi",
        attendance: [
          { month: "January", present: 22, total: 23 },
          { month: "February", present: 22, total: 22 },
          { month: "March", present: 23, total: 24 },
        ],
        marks: [
          { exam: "Unit Test 1", subject: "Mathematics", marks: 94, grade: "A+" },
          { exam: "Unit Test 1", subject: "Science", marks: 91, grade: "A+" },
          { exam: "Mid Term", subject: "English", marks: 87, grade: "A" },
        ],
      },
      {
        id: "std-1003",
        admissionNo: "ADM-1003",
        name: "Irfan Ali",
        rollNo: "03",
        gender: "Male",
        dob: "09 May 2010",
        bloodGroup: "A+",
        guardian: "Basheer Ali",
        guardianPhone: "+91 98765 11003",
        email: "irfan.ali@student.school",
        address: "Aluva, Kochi",
        attendance: [
          { month: "January", present: 19, total: 23 },
          { month: "February", present: 21, total: 22 },
          { month: "March", present: 20, total: 24 },
        ],
        marks: [
          { exam: "Unit Test 1", subject: "Mathematics", marks: 79, grade: "B+" },
          { exam: "Unit Test 1", subject: "Science", marks: 84, grade: "A" },
          { exam: "Mid Term", subject: "English", marks: 73, grade: "B" },
        ],
      },
    ],
  },
  {
    id: "class-9-b",
    className: "Class 9",
    section: "B",
    totalStudents: 39,
    classTeacher: "Meera Nair",
    room: "Room 108",
    students: [
      {
        id: "std-0901",
        admissionNo: "ADM-0901",
        name: "Neha Krishnan",
        rollNo: "01",
        gender: "Female",
        dob: "18 Jul 2011",
        bloodGroup: "AB+",
        guardian: "Kiran Krishnan",
        guardianPhone: "+91 98765 12001",
        email: "neha.krishnan@student.school",
        address: "Edappally, Kochi",
        attendance: [
          { month: "January", present: 20, total: 23 },
          { month: "February", present: 19, total: 22 },
          { month: "March", present: 22, total: 24 },
        ],
        marks: [
          { exam: "Unit Test 1", subject: "English", marks: 89, grade: "A" },
          { exam: "Unit Test 1", subject: "Social Science", marks: 86, grade: "A" },
          { exam: "Mid Term", subject: "Mathematics", marks: 81, grade: "A" },
        ],
      },
      {
        id: "std-0902",
        admissionNo: "ADM-0902",
        name: "Rohan Das",
        rollNo: "02",
        gender: "Male",
        dob: "02 Mar 2012",
        bloodGroup: "O-",
        guardian: "Maya Das",
        guardianPhone: "+91 98765 12002",
        email: "rohan.das@student.school",
        address: "Palarivattom, Kochi",
        attendance: [
          { month: "January", present: 21, total: 23 },
          { month: "February", present: 18, total: 22 },
          { month: "March", present: 23, total: 24 },
        ],
        marks: [
          { exam: "Unit Test 1", subject: "English", marks: 78, grade: "B+" },
          { exam: "Unit Test 1", subject: "Social Science", marks: 82, grade: "A" },
          { exam: "Mid Term", subject: "Mathematics", marks: 75, grade: "B+" },
        ],
      },
    ],
  },
  {
    id: "class-8-c",
    className: "Class 8",
    section: "C",
    totalStudents: 36,
    classTeacher: "Joseph Mathew",
    room: "Room 302",
    students: [
      {
        id: "std-0801",
        admissionNo: "ADM-0801",
        name: "Sara George",
        rollNo: "01",
        gender: "Female",
        dob: "29 Nov 2012",
        bloodGroup: "A-",
        guardian: "George Varghese",
        guardianPhone: "+91 98765 13001",
        email: "sara.george@student.school",
        address: "Fort Kochi",
        attendance: [
          { month: "January", present: 23, total: 23 },
          { month: "February", present: 21, total: 22 },
          { month: "March", present: 24, total: 24 },
        ],
        marks: [
          { exam: "Unit Test 1", subject: "English", marks: 92, grade: "A+" },
          { exam: "Unit Test 1", subject: "Science", marks: 88, grade: "A" },
          { exam: "Mid Term", subject: "Social Science", marks: 90, grade: "A+" },
        ],
      },
      {
        id: "std-0802",
        admissionNo: "ADM-0802",
        name: "Vivek Raj",
        rollNo: "02",
        gender: "Male",
        dob: "13 Apr 2013",
        bloodGroup: "B-",
        guardian: "Raj Mohan",
        guardianPhone: "+91 98765 13002",
        email: "vivek.raj@student.school",
        address: "Kalamassery, Kochi",
        attendance: [
          { month: "January", present: 20, total: 23 },
          { month: "February", present: 20, total: 22 },
          { month: "March", present: 21, total: 24 },
        ],
        marks: [
          { exam: "Unit Test 1", subject: "English", marks: 74, grade: "B" },
          { exam: "Unit Test 1", subject: "Science", marks: 79, grade: "B+" },
          { exam: "Mid Term", subject: "Social Science", marks: 77, grade: "B+" },
        ],
      },
    ],
  },
];

export const findClassRoom = (classId?: string) =>
  classRooms.find((classRoom) => classRoom.id === classId);

export const findStudent = (classId?: string, studentId?: string) => {
  const classRoom = findClassRoom(classId);
  const student = classRoom?.students.find((item) => item.id === studentId);

  return { classRoom, student };
};

const academicYear = {
  label: "Academic Year 2026 - 2027",
  start: "2026-04-01",
  end: "2027-03-31",
};

const absentDatesByStudent: Record<string, string[]> = {
  "std-1001": ["2026-04-08", "2026-04-22", "2026-05-06", "2026-07-14"],
  "std-1002": ["2026-04-16", "2026-06-11"],
  "std-1003": ["2026-04-05", "2026-04-19", "2026-05-13", "2026-08-21"],
  "std-0901": ["2026-04-10", "2026-04-18", "2026-05-02", "2026-06-20"],
  "std-0902": ["2026-04-07", "2026-04-23", "2026-05-15"],
  "std-0801": ["2026-04-12", "2026-07-03"],
  "std-0802": ["2026-04-09", "2026-04-24", "2026-05-08", "2026-06-18"],
};

const formatAttendanceDate = (date: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    weekday: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));

const getMonthKey = (date: string) => date.slice(0, 7);

const formatMonthLabel = (date: string) =>
  new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));

const toIsoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getSchoolDaysForMonth = (selectedDate: string) => {
  const date = new Date(`${selectedDate}T00:00:00`);
  const month = date.getMonth();
  const year = date.getFullYear();
  const days: string[] = [];
  const cursor = new Date(year, month, 1);

  while (cursor.getMonth() === month) {
    const day = cursor.getDay();
    const isoDate = toIsoDate(cursor);
    const isAcademicDate = isoDate >= academicYear.start && isoDate <= academicYear.end;

    if (isAcademicDate && day !== 0) {
      days.push(isoDate);
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
};

const downloadExcelReport = (
  student: Student,
  classRoom: ClassRoom,
  selectedDate: string,
  rows: { date: string; status: string }[],
) => {
  const monthLabel = formatMonthLabel(selectedDate);
  const tableRows = rows
    .map(
      (row) => `
        <tr>
          <td>${formatAttendanceDate(row.date)}</td>
          <td>${row.status}</td>
        </tr>
      `,
    )
    .join("");
  const worksheet = `
    <html>
      <head>
        <meta charset="UTF-8" />
      </head>
      <body>
        <h2>${student.name} Attendance Report</h2>
        <p>Admission No: ${student.admissionNo}</p>
        <p>Class: ${classRoom.className} - ${classRoom.section}</p>
        <p>Month: ${monthLabel}</p>
        <table border="1">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
      </body>
    </html>
  `;
  const blob = new Blob([worksheet], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${student.admissionNo}-${getMonthKey(selectedDate)}-attendance.xls`;
  link.click();
  URL.revokeObjectURL(url);
};

const examMeta: Record<string, { displayName: string; date: string }> = {
  "Unit Test 1": { displayName: "Monthly Exam", date: "2026-04-18" },
  "Mid Term": { displayName: "Mid-Term Exam", date: "2026-06-24" },
  "Quarterly Exam": { displayName: "Quarterly Exam", date: "2026-08-12" },
};

const getGradeFromPercentage = (percentage: number) => {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  return "C";
};

const getExamReports = (marks: Student["marks"]) => {
  const reports = marks.reduce<Record<string, Student["marks"]>>((acc, mark) => {
    acc[mark.exam] = [...(acc[mark.exam] ?? []), mark];
    return acc;
  }, {});

  return Object.entries(reports).map<ExamReport>(([name, subjects]) => {
    const totalMarks = subjects.reduce((total, subject) => total + subject.marks, 0);
    const maxMarks = subjects.length * 100;
    const percentage = Math.round((totalMarks / maxMarks) * 100);
    const meta = examMeta[name] ?? { displayName: name, date: "2026-04-01" };

    return {
      name,
      displayName: meta.displayName,
      date: meta.date,
      subjects,
      totalMarks,
      maxMarks,
      percentage,
      grade: getGradeFromPercentage(percentage),
    };
  });
};

const downloadExamReport = (
  student: Student,
  classRoom: ClassRoom,
  exam: ExamReport,
) => {
  const subjectRows = exam.subjects
    .map(
      (subject) => `
        <tr>
          <td>${subject.subject}</td>
          <td>${subject.marks}</td>
          <td>100</td>
          <td>${subject.grade}</td>
        </tr>
      `,
    )
    .join("");
  const worksheet = `
    <html>
      <head>
        <meta charset="UTF-8" />
      </head>
      <body>
        <h2>${student.name} - ${exam.displayName}</h2>
        <p>Admission No: ${student.admissionNo}</p>
        <p>Class: ${classRoom.className} - ${classRoom.section}</p>
        <p>Exam Date: ${formatAttendanceDate(exam.date)}</p>
        <p>Overall Percentage: ${exam.percentage}%</p>
        <p>Grade: ${exam.grade}</p>
        <table border="1">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Marks</th>
              <th>Max Marks</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>${subjectRows}</tbody>
        </table>
      </body>
    </html>
  `;
  const blob = new Blob([worksheet], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${student.admissionNo}-${exam.displayName.replaceAll(" ", "-")}.xls`;
  link.click();
  URL.revokeObjectURL(url);
};

export const Classes = () => {
  const [query, setQuery] = useState("");

  const filteredClasses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return classRooms;
    }

    return classRooms.filter((classRoom) =>
      [
        classRoom.className,
        classRoom.section,
        classRoom.classTeacher,
        classRoom.room,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query]);

  return (
    <main className="min-h-full bg-[#f6f8fb] p-6 text-slate-950">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Class Management</p>
            <h1 className="mt-1 text-2xl font-semibold">Classes</h1>
          </div>

          <label className="flex h-12 w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-500 shadow-sm">
            <Search className="h-5 w-5" />
            <input
              className="w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by class, section, teacher"
              type="search"
              value={query}
            />
          </label>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredClasses.map((classRoom) => (
            <Link
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
              key={classRoom.id}
              to={`/classes/${classRoom.id}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  {classRoom.room}
                </span>
              </div>

              <div className="mt-5">
                <p className="text-2xl font-semibold">{classRoom.className}</p>
                <p className="mt-1 text-sm font-medium text-indigo-600">Section {classRoom.section}</p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-md bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Students</p>
                  <p className="mt-1 text-lg font-semibold">{classRoom.totalStudents}</p>
                </div>
                <div className="rounded-md bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Class Teacher</p>
                  <p className="mt-1 truncate text-sm font-semibold">{classRoom.classTeacher}</p>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
};

export const ClassStudents = () => {
  const { classId } = useParams();
  const [query, setQuery] = useState("");
  const classRoom = findClassRoom(classId);

  const filteredStudents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!classRoom || !normalizedQuery) {
      return classRoom?.students ?? [];
    }

    return classRoom.students.filter((student) =>
      [student.name, student.admissionNo, student.rollNo, student.guardian]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [classRoom, query]);

  if (!classRoom) {
    return <Navigate replace to="/classes" />;
  }

  return (
    <main className="min-h-full bg-[#f6f8fb] p-6 text-slate-950">
      <div className="mx-auto max-w-7xl space-y-5">
        <Link className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950" to="/classes">
          <ArrowLeft className="h-4 w-4" />
          Back to classes
        </Link>

        <header className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500">{classRoom.classTeacher}</p>
              <h1 className="mt-1 text-2xl font-semibold">
                {classRoom.className} - Section {classRoom.section}
              </h1>
            </div>
            <span className="rounded bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-600">
              {classRoom.totalStudents} students
            </span>
          </div>

          <label className="flex h-12 w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-500 shadow-sm">
            <Search className="h-5 w-5" />
            <input
              className="w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by student name, admission number, roll number"
              type="search"
              value={query}
            />
          </label>
        </header>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-[5rem_1fr_9rem_12rem_8rem] gap-4 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <span>Roll</span>
            <span>Student</span>
            <span>Admission</span>
            <span>Guardian</span>
            <span>Attendance</span>
          </div>
          <div className="divide-y divide-slate-100">
            {filteredStudents.map((student) => {
              const latestAttendance = student.attendance.at(-1);
              const percent = latestAttendance
                ? Math.round((latestAttendance.present / latestAttendance.total) * 100)
                : 0;

              return (
                <Link
                  className="grid grid-cols-[5rem_1fr_9rem_12rem_8rem] gap-4 px-5 py-4 text-sm transition hover:bg-slate-50"
                  key={student.id}
                  to={`/classes/${classRoom.id}/${student.id}`}
                >
                  <span className="font-semibold text-slate-500">{student.rollNo}</span>
                  <span className="font-semibold text-slate-950">{student.name}</span>
                  <span className="text-slate-600">{student.admissionNo}</span>
                  <span className="truncate text-slate-600">{student.guardian}</span>
                  <span className="font-semibold text-emerald-600">{percent}%</span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
};

export const StudentDetails = () => {
  const { classId, studentId } = useParams();
  const { classRoom, student } = findStudent(classId, studentId);
  const [selectedDate, setSelectedDate] = useState("2026-04-29");
  const [selectedExamName, setSelectedExamName] = useState("Unit Test 1");
  const [openExamName, setOpenExamName] = useState<string | null>(null);

  if (!classRoom || !student) {
    return <Navigate replace to="/classes" />;
  }

  const absentDates = absentDatesByStudent[student.id] ?? [];
  const selectedDateStatus = absentDates.includes(selectedDate)
    ? "Absent"
    : "Present";
  const selectedMonthLabel = formatMonthLabel(selectedDate);
  const monthSchoolDays = getSchoolDaysForMonth(selectedDate);
  const monthlyAttendanceRows = monthSchoolDays.map((date) => ({
    date,
    status: absentDates.includes(date) ? "Absent" : "Present",
  }));
  const monthlyAbsentDates = monthlyAttendanceRows
    .filter((row) => row.status === "Absent")
    .map((row) => row.date);
  const monthlyAbsent = monthlyAbsentDates.length;
  const monthlyTotal = monthlyAttendanceRows.length;
  const monthlyPresent = monthlyTotal - monthlyAbsent;
  const monthlyPresentPercent = monthlyTotal
    ? Math.round((monthlyPresent / monthlyTotal) * 100)
    : 0;
  const previousThreeMonthAttendance = student.attendance.slice(-3);
  const examReports = getExamReports(student.marks);
  const selectedExam =
    examReports.find((exam) => exam.name === selectedExamName) ?? examReports[0];
  const openExam =
    examReports.find((exam) => exam.name === openExamName) ?? null;

  const detailRows = [
    { label: "Admission No", value: student.admissionNo },
    { label: "Roll No", value: student.rollNo },
    { label: "Class", value: `${classRoom.className} - ${classRoom.section}` },
    { label: "Class Teacher", value: classRoom.classTeacher },
    { label: "Gender", value: student.gender },
    { label: "Date of Birth", value: student.dob },
    { label: "Blood Group", value: student.bloodGroup },
    { label: "Address", value: student.address },
  ];

  return (
    <main className="min-h-full bg-[#f6f8fb] p-6 text-slate-950">
      <div className="mx-auto max-w-7xl space-y-5">
        <Link className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950" to={`/classes/${classRoom.id}`}>
          <ArrowLeft className="h-4 w-4" />
          Back to student list
        </Link>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-indigo-50 text-3xl font-semibold text-indigo-600">
              {student.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-indigo-600">{student.admissionNo}</p>
              <h1 className="mt-1 text-3xl font-semibold">{student.name}</h1>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
                  {classRoom.className} - Section {classRoom.section}
                </span>
                <span className="rounded bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
                  Roll No {student.rollNo}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <IdCard className="h-5 w-5 text-indigo-600" />
              <h2 className="text-base font-semibold">General Details</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {detailRows.map((row) => (
                <div className="rounded-md border border-slate-100 bg-slate-50 p-4" key={row.label}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{row.label}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{row.value}</p>
                </div>
              ))}
            </div>
          </article>

          <aside className="space-y-5">
            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <UserRound className="h-5 w-5 text-teal-600" />
                <h2 className="text-base font-semibold">Guardian Contact</h2>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <UsersRound className="mt-0.5 h-4 w-4 text-slate-400" />
                  <span className="text-slate-700">{student.guardian}</span>
                </div>
                <div className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 text-slate-400" />
                  <span className="text-slate-700">{student.guardianPhone}</span>
                </div>
                <div className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-slate-400" />
                  <span className="text-slate-700">{student.email}</span>
                </div>
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                  <span className="text-slate-700">{student.address}</span>
                </div>
              </div>
            </article>
          </aside>
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-emerald-600" />
                <div>
                  <h2 className="text-base font-semibold">Attendance</h2>
                  <p className="mt-1 text-xs text-slate-500">{academicYear.label}</p>
                </div>
              </div>

              <label className="flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm">
                <CalendarDays className="h-4 w-4 text-slate-500" />
                <input
                  className="bg-transparent text-sm outline-none"
                  max={academicYear.end}
                  min={academicYear.start}
                  onChange={(event) => setSelectedDate(event.target.value)}
                  type="date"
                  value={selectedDate}
                />
              </label>
            </div>

            <div className="mb-4 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
              <div
                className={`rounded-lg border p-4 ${
                  selectedDateStatus === "Absent"
                    ? "border-rose-100 bg-rose-50"
                    : "border-emerald-100 bg-emerald-50"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Selected Date
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-800">
                    {formatAttendanceDate(selectedDate)}
                  </p>
                  <span
                    className={`rounded px-3 py-1 text-sm font-semibold ${
                      selectedDateStatus === "Absent"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {selectedDateStatus}
                  </span>
                </div>
              </div>

              <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {selectedMonthLabel}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      Monthly attendance report
                    </p>
                  </div>
                  <button
                    className="inline-flex h-9 items-center gap-2 rounded-md bg-slate-950 px-3 text-xs font-semibold text-white transition hover:bg-slate-800"
                    onClick={() =>
                      downloadExcelReport(
                        student,
                        classRoom,
                        selectedDate,
                        monthlyAttendanceRows,
                      )
                    }
                    type="button"
                  >
                    <Download className="h-4 w-4" />
                    Excel
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                  Present
                </p>
                <p className="mt-2 text-3xl font-semibold text-emerald-700">
                  {monthlyPresent}
                </p>
                <p className="mt-1 text-xs text-emerald-700">
                  of {monthlyTotal} school days
                </p>
              </div>
              <div className="rounded-lg border border-rose-100 bg-rose-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">
                  Absent
                </p>
                <p className="mt-2 text-3xl font-semibold text-rose-700">
                  {monthlyAbsent}
                </p>
                <p className="mt-1 text-xs text-rose-700">
                  in {selectedMonthLabel}
                </p>
              </div>
              <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                  Percentage
                </p>
                <p className="mt-2 text-3xl font-semibold text-indigo-700">
                  {monthlyPresentPercent}%
                </p>
                <p className="mt-1 text-xs text-indigo-700">
                  monthly presence
                </p>
              </div>
            </div>

             
            <div className="mt-4 space-y-3">
              {student.attendance
                .filter((record) => record.month === selectedMonthLabel.split(" ")[0])
                .map((record) => {
                  const percent = Math.round((record.present / record.total) * 100);

                  return (
                    <div className="rounded-md border border-slate-100 bg-slate-50 p-4" key={record.month}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-semibold text-slate-800">{record.month}</span>
                        <span className="font-semibold text-emerald-600">{percent}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${percent}%` }} />
                      </div>
                      <p className="mt-2 text-xs text-slate-500">
                        Present {record.present} of {record.total} days
                      </p>
                    </div>
                  );
                })}
            </div>

            <div className="mt-4 rounded-lg border border-rose-100 bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-950">
                  Absent Days in {selectedMonthLabel}
                </p>
                <span className="rounded bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-600">
                  {monthlyAbsent} days
                </span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {monthlyAbsentDates.map((date) => (
                  <button
                    className={`rounded-md border px-3 py-2 text-left text-sm font-semibold transition ${
                      selectedDate === date
                        ? "border-rose-300 bg-rose-50 text-rose-700"
                        : "border-slate-100 bg-slate-50 text-slate-700 hover:border-rose-200"
                    }`}
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    type="button"
                  >
                    {formatAttendanceDate(date)}
                  </button>
                ))}
                {monthlyAbsentDates.length === 0 ? (
                  <div className="rounded-md border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                    No absent days in this month
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-slate-100 bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    Previous 3 Months
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Compact attendance progress
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {previousThreeMonthAttendance.map((record) => {
                  const percent = Math.round((record.present / record.total) * 100);

                  return (
                    <div key={record.month}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="font-semibold text-slate-700">{record.month}</span>
                        <span className="text-xs font-semibold text-slate-500">
                          {percent}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-indigo-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-600" />
                  <div>
                    <h2 className="text-base font-semibold">Previous Exam Marks</h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Select an exam and open details for subject marks
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none"
                    onChange={(event) => setSelectedExamName(event.target.value)}
                    value={selectedExam?.name}
                  >
                    {examReports.map((exam) => (
                      <option key={exam.name} value={exam.name}>
                        {exam.displayName}
                      </option>
                    ))}
                  </select>
                  {selectedExam ? (
                    <button
                      className="inline-flex h-9 items-center gap-2 rounded-md bg-slate-950 px-3 text-xs font-semibold text-white transition hover:bg-slate-800"
                      onClick={() => downloadExamReport(student, classRoom, selectedExam)}
                      type="button"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="space-y-3 p-5">
              {examReports.map((exam) => (
                <button
                  className={`w-full rounded-lg border p-4 text-left transition hover:border-indigo-200 hover:bg-slate-50 ${
                    selectedExam?.name === exam.name
                      ? "border-indigo-200 bg-indigo-50/40"
                      : "border-slate-100 bg-white"
                  }`}
                  key={exam.name}
                  onClick={() => {
                    setSelectedExamName(exam.name);
                    setOpenExamName(exam.name);
                  }}
                  type="button"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">
                        {exam.displayName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatAttendanceDate(exam.date)}
                      </p>
                    </div>
                    <span className="rounded bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
                      Grade {exam.grade}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-md bg-white p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Percentage
                      </p>
                      <p className="mt-1 text-xl font-semibold text-indigo-700">
                        {exam.percentage}%
                      </p>
                    </div>
                    <div className="rounded-md bg-white p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Total
                      </p>
                      <p className="mt-1 text-xl font-semibold text-slate-950">
                        {exam.totalMarks}/{exam.maxMarks}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </article>
        </section>
      </div>

      {openExam ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-indigo-600">
                  {formatAttendanceDate(openExam.date)}
                </p>
                <h2 className="mt-1 text-xl font-semibold text-slate-950">
                  {openExam.displayName}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Overall {openExam.percentage}% · Grade {openExam.grade}
                </p>
              </div>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
                onClick={() => setOpenExamName(null)}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5">
              <div className="mb-4 flex justify-end">
                <button
                  className="inline-flex h-9 items-center gap-2 rounded-md bg-slate-950 px-3 text-xs font-semibold text-white transition hover:bg-slate-800"
                  onClick={() => downloadExamReport(student, classRoom, openExam)}
                  type="button"
                >
                  <Download className="h-4 w-4" />
                  Download Excel
                </button>
              </div>

              <div className="overflow-hidden rounded-lg border border-slate-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Subject</th>
                      <th className="px-5 py-3 font-semibold">Marks</th>
                      <th className="px-5 py-3 font-semibold">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {openExam.subjects.map((subject) => (
                      <tr className="text-slate-700" key={`${openExam.name}-${subject.subject}`}>
                        <td className="px-5 py-4 font-semibold text-slate-950">
                          {subject.subject}
                        </td>
                        <td className="px-5 py-4">{subject.marks}/100</td>
                        <td className="px-5 py-4">
                          <span className="rounded bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600">
                            {subject.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
};
