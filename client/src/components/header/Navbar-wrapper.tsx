import { useAuth } from "@/contexts/authcontext";
import { useLocation } from "react-router-dom";
import CommonNavbar from "./CommonNavbar";
import AdminNavbar from "./AdminNavbar";
import InstructorNavbar from "./InstructorNavbar";

const NavbarWrapper = () => {
  const { user, accessToken } = useAuth();
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin") && location.pathname !== "/admin/auth";
  const isInstructorPage = location.pathname.startsWith("/instructor");

  if (!user || !accessToken) return null;

  if (isAdminPage && user.role === "admin") {
    return null;
  }

  if (isInstructorPage && user.role === "instructor") {
    return null;
  }

  if (user.role === "instructor") {
    return <InstructorNavbar />;
  }

  if (user.role === "admin") {
    return <AdminNavbar />;
  }

  return <CommonNavbar />;
};

export default NavbarWrapper;
