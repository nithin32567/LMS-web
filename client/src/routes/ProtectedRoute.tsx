import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/authcontext";
import type { UserRole } from "./RoutingConfig";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/auth" />;

  if (allowedRoles && !allowedRoles.includes(user.role as UserRole))
    return <Navigate to="/unauthorized" />;
  
  return children;
}
