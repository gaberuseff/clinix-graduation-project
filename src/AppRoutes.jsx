import {lazy, Suspense} from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import ProtectedRoutes from "./components/ownUI/ProtectedRoutes";
import {Spinner} from "./components/ui/spinner";
import PublicLayout from "./features/public/PublicLayout";
import DoctorLayout from "./Layouts/DoctorLayout";
import SecretaryLayout from "./Layouts/SecretaryLayout";
import {PATHS, PATH_SEGMENTS} from "@/config/paths";

// Lazy-loaded pages (Code-Splitting)
const Appointments = lazy(() => import("./pages/Appointments"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Patients = lazy(() => import("./pages/Patients"));
const Register = lazy(() => import("./pages/Register"));
const Secretaries = lazy(() => import("./pages/Secretaries"));
const Settings = lazy(() => import("./pages/Settings"));
const Discounts = lazy(() => import("./pages/Discounts"));
const Preferences = lazy(() => import("./pages/Preferences"));
const Visits = lazy(() => import("./pages/Visits"));

function PageLoader() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-background">
      <Spinner className="size-8 text-primary animate-spin" />
    </div>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path={PATHS.root} element={<h1>Hello</h1>} />
            <Route path={PATHS.login} element={<Login />} />
            <Route path={PATHS.register} element={<Register />} />
          </Route>

          <Route element={<ProtectedRoutes allowedRoles={["doctor"]} />}>
            <Route path={PATHS.doctor.root} element={<DoctorLayout />}>
              <Route
                index
                element={<Navigate to={PATH_SEGMENTS.dashboard} replace />}
              />
              <Route
                path={PATH_SEGMENTS.dashboard}
                element={<h1>Doctor Dashboard</h1>}
              />
              <Route path={PATH_SEGMENTS.patients} element={<Patients />} />
              <Route path={PATH_SEGMENTS.secretary} element={<Secretaries />} />
              <Route
                path={PATH_SEGMENTS.patientDetails}
                element={<h1>Patient Details</h1>}
              />
              <Route path={PATH_SEGMENTS.visits} element={<Visits />} />
              <Route
                path={PATH_SEGMENTS.finance}
                element={<h1>Doctor Finance</h1>}
              />
              <Route path={PATH_SEGMENTS.settings} element={<Settings />} />
              <Route
                path={PATH_SEGMENTS.preferences}
                element={<Preferences />}
              />
            </Route>
          </Route>

          <Route element={<ProtectedRoutes allowedRoles={["secretary"]} />}>
            <Route path={PATHS.secretary.root} element={<SecretaryLayout />}>
              <Route
                index
                element={<Navigate to={PATH_SEGMENTS.dashboard} replace />}
              />
              <Route
                path={PATH_SEGMENTS.dashboard}
                element={<h1>Receptionist Dashboard</h1>}
              />
              <Route
                path={PATH_SEGMENTS.appointments}
                element={<Appointments />}
              />
              <Route path={PATH_SEGMENTS.patients} element={<Patients />} />
              <Route
                path={PATH_SEGMENTS.payments}
                element={<h1>Daily Payments</h1>}
              />
              <Route
                path={PATH_SEGMENTS.preferences}
                element={<Preferences />}
              />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;
