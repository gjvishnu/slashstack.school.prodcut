export type LeaveStatus = "Approved" | "Pending" | "Rejected";

export type LeaveApplication = {
  id: string;
  teacherName: string;
  type: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: LeaveStatus;
};

export type LateMark = {
  id: string;
  teacherName: string;
  date: string;
  time: string;
  lateMinutes: number;
  reason: string;
};

export const CURRENT_TEACHER_NAME = "Ananya Sharma";

const LEAVE_STORAGE_KEY = "slashstack-teacher-leaves";
const LATE_STORAGE_KEY = "slashstack-teacher-late-marks";

const defaultLeaveApplications: LeaveApplication[] = [
  {
    id: "leave-1",
    teacherName: "Ananya Sharma",
    type: "Casual Leave",
    fromDate: "2026-04-11",
    toDate: "2026-04-11",
    reason: "Family function",
    status: "Approved",
  },
  {
    id: "leave-2",
    teacherName: "Ananya Sharma",
    type: "Medical Leave",
    fromDate: "2026-05-06",
    toDate: "2026-05-07",
    reason: "Health checkup",
    status: "Pending",
  },
  {
    id: "leave-3",
    teacherName: "Meera Nair",
    type: "Casual Leave",
    fromDate: "2026-04-15",
    toDate: "2026-04-15",
    reason: "Personal work",
    status: "Pending",
  },
  {
    id: "leave-4",
    teacherName: "Rahul Menon",
    type: "Emergency Leave",
    fromDate: "2026-04-22",
    toDate: "2026-04-22",
    reason: "Travel delay",
    status: "Approved",
  },
];

const defaultLateMarks: LateMark[] = [
  {
    id: "late-1",
    teacherName: "Ananya Sharma",
    date: "2026-04-05",
    time: "09:12",
    lateMinutes: 12,
    reason: "Traffic delay",
  },
  {
    id: "late-2",
    teacherName: "Meera Nair",
    date: "2026-04-18",
    time: "08:58",
    lateMinutes: 8,
    reason: "Bus delay",
  },
];

const readJson = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") {
    return fallback;
  }

  const storedValue = window.localStorage.getItem(key);

  if (!storedValue) {
    return fallback;
  }

  try {
    return JSON.parse(storedValue) as T;
  } catch {
    return fallback;
  }
};

const writeJson = <T,>(key: string, value: T) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
};

export const getLeaveApplications = () =>
  readJson<LeaveApplication[]>(LEAVE_STORAGE_KEY, defaultLeaveApplications);

export const saveLeaveApplications = (applications: LeaveApplication[]) => {
  writeJson(LEAVE_STORAGE_KEY, applications);
};

export const getLateMarks = () =>
  readJson<LateMark[]>(LATE_STORAGE_KEY, defaultLateMarks);

export const saveLateMarks = (lateMarks: LateMark[]) => {
  writeJson(LATE_STORAGE_KEY, lateMarks);
};
