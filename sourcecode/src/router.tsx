import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { ClassStudents, StudentDetails, Classes } from "./components/classes";
import { Dashboard } from "./components/dashboard";
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
    ],
  },
]);
