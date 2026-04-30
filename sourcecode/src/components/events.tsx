import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  PartyPopper,
  Send,
  UsersRound,
  X,
} from "lucide-react";

type CreatedEvent = {
  title: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  description: string;
};

const eventCategories = [
  "Academic",
  "Sports",
  "Cultural",
  "Parent Meeting",
  "Holiday Program",
  "Workshop",
];

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

export const Events = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [showValidation, setShowValidation] = useState(false);
  const [createdEvent, setCreatedEvent] = useState<CreatedEvent | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setVenue("");
    setDescription("");
  };

  const handleCreateEvent = () => {
    if (
      !title.trim() ||
      !category ||
      !date ||
      !startTime ||
      !endTime ||
      !venue.trim() ||
      !description.trim() ||
      endTime <= startTime
    ) {
      setShowValidation(true);
      return;
    }

    setCreatedEvent({
      title: title.trim(),
      category,
      date,
      startTime,
      endTime,
      venue: venue.trim(),
      description: description.trim(),
    });
    setShowValidation(false);
    setShowSuccessPopup(true);
    resetForm();
  };

  return (
    <main className="min-h-full bg-[#f6f8fb] px-4 py-5 text-slate-950 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="space-y-3">
          <div>
            <p className="text-sm font-medium text-slate-500">Operations</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Events</h1>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-base font-semibold text-slate-950">
              Create school upcoming events
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Add the event details, review the preview, and publish the event for
              school coordination.
            </p>
          </div>
        </header>

        <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-[26px] shadow-sm">
            <div className="flex items-center gap-2">
              <PartyPopper className="h-5 w-5 text-indigo-600" />
              <div>
                <h2 className="text-base font-semibold text-slate-950">
                  Create Event
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Set the event title, schedule, venue, and details.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold text-slate-700">
                  Event Title
                </span>
                <input
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:bg-white"
                  onChange={(event) => {
                    setTitle(event.target.value);
                    setShowValidation(false);
                  }}
                  placeholder="Enter event title"
                  type="text"
                  value={title}
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">
                  Category
                </span>
                <select
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:bg-white"
                  onChange={(event) => {
                    setCategory(event.target.value);
                    setShowValidation(false);
                  }}
                  value={category}
                >
                  <option value="">Select category</option>
                  {eventCategories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">
                  Event Date
                </span>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
                  <CalendarDays className="h-4 w-4 text-slate-500" />
                  <input
                    className="h-12 w-full bg-transparent text-sm text-slate-800 outline-none"
                    onChange={(event) => {
                      setDate(event.target.value);
                      setShowValidation(false);
                    }}
                    type="date"
                    value={date}
                  />
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">
                  Start Time
                </span>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
                  <Clock3 className="h-4 w-4 text-slate-500" />
                  <input
                    className="h-12 w-full bg-transparent text-sm text-slate-800 outline-none"
                    onChange={(event) => {
                      setStartTime(event.target.value);
                      setShowValidation(false);
                    }}
                    type="time"
                    value={startTime}
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
                    onChange={(event) => {
                      setEndTime(event.target.value);
                      setShowValidation(false);
                    }}
                    type="time"
                    value={endTime}
                  />
                </div>
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold text-slate-700">
                  Venue
                </span>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <input
                    className="h-12 w-full bg-transparent text-sm text-slate-800 outline-none"
                    onChange={(event) => {
                      setVenue(event.target.value);
                      setShowValidation(false);
                    }}
                    placeholder="Enter event venue"
                    type="text"
                    value={venue}
                  />
                </div>
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold text-slate-700">
                  Description
                </span>
                <textarea
                  className="min-h-36 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:bg-white"
                  onChange={(event) => {
                    setDescription(event.target.value);
                    setShowValidation(false);
                  }}
                  placeholder="Describe the upcoming school event"
                  value={description}
                />
              </label>
            </div>

            {showValidation ? (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                Please complete all event details and make sure the end time is after the start time.
              </div>
            ) : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-500 sm:w-auto"
                onClick={handleCreateEvent}
                type="button"
              >
                <Send className="h-4 w-4" />
                Create Event
              </button>
            </div>
          </article>

          <aside className="space-y-5">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <UsersRound className="h-5 w-5 text-emerald-600" />
                <div>
                  <h2 className="text-base font-semibold text-slate-950">
                    Event Preview
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Review the upcoming event before creating it.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Event Title
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {title.trim() || "Upcoming school event"}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    {category || "Event category"}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Date
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {date ? formatPrettyDate(date) : "Select date"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Time
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {startTime && endTime
                        ? `${formatPrettyTime(startTime)} - ${formatPrettyTime(endTime)}`
                        : "Select time range"}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700">Venue</p>
                  <p className="mt-2 text-sm text-slate-500">
                    {venue.trim() || "Add event venue"}
                  </p>
                </div>

                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700">
                    Description
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-500">
                    {description.trim() || "The full event description will appear here."}
                  </p>
                </div>
              </div>
            </article>
          </aside>
        </section>
      </div>

      {showSuccessPopup && createdEvent ? (
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
                Event created successfully
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {createdEvent.title} has been created as a {createdEvent.category} event for{" "}
                {formatPrettyDate(createdEvent.date)}.
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-emerald-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Venue
                </p>
                <p className="mt-1 text-sm font-semibold text-emerald-900">
                  {createdEvent.venue}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Time
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {formatPrettyTime(createdEvent.startTime)} -{" "}
                  {formatPrettyTime(createdEvent.endTime)}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-sky-100 bg-sky-50 p-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-sky-600" />
                <div>
                  <p className="font-semibold text-sky-800">
                    Mail sent to administration members
                  </p>
                  <p className="mt-1 text-sm text-sky-700">
                    The administration team has been notified that a new event has been created.
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
