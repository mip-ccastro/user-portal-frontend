/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import HomeLayout from "../components/Layout/HomeLayout";
import Loading from "../components/common/Loading";
import NavigationHandler from "../components/common/NavigationHandler";
import ProtectedRoute from "./ProtectedRoutes";

import { protected_routes, public_routes } from "./routes";
import { useAuthContext } from "../hooks/useAuth";
import type { Route as RouteType } from "../utils/types/routes";
const PageNotFound = lazy(() => import("../pages/PageNotFound"));

const AppRouter = () => {
  const { user } = useAuthContext();

  const filteredRoutes = (): Array<RouteType | null> => {
    return protected_routes.map((route) => {
      const { allowedRoles = [] } = route;
      if(user && !!allowedRoles.length && allowedRoles.includes(user?.user_role as string)) {
        return route
      }

      if(allowedRoles.length <= 0 ) {
        return route
      }

      return null
    }).filter(Boolean);
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<Loading fullScreen message="Loading..." />}>
        <NavigationHandler />
        <Routes>
          <Route
            element={
              <ProtectedRoute>
                <HomeLayout />
              </ProtectedRoute>
            }
          >
            {
              filteredRoutes().map((route, index) => (
                //@ts-ignore
                <Route key={index} path={route.path} element={<route.page />} />
              ))
            }
          </Route>
          {public_routes.map((route, index) => (
            <Route key={index} path={route.path} element={<route.page />} />
          ))}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
