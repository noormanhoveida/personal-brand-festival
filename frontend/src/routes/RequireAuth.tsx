import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import { Role } from "../features/auth/authSlice";

interface Props {
  allow?: Role[];
}

export function RequireAuth({ allow }: Props) {
  const { status, role } = useAppSelector((s) => s.auth);
  const location = useLocation();

  if (status !== "authenticated") {
    const redirectPath = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectPath}`} replace />;
  }

  if (allow && role && !allow.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
