import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  GraduationCap,
  IdCard,
  Mail,
  MapPin,
  Phone,
  Search,
  UsersRound,
} from "lucide-react";

type Teacher = {
  id: string;
  name: string;
  subject: string;
  qualification: string;
  classesTaught: string[];
  experience: string;
  phone: string;
  email: string;
  address: string;
  joiningDate: string;
  department: string;
  employeeId: string;
  dob: string;
  bloodGroup: string;
  image: string;
  about: string;
};

const makeAvatar = (name: string, start: string, end: string) => {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="${start}" />
          <stop offset="1" stop-color="${end}" />
        </linearGradient>
      </defs>
      <rect width="160" height="160" rx="28" fill="url(#g)" />
      <circle cx="80" cy="66" r="30" fill="rgba(255,255,255,.82)" />
      <path d="M30 144c8-31 26-47 50-47s42 16 50 47" fill="rgba(255,255,255,.82)" />
      <text x="80" y="90" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" font-weight="700" fill="${start}">${initials}</text>
    </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const teachers: Teacher[] = [
  {
    id: "tch-1024",
    name: "Ananya Sharma",
    subject: "Mathematics",
    qualification: "M.Sc Mathematics, B.Ed",
    classesTaught: ["Class 9-A", "Class 10-A", "Class 10-B"],
    experience: "8 years",
    phone: "+91 98765 43210",
    email: "ananya.sharma@slashstack.school",
    address: "Kakkanad, Kochi",
    joiningDate: "12 Jun 2018",
    department: "Science and Mathematics",
    employeeId: "EMP-1024",
    dob: "18 Aug 1990",
    bloodGroup: "B+",
    image: makeAvatar("Ananya Sharma", "#4f46e5", "#14b8a6"),
    about: "Leads board exam mathematics coaching and mentors students for inter-school aptitude competitions.",
  },
  {
    id: "tch-1086",
    name: "Rahul Menon",
    subject: "Physics",
    qualification: "M.Sc Physics, NET",
    classesTaught: ["Class 11-A", "Class 12-A", "Class 12-B"],
    experience: "11 years",
    phone: "+91 99887 76655",
    email: "rahul.menon@slashstack.school",
    address: "Edappally, Kochi",
    joiningDate: "04 May 2016",
    department: "Science",
    employeeId: "EMP-1086",
    dob: "02 Feb 1987",
    bloodGroup: "O+",
    image: makeAvatar("Rahul Menon", "#0f766e", "#f59e0b"),
    about: "Coordinates senior secondary physics labs, practical records, and entrance foundation classes.",
  },
  {
    id: "tch-1132",
    name: "Meera Nair",
    subject: "English",
    qualification: "M.A English Literature, B.Ed",
    classesTaught: ["Class 7-C", "Class 8-A", "Class 9-B"],
    experience: "6 years",
    phone: "+91 91234 56780",
    email: "meera.nair@slashstack.school",
    address: "Vyttila, Kochi",
    joiningDate: "21 Jul 2020",
    department: "Languages",
    employeeId: "EMP-1132",
    dob: "25 Nov 1992",
    bloodGroup: "A+",
    image: makeAvatar("Meera Nair", "#7c3aed", "#06b6d4"),
    about: "Handles literature clubs, public speaking activities, and remedial language sessions.",
  },
  {
    id: "tch-1198",
    name: "Sanjay Kumar",
    subject: "Computer Science",
    qualification: "M.Tech Computer Science",
    classesTaught: ["Class 10-C", "Class 11-B", "Class 12-C"],
    experience: "9 years",
    phone: "+91 90123 44556",
    email: "sanjay.kumar@slashstack.school",
    address: "Palarivattom, Kochi",
    joiningDate: "09 Jan 2019",
    department: "Computer Science",
    employeeId: "EMP-1198",
    dob: "11 Mar 1989",
    bloodGroup: "AB+",
    image: makeAvatar("Sanjay Kumar", "#2563eb", "#22c55e"),
    about: "Manages coding club, computer lab planning, and project-based learning for higher secondary students.",
  },
  {
    id: "tch-1217",
    name: "Fathima Basheer",
    subject: "Biology",
    qualification: "M.Sc Botany, B.Ed",
    classesTaught: ["Class 8-B", "Class 9-A", "Class 10-C"],
    experience: "7 years",
    phone: "+91 93456 78901",
    email: "fathima.basheer@slashstack.school",
    address: "Aluva, Kochi",
    joiningDate: "15 Nov 2019",
    department: "Science",
    employeeId: "EMP-1217",
    dob: "07 Sep 1991",
    bloodGroup: "O-",
    image: makeAvatar("Fathima Basheer", "#16a34a", "#0ea5e9"),
    about: "Runs biology practical sessions and supports environmental awareness activities on campus.",
  },
  {
    id: "tch-1242",
    name: "Joseph Mathew",
    subject: "Social Science",
    qualification: "M.A History, B.Ed",
    classesTaught: ["Class 6-A", "Class 7-A", "Class 8-C"],
    experience: "12 years",
    phone: "+91 95678 12340",
    email: "joseph.mathew@slashstack.school",
    address: "Fort Kochi",
    joiningDate: "01 Jun 2014",
    department: "Humanities",
    employeeId: "EMP-1242",
    dob: "30 Dec 1984",
    bloodGroup: "A-",
    image: makeAvatar("Joseph Mathew", "#b45309", "#4f46e5"),
    about: "Guides social science projects, heritage walks, and model parliament activities.",
  },
];

export const Teachers = () => {
  const [query, setQuery] = useState("");

  const filteredTeachers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return teachers;
    }

    return teachers.filter((teacher) =>
      [teacher.name, teacher.subject, teacher.employeeId, teacher.id]
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
            <p className="text-sm font-medium text-slate-500">Faculty Management</p>
            <h1 className="mt-1 text-2xl font-semibold">Teachers</h1>
          </div>

          <label className="flex h-12 w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-500 shadow-sm">
            <Search className="h-5 w-5" />
            <input
              className="w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, subject, ID number"
              type="search"
              value={query}
            />
          </label>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredTeachers.map((teacher) => (
            <Link
              className="group rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
              key={teacher.id}
              to={`/teachers/${teacher.id}`}
            >
              <div className="flex items-center gap-4">
                <img
                  alt={teacher.name}
                  className="h-20 w-20 shrink-0 rounded-full border-2 border-white object-cover shadow-md ring-1 ring-slate-200"
                  src={teacher.image}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-semibold text-emerald-700">{teacher.name}</p>
                  <p className="mt-0.5 text-sm font-medium text-emerald-600">{teacher.subject} Teacher</p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex h-7 items-center gap-1.5 rounded-md bg-slate-100 px-2 text-xs font-semibold text-slate-700">
                      <IdCard className="h-3.5 w-3.5" />
                      {teacher.employeeId}
                    </span>
                    <span className="inline-flex h-7 items-center rounded-md bg-blue-50 px-2 text-xs font-semibold text-blue-700">
                      {teacher.qualification.split(",")[0]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                {teacher.classesTaught.slice(0, 2).map((className) => (
                  <span className="rounded bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600" key={className}>
                    {className}
                  </span>
                ))}
                {teacher.classesTaught.length > 2 ? (
                  <span className="rounded bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-500">
                    +{teacher.classesTaught.length - 2} more
                  </span>
                ) : null}
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
};

export const TeacherDetails = () => {
  const { teacherId } = useParams();
  const teacher = teachers.find((item) => item.id === teacherId);

  if (!teacher) {
    return <Navigate replace to="/teachers" />;
  }

  const detailRows = [
    { label: "Employee ID", value: teacher.employeeId },
    { label: "Department", value: teacher.department },
    { label: "Qualification", value: teacher.qualification },
    { label: "Experience", value: teacher.experience },
    { label: "Joining Date", value: teacher.joiningDate },
    { label: "Date of Birth", value: teacher.dob },
    { label: "Blood Group", value: teacher.bloodGroup },
    { label: "Address", value: teacher.address },
  ];

  return (
    <main className="min-h-full bg-[#f6f8fb] p-6 text-slate-950">
      <div className="mx-auto max-w-7xl space-y-5">
        <Link className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950" to="/teachers">
          <ArrowLeft className="h-4 w-4" />
          Back to teachers
        </Link>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            <img alt={teacher.name} className="h-36 w-36 rounded-lg object-cover" src={teacher.image} />
            <div className="flex-1">
              <p className="text-sm font-semibold text-indigo-600">{teacher.subject}</p>
              <h1 className="mt-1 text-3xl font-semibold">{teacher.name}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">{teacher.about}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {teacher.classesTaught.map((className) => (
                  <span className="rounded bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700" key={className}>
                    {className}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-indigo-600" />
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
                <Phone className="h-5 w-5 text-teal-600" />
                <h2 className="text-base font-semibold">Contact</h2>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-slate-400" />
                  <span className="text-slate-700">{teacher.email}</span>
                </div>
                <div className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 text-slate-400" />
                  <span className="text-slate-700">{teacher.phone}</span>
                </div>
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                  <span className="text-slate-700">{teacher.address}</span>
                </div>
              </div>
            </article>

            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-amber-600" />
                <h2 className="text-base font-semibold">Classes Handled</h2>
              </div>
              <div className="space-y-3">
                {teacher.classesTaught.map((className) => (
                  <div className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 px-4 py-3" key={className}>
                    <span className="text-sm font-semibold text-slate-800">{className}</span>
                    <UsersRound className="h-4 w-4 text-slate-400" />
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
