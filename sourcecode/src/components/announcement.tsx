import { useMemo, useState } from "react";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  Mail,
  Megaphone,
  Send,
  UsersRound,
  X,
} from "lucide-react";
import { classRooms } from "./classes";

type SentAnnouncement = {
  subject: string;
  description: string;
  classLabels: string[];
  parentCount: number;
};

const getClassLabels = (classIds: string[]) =>
  classRooms
    .filter((room) => classIds.includes(room.id))
    .map((room) => `${room.className} - Section ${room.section}`);

export const Announcement = () => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [sentAnnouncement, setSentAnnouncement] =
    useState<SentAnnouncement | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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

  const estimatedParentCount = selectedClasses.reduce(
    (total, classRoom) => total + classRoom.students.length,
    0,
  );

  const toggleClassSelection = (classId: string) => {
    setShowValidation(false);
    setSelectedClassIds((current) =>
      current.includes(classId)
        ? current.filter((item) => item !== classId)
        : [...current, classId],
    );
  };

  const handleSendAnnouncement = () => {
    if (!subject.trim() || !description.trim() || selectedClassIds.length === 0) {
      setShowValidation(true);
      return;
    }

    setSentAnnouncement({
      subject: subject.trim(),
      description: description.trim(),
      classLabels: selectedClassLabels,
      parentCount: estimatedParentCount,
    });
    setShowSuccessPopup(true);
    setShowValidation(false);
    setIsClassDropdownOpen(false);
    setSubject("");
    setDescription("");
    setSelectedClassIds([]);
  };

  return (
    <main className="min-h-full bg-[#f6f8fb] px-4 py-5 text-slate-950 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="space-y-3">
          <div>
            <p className="text-sm font-medium text-slate-500">Operations</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
              Announcement
            </h1>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-base font-semibold text-slate-950">
              Send one announcement to parents across selected classes
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Choose multiple classes, add the announcement subject and message,
              then send it to all parents in those classes.
            </p>
          </div>
        </header>

        <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-[26px] shadow-sm">
            <div className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-indigo-600" />
              <div>
                <h2 className="text-base font-semibold text-slate-950">
                  Compose Announcement
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Draft the message and pick the classes that should receive it.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">
                  Subject
                </span>
                <input
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:bg-white"
                  onChange={(event) => {
                    setSubject(event.target.value);
                    setShowValidation(false);
                  }}
                  placeholder="Enter announcement subject"
                  type="text"
                  value={subject}
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">
                  Description
                </span>
                <textarea
                  className="min-h-36 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:bg-white"
                  onChange={(event) => {
                    setDescription(event.target.value);
                    setShowValidation(false);
                  }}
                  placeholder="Type the full announcement message for parents"
                  value={description}
                />
              </label>

              <div className="space-y-2">
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
                        The message will be sent to all parents from the selected classes.
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

            {showValidation ? (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                Please enter the subject, description, and select at least one class before sending.
              </div>
            ) : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-500 sm:w-auto"
                onClick={handleSendAnnouncement}
                type="button"
              >
                <Send className="h-4 w-4" />
                Send
              </button>
            </div>
          </article>

          <aside className="space-y-5">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <UsersRound className="h-5 w-5 text-emerald-600" />
                <div>
                  <h2 className="text-base font-semibold text-slate-950">
                    Delivery Preview
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    See who will receive this message before sending it.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Selected Classes
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">
                    {selectedClassIds.length}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Estimated Parent Messages
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">
                    {estimatedParentCount}
                  </p>
                </div>

                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700">
                    Message Preview
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {subject.trim() || "Announcement subject"}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-500">
                    {description.trim() || "Your announcement description will appear here."}
                  </p>
                </div>
              </div>
            </article>

            {selectedClasses.length > 0 ? (
              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-base font-semibold text-slate-950">
                  Current Recipients
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Parents from these classes will receive the message.
                </p>

                <div className="mt-4 space-y-2">
                  {selectedClasses.map((classRoom) => (
                    <div
                      className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                      key={classRoom.id}
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {classRoom.className} - Section {classRoom.section}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {classRoom.totalStudents} parent contacts
                        </p>
                      </div>
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

      {showSuccessPopup && sentAnnouncement ? (
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
                Announcement sent successfully
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {sentAnnouncement.subject} was prepared for {sentAnnouncement.classLabels.length} selected{" "}
                {sentAnnouncement.classLabels.length === 1 ? "class" : "classes"}.
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-emerald-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Classes Applied
                </p>
                <p className="mt-1 text-3xl font-semibold text-emerald-900">
                  {sentAnnouncement.classLabels.length}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Parent Messages
                </p>
                <p className="mt-1 text-3xl font-semibold text-slate-900">
                  {sentAnnouncement.parentCount}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-sky-100 bg-sky-50 p-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-sky-600" />
                <div>
                  <p className="font-semibold text-sky-800">
                    Message sent to parents
                  </p>
                  <p className="mt-1 text-sm text-sky-700">
                    The announcement has been sent to all parents in the selected classes.
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
