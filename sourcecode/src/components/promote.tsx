import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Mail,
  MoveRight,
  Send,
  UsersRound,
  X,
} from "lucide-react";
import { classRooms } from "./classes";

type PromoteMode = "all" | "class";

type PromotionItem = {
  id: string;
  fromClass: string;
  toClass: string;
  studentCount: number;
};

const getNextClassLabel = (className: string, section: string) => {
  const match = className.match(/(\d+)/);

  if (!match) {
    return `${className} Advanced - Section ${section}`;
  }

  const currentNumber = Number(match[1]);

  if (currentNumber >= 12) {
    return `Graduated - Section ${section}`;
  }

  return `Class ${currentNumber + 1} - Section ${section}`;
};

const getPromotionItem = (classId: string): PromotionItem | null => {
  const classRoom = classRooms.find((room) => room.id === classId);

  if (!classRoom) {
    return null;
  }

  return {
    id: classRoom.id,
    fromClass: `${classRoom.className} - Section ${classRoom.section}`,
    toClass: getNextClassLabel(classRoom.className, classRoom.section),
    studentCount: classRoom.students.length,
  };
};

export const Promote = () => {
  const [mode, setMode] = useState<PromoteMode>("all");
  const [selectedClassId, setSelectedClassId] = useState(classRooms[0]?.id ?? "");
  const [promotedItems, setPromotedItems] = useState<PromotionItem[]>([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const promotionPreview = useMemo(() => {
    if (mode === "all") {
      return classRooms
        .map((classRoom) => getPromotionItem(classRoom.id))
        .filter((item): item is PromotionItem => Boolean(item));
    }

    const item = getPromotionItem(selectedClassId);
    return item ? [item] : [];
  }, [mode, selectedClassId]);

  const totalStudentsToPromote = promotionPreview.reduce(
    (sum, item) => sum + item.studentCount,
    0,
  );

  const handlePromote = () => {
    setPromotedItems(promotionPreview);
    setShowSuccessPopup(true);
  };

  return (
    <main className="min-h-full bg-[#f6f8fb] px-4 py-5 text-slate-950 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="space-y-3">
          <div>
            <p className="text-sm font-medium text-slate-500">Operations</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Promote</h1>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-base font-semibold text-slate-950">
              Promote students to the next class
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Promote all classes together or choose one class and move all
              students to the next level.
            </p>
          </div>
        </header>

        <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-[26px] shadow-sm">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-indigo-600" />
              <div>
                <h2 className="text-base font-semibold text-slate-950">
                  Promotion Setup
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Choose whether to promote everyone or only one class.
                </p>
              </div>
            </div>

            <div className="mt-5 inline-flex rounded-2xl bg-slate-100 p-1">
              <button
                className={`inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold transition ${
                  mode === "all"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                onClick={() => setMode("all")}
                type="button"
              >
                Promote All
              </button>
              <button
                className={`inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold transition ${
                  mode === "class"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                onClick={() => setMode("class")}
                type="button"
              >
                Select by Class
              </button>
            </div>

            {mode === "class" ? (
              <div className="mt-5 space-y-2">
                <span className="text-sm font-semibold text-slate-700">Class</span>
                <select
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:bg-white"
                  onChange={(event) => setSelectedClassId(event.target.value)}
                  value={selectedClassId}
                >
                  {classRooms.map((classRoom) => (
                    <option key={classRoom.id} value={classRoom.id}>
                      {classRoom.className} - Section {classRoom.section}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <UsersRound className="mt-0.5 h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-semibold text-slate-950">
                    {mode === "all" ? "Whole-school promotion" : "Single-class promotion"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {mode === "all"
                      ? "All listed classes will be promoted to their next class in one action."
                      : "All students in the selected class will be moved to the next class."}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-500 sm:w-auto"
                onClick={handlePromote}
                type="button"
              >
                <Send className="h-4 w-4" />
                Promote Students
              </button>
            </div>
          </article>

          <aside className="space-y-5">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <MoveRight className="h-5 w-5 text-emerald-600" />
                <div>
                  <h2 className="text-base font-semibold text-slate-950">
                    Promotion Preview
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Review the movement before you promote students.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Classes Affected
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">
                    {promotionPreview.length}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Students Promoted
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">
                    {totalStudentsToPromote}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {promotionPreview.map((item) => (
                  <div
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    key={item.id}
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">
                          {item.fromClass}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                          <ArrowRight className="h-4 w-4" />
                          <span>{item.toClass}</span>
                        </div>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                        {item.studentCount} students
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </aside>
        </section>
      </div>

      {showSuccessPopup ? (
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
                Students promoted successfully
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {promotedItems.length} {promotedItems.length === 1 ? "class was" : "classes were"} promoted with{" "}
                {promotedItems.reduce((sum, item) => sum + item.studentCount, 0)} students moved to the next class.
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-sky-100 bg-sky-50 p-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-sky-600" />
                <div>
                  <p className="font-semibold text-sky-800">
                    Mail sent to administration members
                  </p>
                  <p className="mt-1 text-sm text-sky-700">
                    The administration team has been notified that the promotion process was completed.
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
