import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import HomeLayout from "../components/Layout/HomeLayout";
import Loading from "../components/common/Loading";
import NavigationHandler from "../components/common/NavigationHandler";
import ProtectedRoute from "./ProtectedRoutes";

import { protected_routes, public_routes } from "./routes";
const PageNotFound = lazy(() => import("../pages/PageNotFound"));

const AppRouter = () => {
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
            {protected_routes.map((route, index) => (
              <Route key={index} path={route.path} element={<route.page />} />
            ))}
          </Route>
          {public_routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={<route.page />}
            />
          ))}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
