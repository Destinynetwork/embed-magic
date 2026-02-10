import { useNavigate, useLocation } from "react-router-dom";
import { Home, Play, Headphones, Users, Menu } from "lucide-react";

const NAV_ITEMS = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Play, label: "Watch", path: "/watch" },
  { icon: Headphones, label: "Listen", path: "/listen" },
  { icon: Users, label: "Connect", path: "/connect" },
  { icon: Menu, label: "More", path: "/discover" },
];

export function MobileBottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card/95 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 transition-colors touch-target ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
