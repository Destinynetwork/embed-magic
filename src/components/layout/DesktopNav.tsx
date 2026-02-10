import { Home, Tv, Crown, Newspaper, Sparkles, Zap, Mic, Music2, Headphones, Shield, ChevronDown, MessageCircle, Podcast, Radio, User } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { LoginModal } from "@/components/auth/LoginModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

type NavSize = "default" | "sm";

interface DesktopNavProps {
  className?: string;
  size?: NavSize;
  hideUpgrade?: boolean;
}

// Top row - Free content and general navigation
const topRowItems = [
  { label: "Home", to: "/home", icon: Home, end: true },
  { label: "24/7 News", to: "/news", icon: Newspaper },
  { label: "Free Tier", to: "/free-tier", icon: Sparkles },
  { label: "Unified Chat", to: "/unified-chat", icon: MessageCircle },
];

// Bottom row - Pro products
const proItems = [
  { label: "Elite Pro", to: "/elite-pro", icon: Crown },
  { label: "Embed Pro", to: "/embed-pro", icon: Zap },
  { label: "Radio Pro", to: "/radio-pro", icon: Radio },
  { label: "Podcast Pro", to: "/podcast-pro", icon: Podcast },
  { label: "Music Pro", to: "/music-pro", icon: Music2 },
  { label: "VOD Pro", to: "/vod-pro", icon: Tv },
  { label: "SUPA Pro", to: "/supa-pro", icon: Sparkles },
];

const studioMixItems = [
  { label: "Podcast Studio", to: "/podcast-studio", icon: Mic },
  { label: "Music Studio", to: "/dj-studio", icon: Music2 },
  { label: "Radio Station", to: "/radio-studio", icon: Headphones },
];

export function DesktopNav({ className, size = "default", hideUpgrade = false }: DesktopNavProps) {
  const base =
    "inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-card/30 px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground";
  const active = "bg-secondary text-foreground border-border";
  const adminClass =
    "inline-flex items-center gap-1.5 rounded-md border border-cyan-500/50 bg-cyan-500/10 px-2 py-1.5 text-xs text-cyan-400 transition-colors hover:bg-cyan-500/20 hover:text-cyan-300";
  const adminActive = "bg-cyan-500/20 text-cyan-300 border-cyan-500";

  return (
    <nav aria-label="Primary" className={cn("hidden md:flex flex-col gap-1.5", className)}>
      {/* Top Row - Free/General Navigation */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Global Search */}
        <GlobalSearch size="sm" />
        
        {/* Top Row Items */}
        {topRowItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={base}
            activeClassName={active}
          >
            <item.icon className="h-3.5 w-3.5" />
            <span>{item.label}</span>
          </NavLink>
        ))}

        {/* Studio Mix Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={cn(base, "gap-1")}>
              <Mic className="h-3.5 w-3.5" />
              <span>Studio Mix</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-card border-border">
            <DropdownMenuLabel className="text-muted-foreground text-xs">Broadcasting Studios</DropdownMenuLabel>
            {studioMixItems.map((item) => (
              <DropdownMenuItem key={item.to} asChild>
                <Link to={item.to} className="flex items-center gap-2 cursor-pointer">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile is in the header top-right */}

        {/* Admin Button */}
        <NavLink
          to="/admin"
          className={adminClass}
          activeClassName={adminActive}
        >
          <Shield className="h-3.5 w-3.5" />
          <span>Admin</span>
        </NavLink>

        {/* Login Modal */}
        <LoginModal size="sm" />
      </div>

      {/* Bottom Row - Pro Products */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs text-muted-foreground font-medium mr-0.5">Pro:</span>
        {proItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={cn(base, "border-primary/30 bg-primary/5")}
            activeClassName={cn(active, "border-primary bg-primary/20")}
          >
            <item.icon className="h-3.5 w-3.5" />
            <span>{item.label}</span>
          </NavLink>
        ))}

        {/* Upgrade Button */}
        {!hideUpgrade && (
          <Button
            asChild
            size="sm"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-semibold gap-1 h-7 px-2 text-xs"
          >
            <Link to="/pricing">
              <Crown className="h-3.5 w-3.5" />
              <span>Upgrade</span>
            </Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
