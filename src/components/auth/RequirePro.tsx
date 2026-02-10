import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { hasProEntitlement, type AuthUser } from "@/lib/auth-helpers";

interface RequireProProps {
  children: React.ReactNode;
}

/**
 * Route guard that checks if the current user has Pro entitlement.
 * Redirects to /upgrade if not.
 */
export function RequirePro({ children }: RequireProProps) {
  const { profile, user, loading, isDemoMode } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile && !user) {
    return <Navigate to="/signin" replace />;
  }

  // Demo mode always has pro access
  if (isDemoMode) {
    return <>{children}</>;
  }

  // Build AuthUser from profile
  const authUser: AuthUser = {
    id: profile?.id || user?.id || "",
    authUserId: user?.id || "",
    email: profile?.email || user?.email || null,
    plan: profile?.plan || null,
    subscriptionTier: profile?.subscription_tier || null,
    isCreator: profile?.is_creator || false,
    fullName: profile?.full_name || null,
    username: profile?.username || null,
  };

  if (!hasProEntitlement(authUser)) {
    return <Navigate to="/upgrade" replace />;
  }

  return <>{children}</>;
}
