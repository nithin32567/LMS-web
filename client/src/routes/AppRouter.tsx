import { Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { routes } from "./RoutingConfig";
import type { AppRoute } from "./RoutingConfig";
import ProtectedRoute from "./ProtectedRoute";
import type { UserRole } from "./RoutingConfig";
import NavbarWrapper from "@/components/header/Navbar-wrapper";

const renderRoute = (route: AppRoute, index: number): React.ReactNode => {
  const { path, index: isIndex, element, roles, children } = route;

  if (children && children.length > 0) {
    if (roles) {
      return (
        <Route
          key={`${path || 'index'}-${index}`}
          path={path}
          element={
            <ProtectedRoute allowedRoles={roles as UserRole[]}>
              {element}
            </ProtectedRoute>
          }
        >
          {children.map((child, childIndex) =>
            renderRoute(child, childIndex)
          )}
        </Route>
      );
    }

    return (
      <Route key={`${path || 'index'}-${index}`} path={path} element={element}>
        {children.map((child, childIndex) => renderRoute(child, childIndex))}
      </Route>
    );
  }

  if (isIndex) {
    if (roles) {
      return (
        <Route
          key={`index-${index}`}
          index
          element={
            <ProtectedRoute allowedRoles={roles as UserRole[]}>
              {element}
            </ProtectedRoute>
          }
        />
      );
    }
    return (
      <Route key={`index-${index}`} index element={element} />
    );
  }

  if (roles) {
    return (
      <Route
        key={`${path}-${index}`}
        path={path}
        element={
          <ProtectedRoute allowedRoles={roles as UserRole[]}>
            {element}
          </ProtectedRoute>
        }
      />
    );
  }

  return (
    <Route key={`${path}-${index}`} path={path} element={element} />
  );
};

export default function AppRouter() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/admin/auth" || location.pathname === "/auth";

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {!isAuthPage && <NavbarWrapper />}
      <Routes>
        {routes.map((route, index) => renderRoute(route, index))}
      </Routes>
    </Suspense>
  );
}
