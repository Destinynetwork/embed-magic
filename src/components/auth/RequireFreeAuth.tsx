import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface RequireFreeAuthProps {
  children: React.ReactNode;
}

/**
 * Route guard that requires authentication (any plan).
 * Redirects to /signin if not authenticated.
 */
export function RequireFreeAuth({ children }: RequireFreeAuthProps) {
  const { profile, user, loading, isDemoMode } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile && !user && !isDemoMode) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}
