import Home from "@/pages/common/Home";
import { lazy } from "react";
import type { JSX } from "react";

const AdminDashboard = lazy(() => import("./../pages/admin/admin-dashboard"));
const StudentDashboard = lazy(
  () => import("./../pages/student/student-dashboard")
);
const NotFound = lazy(() => import("./../pages/common/NotFound"));
const Auth = lazy(() => import("./../pages/common/auth"));
const Profile = lazy(() => import("./../pages/common/Profile"));

export type UserRole = "admin" | "student" | "instructor";

export interface AppRoute {
  path: string;
  element: JSX.Element;
  roles?: UserRole[];
}

export const routes: AppRoute[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
    roles: ["admin"],
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
    path: "*",
    element: <NotFound />,
  },
];
