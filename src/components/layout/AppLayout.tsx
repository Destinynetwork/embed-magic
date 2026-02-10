import { ReactNode } from "react";
import { useIsBackendRoute } from "@/hooks/useIsBackendRoute";
import { MobileBottomNav } from "./MobileBottomNav";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
  hideBottomNav?: boolean;
  className?: string;
}

export function AppLayout({
  children,
  hideHeader = false,
  hideBottomNav = false,
  className,
}: AppLayoutProps) {
  const isBackendRoute = useIsBackendRoute();
  const shouldShowBottomNav = !hideBottomNav;

  return (
    <div className={cn(
      "min-h-screen bg-background",
      shouldShowBottomNav && "pb-16 md:pb-0"
    )}>
      <main className={className}>{children}</main>
      {shouldShowBottomNav && !isBackendRoute && <MobileBottomNav />}
    </div>
  );
}
