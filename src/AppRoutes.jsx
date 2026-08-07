import {PATH_SEGMENTS, PATHS} from "@/config/paths";
import {lazy, Suspense} from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import ProtectedRoutes from "./components/ownUI/ProtectedRoutes";
import {Spinner} from "./components/ui/spinner";
import DoctorLayout from "./Layouts/DoctorLayout";
import PublicLayout from "./Layouts/PublicLayout";
import SecretaryLayout from "./Layouts/SecretaryLayout";

// Lazy-loaded pages (Code-Splitting)
const Appointments = lazy(() => import("./pages/Appointments"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Patients = lazy(() => import("./pages/Patients"));
const Register = lazy(() => import("./pages/Register"));
const Secretaries = lazy(() => import("./pages/Secretaries"));
const Settings = lazy(() => import("./pages/Settings"));
const Preferences = lazy(() => import("./pages/Preferences"));
const Visits = lazy(() => import("./pages/Visits"));
const DoctorDashboard = lazy(() => import("./pages/DoctorDashboard"));
const SecretaryDashboard = lazy(() => import("./pages/SecretaryDashboard"));
const Finance = lazy(() => import("./pages/Finance"));

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
                element={<DoctorDashboard />}
              />
              <Route path={PATH_SEGMENTS.patients} element={<Patients />} />
              <Route path={PATH_SEGMENTS.secretary} element={<Secretaries />} />
              <Route
                path={PATH_SEGMENTS.patientDetails}
                element={<h1>Patient Details</h1>}
              />
              <Route path={PATH_SEGMENTS.visits} element={<Visits />} />
              <Route path={PATH_SEGMENTS.finance} element={<Finance />} />
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
                element={<SecretaryDashboard />}
              />
              <Route
                path={PATH_SEGMENTS.appointments}
                element={<Appointments />}
              />
              <Route path={PATH_SEGMENTS.patients} element={<Patients />} />
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
