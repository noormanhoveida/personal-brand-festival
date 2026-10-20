import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import { Role } from "../features/auth/authSlice";

interface Props {
  allow?: Role[];
}

export function RequireAuth({ allow }: Props) {
  const { status, role } = useAppSelector((s) => s.auth);

  if (status !== "authenticated") {
    return <Navigate to="/login" replace />;
  }
  if (allow && role && !allow.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}
