import {Navigate, Outlet, useLocation} from "react-router-dom";
import useUser from "../../features/auth/useUser";
import {Spinner} from "../ui/spinner";
import {PATHS} from "@/config/paths";

function ProtectedRoutes({allowedRoles}) {
  const {isAuthenticated, isPending, role} = useUser();
  const location = useLocation();

  if (isPending) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Spinner className="size-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={PATHS.login} state={{from: location}} replace />;
  }

  const hasPermission = allowedRoles.includes(role);

  if (!hasPermission) {
    if (role === "doctor") {
      return <Navigate to={PATHS.doctor.dashboard} replace />;
    }
    if (role === "secretary") {
      return <Navigate to={PATHS.secretary.dashboard} replace />;
    }
    return <Navigate to={PATHS.login} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoutes;
