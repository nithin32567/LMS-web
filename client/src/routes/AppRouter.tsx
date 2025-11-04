import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import SuperAdminLayout from "../layouts/SuperAdminLayout";
import TenantLayout from "../layouts/TenantLayout";
import InstructorLayout from "../layouts/InstructorLayout";
import StudentLayout from "../layouts/StudentLayout";
import Login from "../pages/auth/Login";
import NotFound from "../pages/common/NotFound";

export default function AppRouter() {
  const { user } = useAuth();

  if (!user) return <Login />;

  const role = user.role;

  return (
    <BrowserRouter>
      <Routes>
        {role === "SUPER_ADMIN" && (
          <Route path="/superadmin/*" element={<SuperAdminLayout />} />
        )}
        {role === "TENANT_ADMIN" && (
          <Route path="/tenant/*" element={<TenantLayout />} />
        )}
        {role === "INSTRUCTOR" && (
          <Route path="/instructor/*" element={<InstructorLayout />} />
        )}
        {role === "STUDENT" && (
          <Route path="/student/*" element={<StudentLayout />} />
        )}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
