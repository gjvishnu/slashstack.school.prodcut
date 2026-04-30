import { useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock3,
  Mail,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { classRooms } from "./classes";

type ExamSubjectRow = {
  id: string;
  subjectChoice: string;
  customSubject: string;
  date: string;
  startTime: string;
  endTime: string;
};

type CreatedExamSchedule = {
  id: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
};

type CreatedExam = {
  examName: string;
  examType: string;
  classLabels: string[];
  schedules: CreatedExamSchedule[];
};

const CUSTOM_SUBJECT_VALUE = "__custom__";

const examTypes = [
  "Unit Test",
  "Mid Term",
  "Quarterly Exam",
  "Half Yearly Exam",
  "Annual Exam",
];

const initialSubjectRow = (): ExamSubjectRow => ({
  id: crypto.randomUUID(),
  subjectChoice: "",
  customSubject: "",
  date: "",
  startTime: "",
  endTime: "",
});

const getSubjectsForClasses = (classIds: string[]) => {
  const subjects = classRooms
    .filter((room) => classIds.includes(room.id))
    .flatMap((room) =>
      room.students.flatMap((student) => student.marks.map((mark) => mark.subject)),
    );

  return Array.from(new Set(subjects)).sort();
};

const getClassLabels = (classIds: string[]) =>
  classRooms
    .filter((room) => classIds.includes(room.id))
    .map((room) => `${room.className} - Section ${room.section}`);

const getResolvedSubject = (row: ExamSubjectRow) =>
  row.subjectChoice === CUSTOM_SUBJECT_VALUE
    ? row.customSubject.trim()
    : row.subjectChoice;

const formatPrettyDate = (date: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));

const formatPrettyTime = (time: string) => {
  const [hours, minutes] = time.split(":");

  if (!hours || !minutes) {
    return time;
  }

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(2026, 0, 1, Number(hours), Number(minutes)));
};

export const Exams = () => {
  const [examName, setExamName] = useState("");
  const [examType, setExamType] = useState("");
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const [subjectRows, setSubjectRows] = useState<ExamSubjectRow[]>([
    initialSubjectRow(),
  ]);
  const [showValidation, setShowValidation] = useState(false);
  const [createdExam, setCreatedExam] = useState<CreatedExam | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const availableSubjects = useMemo(
    () => getSubjectsForClasses(selectedClassIds),
    [selectedClassIds],
  );

  const selectedClasses = useMemo(
    () => classRooms.filter((room) => selectedClassIds.includes(room.id)),
    [selectedClassIds],
  );

  const selectedClassLabels = useMemo(
    () => getClassLabels(selectedClassIds),
    [selectedClassIds],
  );

  const selectedClassesSummary =
    selectedClassIds.length === 0
      ? "Select one or more classes"
      : selectedClassIds.length === 1
        ? selectedClassLabels[0]
        : `${selectedClassIds.length} classes selected`;

  const toggleClassSelection = (classId: string) => {
    setShowValidation(false);
    setSelectedClassIds((current) =>
      current.includes(classId)
        ? current.filter((item) => item !== classId)
        : [...current, classId],
    );
  };

  const updateSubjectRow = (
    rowId: string,
    field: keyof Omit<ExamSubjectRow, "id">,
    value: string,
  ) => {
    setShowValidation(false);
    setSubjectRows((currentRows) =>
      currentRows.map((row) => {
        if (row.id !== rowId) {
          return row;
        }

        if (field === "subjectChoice") {
          return {
            ...row,
            subjectChoice: value,
            customSubject: value === CUSTOM_SUBJECT_VALUE ? row.customSubject : "",
          };
        }

        return { ...row, [field]: value };
      }),
    );
  };

  const addSubjectRow = () => {
    setShowValidation(false);
    setSubjectRows((currentRows) => [...currentRows, initialSubjectRow()]);
  };

  const removeSubjectRow = (rowId: string) => {
    setShowValidation(false);
    setSubjectRows((currentRows) =>
      currentRows.length === 1
        ? currentRows
        : currentRows.filter((row) => row.id !== rowId),
    );
  };

  const handleCreateExam = () => {
    const hasInvalidSubjectRow = subjectRows.some((row) => {
      const resolvedSubject = getResolvedSubject(row);

      return (
        !resolvedSubject ||
        !row.date ||
        !row.startTime ||
        !row.endTime ||
        row.endTime <= row.startTime
      );
    });

    if (!examName || !examType || selectedClassIds.length === 0 || hasInvalidSubjectRow) {
      setShowValidation(true);
      return;
    }

    const nextCreatedExam = {
      examName,
      examType,
      classLabels: selectedClassLabels,
      schedules: subjectRows.map((row) => ({
        id: row.id,
        subject: getResolvedSubject(row),
        date: row.date,
        startTime: row.startTime,
        endTime: row.endTime,
      })),
    };

    setCreatedExam(nextCreatedExam);
    setShowValidation(false);
    setIsClassDropdownOpen(false);
    setShowSuccessPopup(true);
    setExamName("");
    setExamType("");
    setSelectedClassIds([]);
    setSubjectRows([initialSubjectRow()]);
  };

  return (
    <main className="min-h-full bg-[#f6f8fb] px-4 py-5 text-slate-950 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-5">
       

        <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-[26px] shadow-sm">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-indigo-600" />
              <div>
                <h2 className="text-base font-semibold text-slate-950">
                  Create Exam
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Build the full exam schedule in one form.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold text-slate-700">
                  Exam Name
                </span>
                <input
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:bg-white"
                  onChange={(event) => {
                    setExamName(event.target.value);
                    setShowValidation(false);
                  }}
                  placeholder="Enter exam name"
                  type="text"
                  value={examName}
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">
                  Exam Type
                </span>
                <select
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:bg-white"
                  onChange={(event) => {
                    setExamType(event.target.value);
                    setShowValidation(false);
                  }}
                  value={examType}
                >
                  <option value="">Select type</option>
                  {examTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <div className="space-y-2 md:col-span-3">
                <span className="text-sm font-semibold text-slate-700">
                  Classes
                </span>

                <div className="relative">
                  <button
                    className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-800 transition hover:border-slate-300 hover:bg-white"
                    onClick={() => setIsClassDropdownOpen((current) => !current)}
                    type="button"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">
                        {selectedClassesSummary}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        If multiple classes are selected, this exam will apply to all of them.
                      </p>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-slate-500 transition ${
                        isClassDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isClassDropdownOpen ? (
                    <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
                      <div className="mb-3 flex flex-wrap gap-2">
                        <button
                          className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                          onClick={() => {
                            setSelectedClassIds(classRooms.map((room) => room.id));
                            setShowValidation(false);
                          }}
                          type="button"
                        >
                          Select all
                        </button>
                        <button
                          className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                          onClick={() => {
                            setSelectedClassIds([]);
                            setShowValidation(false);
                          }}
                          type="button"
                        >
                          Clear
                        </button>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2">
                        {classRooms.map((classRoom) => {
                          const isSelected = selectedClassIds.includes(classRoom.id);

                          return (
                            <button
                              className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left transition ${
                                isSelected
                                  ? "border-indigo-200 bg-indigo-50"
                                  : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
                              }`}
                              key={classRoom.id}
                              onClick={() => toggleClassSelection(classRoom.id)}
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
                              <span className="min-w-0">
                                <span className="block text-sm font-semibold text-slate-900">
                                  {classRoom.className} - Section {classRoom.section}
                                </span>
                                <span className="mt-0.5 block text-[11px] text-slate-500">
                                  {classRoom.room} • {classRoom.totalStudents} students
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>

                {selectedClassLabels.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedClassLabels.map((label) => (
                      <span
                        className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700"
                        key={label}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-950">
                    Subject Schedule
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Add every subject with exam date, from time, and end time.
                  </p>
                </div>
                <button
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                  onClick={addSubjectRow}
                  type="button"
                >
                  <Plus className="h-4 w-4" />
                  Add Subject
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {subjectRows.map((row, index) => {
                  const isCustomSubject = row.subjectChoice === CUSTOM_SUBJECT_VALUE;

                  return (
                    <div
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                      key={row.id}
                    >
                      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-950">
                            Subject {index + 1}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Use an existing subject or create a new one.
                          </p>
                        </div>
                        <button
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={subjectRows.length === 1}
                          onClick={() => removeSubjectRow(row.id)}
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                        <label className="space-y-2 xl:col-span-2">
                          <span className="text-sm font-semibold text-slate-700">
                            Subject
                          </span>
                          <select
                            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:bg-white"
                            onChange={(event) =>
                              updateSubjectRow(row.id, "subjectChoice", event.target.value)
                            }
                            value={row.subjectChoice}
                          >
                            <option value="">
                              {selectedClassIds.length > 0
                                ? "Select subject"
                                : "Select classes first"}
                            </option>
                            {availableSubjects.map((subject) => (
                              <option key={subject} value={subject}>
                                {subject}
                              </option>
                            ))}
                            <option value={CUSTOM_SUBJECT_VALUE}>
                              Create new subject
                            </option>
                          </select>
                        </label>

                        {isCustomSubject ? (
                          <label className="space-y-2 xl:col-span-2">
                            <span className="text-sm font-semibold text-slate-700">
                              New Subject Name
                            </span>
                            <input
                              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:bg-white"
                              onChange={(event) =>
                                updateSubjectRow(row.id, "customSubject", event.target.value)
                              }
                              placeholder="Enter new subject"
                              type="text"
                              value={row.customSubject}
                            />
                          </label>
                        ) : null}

                        <label className="space-y-2">
                          <span className="text-sm font-semibold text-slate-700">
                            Exam Date
                          </span>
                          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
                            <CalendarDays className="h-4 w-4 text-slate-500" />
                            <input
                              className="h-12 w-full bg-transparent text-sm text-slate-800 outline-none"
                              onChange={(event) =>
                                updateSubjectRow(row.id, "date", event.target.value)
                              }
                              type="date"
                              value={row.date}
                            />
                          </div>
                        </label>

                        <label className="space-y-2">
                          <span className="text-sm font-semibold text-slate-700">
                            From Time
                          </span>
                          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
                            <Clock3 className="h-4 w-4 text-slate-500" />
                            <input
                              className="h-12 w-full bg-transparent text-sm text-slate-800 outline-none"
                              onChange={(event) =>
                                updateSubjectRow(row.id, "startTime", event.target.value)
                              }
                              type="time"
                              value={row.startTime}
                            />
                          </div>
                        </label>

                        <label className="space-y-2">
                          <span className="text-sm font-semibold text-slate-700">
                            End Time
                          </span>
                          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
                            <Clock3 className="h-4 w-4 text-slate-500" />
                            <input
                              className="h-12 w-full bg-transparent text-sm text-slate-800 outline-none"
                              onChange={(event) =>
                                updateSubjectRow(row.id, "endTime", event.target.value)
                              }
                              type="time"
                              value={row.endTime}
                            />
                          </div>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {showValidation ? (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                Please complete the exam name, exam type, select at least one class,
                and fill every subject row with a subject, date, valid from time,
                and end time.
              </div>
            ) : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-500 sm:w-auto"
                onClick={handleCreateExam}
                type="button"
              >
                Create Exam
              </button>
            </div>
          </article>

          <aside className="space-y-5">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <div>
                  <h2 className="text-base font-semibold text-slate-950">
                    Exam Preview
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    This schedule will be shared with all selected classes.
                  </p>
                </div>
              </div>

              {createdExam ? (
                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      Created Successfully
                    </p>
                    <p className="mt-2 text-lg font-semibold text-emerald-900">
                      {createdExam.examName}
                    </p>
                    <p className="mt-1 text-sm text-emerald-800">
                      {createdExam.examType}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Applies To
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {createdExam.classLabels.map((label) => (
                        <span
                          className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700"
                          key={label}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Subjects Scheduled
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {createdExam.schedules.length}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {createdExam.schedules.map((row) => (
                      <div
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                        key={row.id}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-950">
                              {row.subject}
                            </p>
                            <p className="mt-2 text-sm text-slate-500">
                              {formatPrettyDate(row.date)}
                            </p>
                          </div>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                            {formatPrettyTime(row.startTime)} -{" "}
                            {formatPrettyTime(row.endTime)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-700">
                    No exam created yet
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    After you create an exam, the selected classes and full subject
                    schedule will appear here.
                  </p>
                </div>
              )}
            </article>

            {selectedClassLabels.length > 0 ? (
              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-base font-semibold text-slate-950">
                  Current Selection
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  These classes will receive the same exam setup.
                </p>

                <div className="mt-4 space-y-2">
                  {selectedClasses.map((classRoom) => (
                    <div
                      className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                      key={classRoom.id}
                    >
                      <span className="text-sm font-semibold text-slate-800">
                        {classRoom.className} - Section {classRoom.section}
                      </span>
                      <button
                        className="rounded-full p-1 text-slate-400 transition hover:bg-white hover:text-slate-700"
                        onClick={() =>
                          setSelectedClassIds((current) =>
                            current.filter((id) => id !== classRoom.id),
                          )
                        }
                        type="button"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </article>
            ) : null}
          </aside>
        </section>
      </div>

      {showSuccessPopup && createdExam ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-7 w-7" />
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
                Exam created successfully
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {createdExam.examName} has been created as a {createdExam.examType} for{" "}
                {createdExam.classLabels.length} selected{" "}
                {createdExam.classLabels.length === 1 ? "class" : "classes"}.
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-emerald-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Classes Applied
                </p>
                <p className="mt-1 text-3xl font-semibold text-emerald-900">
                  {createdExam.classLabels.length}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Subjects Added
                </p>
                <p className="mt-1 text-3xl font-semibold text-slate-900">
                  {createdExam.schedules.length}
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
                    A notification was sent to the administration team that a new exam has been created.
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
