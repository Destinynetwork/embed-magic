import { cn } from "@/lib/utils";
import { MobileNav } from "./MobileNav";
import { DesktopNav } from "./DesktopNav";

type NavSize = "default" | "sm";

interface PrimaryNavProps {
  className?: string;
  size?: NavSize;
  hideUpgrade?: boolean;
}

export function PrimaryNav({ className, size = "default", hideUpgrade = false }: PrimaryNavProps) {
  return (
    <div className={cn("flex items-center", className)}>
      {/* Mobile Navigation */}
      <MobileNav />
      
      {/* Desktop Navigation */}
      <DesktopNav size={size} hideUpgrade={hideUpgrade} />
    </div>
  );
}
