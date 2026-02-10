import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface RequireAuthProps {
  children: ReactNode;
  redirectTo?: string;
}

export function RequireAuth({ children, redirectTo = "/auth" }: RequireAuthProps) {
  const { user, isDemoMode, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user && !isDemoMode) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
