import {BrowserRouter, Route, Routes} from "react-router-dom";
import {lazy, Suspense} from "react";
import AppLayout from "./components/ownUI/AppLayout";
import ProtectedRoutes from "./components/ownUI/ProtectedRoutes";
import PublicLayout from "./features/public/PublicLayout";
import {Spinner} from "./components/ui/spinner";

// Lazy-loaded pages (Code-Splitting)
const Appointments = lazy(() => import("./pages/Appointments"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Patients = lazy(() => import("./pages/Patients"));
const Register = lazy(() => import("./pages/Register"));
const Secretaries = lazy(() => import("./pages/Secretaries"));

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

          <Route element={<ProtectedRoutes />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<h1>Dashboard</h1>} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/secretaries" element={<Secretaries />} />
              <Route path="/appointments" element={<Appointments />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;
