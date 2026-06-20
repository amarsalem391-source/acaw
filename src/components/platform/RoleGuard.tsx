import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { usePlatformRole, PlatformRole, dashboardPathFor } from "@/hooks/usePlatformRole";
import { useAuth } from "@/contexts/AuthContext";

export default function RoleGuard({ allow, children }: { allow: PlatformRole[]; children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { role, loading } = usePlatformRole();
  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">جاري التحميل...</div>;
  }
  if (!user) return <Navigate to="/platform/login" replace />;
  if (!role || !allow.includes(role)) return <Navigate to={dashboardPathFor(role)} replace />;
  return <>{children}</>;
}
