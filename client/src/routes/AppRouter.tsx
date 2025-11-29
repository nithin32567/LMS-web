import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { routes } from "./RoutingConfig";
import type { AppRoute } from "./RoutingConfig";
import ProtectedRoute from "./ProtectedRoute";
import type { UserRole } from "./RoutingConfig";
import NavbarWrapper from "@/components/header/Navbar-wrapper";

export default function AppRouter() {
  return (
    <Suspense fallback={<div>Loading...</div>}>

      {window.location.pathname.includes("/admin/auth") ? (
        <></>
      ) : (
        <NavbarWrapper />
      )}
      <Routes>
        {routes.map(({ path, element, roles }: AppRoute, index: number) => {
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
        })}
      </Routes>
    </Suspense>
  );
}
