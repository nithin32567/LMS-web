import Home from "@/pages/common/Home";
import { lazy } from "react";
import { Navigate } from "react-router-dom";
import type { JSX } from "react";

const AdminDashboardWrapper = lazy(() => import("./../pages/admin/Admin-dashboardWrapper"));
const AdminDashboard = lazy(() => import("./../pages/admin/admin-dashboard"));
const AdminLogin = lazy(() => import("./../pages/admin/login"));
const AllUsers = lazy(() => import("./../pages/admin/all-users"));
const Course = lazy(() => import("./../pages/admin/course"));
const Instructors = lazy(() => import("./../pages/admin/instructors"));
const Students = lazy(() => import("./../pages/admin/students"));
const StudentDashboard = lazy(
  () => import("./../pages/student/student-dashboard")
);
const NotFound = lazy(() => import("./../pages/common/NotFound"));
const Auth = lazy(() => import("../pages/common/signup"));
const Profile = lazy(() => import("./../pages/common/Profile"));
const InstructorDashboardWrapper = lazy(
  () => import("./../pages/instructor/Instructor-dashboardWrapper")
);
const InstructorDashboard = lazy(
  () => import("./../pages/instructor/instructor-dashboard")
);
const CreateCourse = lazy(
  () => import("./../pages/instructor/Create-course")
);
const MyCourses = lazy(
  () => import("./../pages/instructor/my-courses")
);
const CreateModuleLesson = lazy(
  () => import("./../pages/modules/create-module-lesson")
);
const CourseDetails = lazy(
  () => import("./../pages/common/Course-details")
);
const InstructorProfile = lazy(
  () => import("./../pages/instructor/Intstructor-profile")
);

export type UserRole = "admin" | "student" | "instructor";

export interface AppRoute {
  path?: string;
  index?: boolean;
  element: JSX.Element;
  roles?: UserRole[];
  children?: AppRoute[];
}

export const routes: AppRoute[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/admin/auth",
    element: <AdminLogin />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/admin",
    element: <AdminDashboardWrapper />,
    roles: ["admin"],
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <AdminDashboard />,
        roles: ["admin"],
      },
      {
        path: "courses",
        element: <Course />,
        roles: ["admin", "instructor"],
      },
      {
        path: "users",
        element: <AllUsers />,
        roles: ["admin"],
      },
      {
        path: "instructors",
        element: <Instructors />,
        roles: ["admin"],
      },
      {
        path: "students",
        element: <Students />,
        roles: ["admin"],
      },
    ],
  },
  {
    path: "/student/dashboard",
    element: <StudentDashboard />,
    roles: ["student"],
  },
  {
    path: "/profile",
    element: <Profile />,
    roles: ["admin", "instructor", "student"],
  },
  {
    path: "/course/:courseId",
    element: <CourseDetails />,
  },
  {
    path: "/instructor",
    element: <InstructorDashboardWrapper />,
    roles: ["instructor", "student"],
    children: [
      {
        index: true,
        element: <Navigate to="/instructor/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <InstructorDashboard />,
        roles: ["instructor", "student"],
      },
      {
        path: "my-courses",
        element: <MyCourses />,
        roles: ["instructor"],
      },
      {
        path: "create-course",
        element: <CreateCourse />,
        roles: ["instructor"],
      },
      {
        path: "course/:courseId/modules-lessons",
        element: <CreateModuleLesson />,
        roles: ["instructor"],
      },
      {
        path: "profile",
        element: <InstructorProfile />,
        roles: ["instructor"],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
