import {lazy, Suspense} from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import ProtectedRoutes from "./components/ownUI/ProtectedRoutes";
import {Spinner} from "./components/ui/spinner";
import PublicLayout from "./features/public/PublicLayout";
import DoctorLayout from "./Layouts/DoctorLayout";
import SecretaryLayout from "./Layouts/SecretaryLayout";

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
            <Route path="/" element={<h1>Hello</h1>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<ProtectedRoutes allowedRoles={["doctor"]} />}>
            <Route path="/doctor" element={<DoctorLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<h1>Doctor Dashboard</h1>} />
              <Route path="patients" element={<Patients />} />
              <Route path="secretary" element={<Secretaries />} />
              <Route
                path="patients/:patientId"
                element={<h1>Patient Details</h1>}
              />
              <Route path="visits" element={<Visits />} />
              <Route path="finance" element={<h1>Doctor Finance</h1>} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoutes allowedRoles={["secretary"]} />}>
            <Route path="/secretary" element={<SecretaryLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route
                path="dashboard"
                element={<h1>Receptionist Dashboard</h1>}
              />
              <Route path="appointments" element={<Appointments />} />
              <Route path="patients" element={<Patients />} />
              <Route path="payments" element={<h1>Daily Payments</h1>} />
              <Route path="preferences" element={<Preferences />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;
