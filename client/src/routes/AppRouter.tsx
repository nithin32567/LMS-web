import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { routes } from "./RoutingConfig";
import type { AppRoute } from "./RoutingConfig";
import ProtectedRoute from "./ProtectedRoute";
import type { UserRole } from "./RoutingConfig";

export default function AppRouter() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {routes.map(({ path, element, roles }: AppRoute) => {
          if (roles) {
            // Protected route
            return (
              <Route
                key={path}
                path={path}
                element={
                  <ProtectedRoute allowedRoles={roles as UserRole[]}>
                    {element}
                  </ProtectedRoute>
                }
              />
            );
          }

          // Public route
          return <Route key={path} path={path} element={element} />;
        })}
      </Routes>
    </Suspense>
  );
}
