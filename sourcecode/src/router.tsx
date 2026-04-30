import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { ClassStudents, StudentDetails, Classes } from "./components/classes";
import { Announcement } from "./components/announcement";
import { Dashboard } from "./components/dashboard";
import { Exams } from "./components/exams";
import { Events } from "./components/events";
import { Promote } from "./components/promote";
import { Reports } from "./components/reports";
import {
  ApprovalAndMark,
  AssignTeacher,
  TeacherMonthlyAttendance,
} from "./components/teacher-operations";
import {
  LeaveTracker,
  MyAttendance,
  MyTimeTable,
} from "./components/teacher-house";
import {
  StudentAttendanceClassDetails,
  StudentAttendanceClasses,
} from "./components/student-attendance";
import { TeacherDetails, Teachers } from "./components/teachers";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "classes", element: <Classes /> },
      { path: "classes/:classId", element: <ClassStudents /> },
      { path: "classes/:classId/:studentId", element: <StudentDetails /> },
      { path: "teachers", element: <Teachers /> },
      { path: "teachers/:teacherId", element: <TeacherDetails /> },
      { path: "reports", element: <Reports /> },
      { path: "student-attendance", element: <StudentAttendanceClasses /> },
      { path: "announcement", element: <Announcement /> },
      { path: "exams", element: <Exams /> },
      { path: "assign-teacher", element: <AssignTeacher /> },
      { path: "approval-mark", element: <ApprovalAndMark /> },
      {
        path: "teacher-monthly-attendance",
        element: <TeacherMonthlyAttendance />,
      },
      { path: "events", element: <Events /> },
      { path: "promote", element: <Promote /> },
      { path: "my-attendance", element: <MyAttendance /> },
      { path: "leave-tracker", element: <LeaveTracker /> },
      { path: "my-time-table", element: <MyTimeTable /> },
      {
        path: "student-attendance/:classId",
        element: <StudentAttendanceClassDetails />,
      },
    ],
  },
]);
