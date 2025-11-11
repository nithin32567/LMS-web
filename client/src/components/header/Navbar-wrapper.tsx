import { useAuth } from "@/contexts/authcontext";
import CommonNavbar from "./CommonNavbar";
import AdminNavbar from "./AdminNavbar";

const NavbarWrapper = () => {
  const { user, accessToken } = useAuth();
  if (!user || !accessToken) return null;
  return user.role === "admin" ? <AdminNavbar /> : <CommonNavbar />;
};

export default NavbarWrapper;
