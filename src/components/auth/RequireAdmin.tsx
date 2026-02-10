import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ShieldAlert } from "lucide-react";

interface RequireAdminProps {
  children: ReactNode;
  redirectTo?: string;
  redirect?: boolean;
}

export function RequireAdmin({ children, redirectTo = "/", redirect = false }: RequireAdminProps) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    if (redirect) {
      return <Navigate to={redirectTo} replace />;
    }
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-8">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
        <p className="text-muted-foreground max-w-md">
          You do not have the required permissions to access this area.
          Contact your administrator if you believe this is an error.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
