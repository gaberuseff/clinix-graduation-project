import {Navigate, Outlet, useLocation} from "react-router-dom";
import useUser from "../../features/auth/useUser";
import {Spinner} from "../ui/spinner";

function ProtectedRoutes() {
  const {isAuthenticated, isPending} = useUser();
  const location = useLocation();

  if (isPending) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Spinner className="size-8 text-primary animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{from: location}} replace />
  );
}

export default ProtectedRoutes;
