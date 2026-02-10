import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Home, Tv, Crown, Newspaper, Sparkles, Zap, Mic, Music2, Headphones, Shield, ChevronDown, ChevronRight, MessageCircle, Podcast, Radio, Video, Code2, Antenna, Store, Calendar, Users, Heart, Briefcase, Newspaper as NewsIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { LoginModal } from "@/components/auth/LoginModal";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { ChannelFilter } from "@/components/vod/VODSidebar";

interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
  end?: boolean;
}

interface ChannelItem {
  label: string;
  icon: React.ElementType;
  filterKey: ChannelFilter;
}

// Free/General items - Top section
const freeItems: NavItem[] = [
  { label: "Home", to: "/home", icon: Home, end: true },
  { label: "24/7 News", to: "/news", icon: Newspaper },
  { label: "Free Tier", to: "/free-tier", icon: Sparkles },
  { label: "Unified Chat", to: "/unified-chat", icon: MessageCircle },
];

// Pro Channels - navigate to /home with filter
const proChannels: ChannelItem[] = [
  { label: "VOD Pro", icon: Video, filterKey: "vod_pro" },
  { label: "Elite Pro", icon: Crown, filterKey: "elite_pro" },
  { label: "Music Pro", icon: Music2, filterKey: "music_pro" },
  { label: "Podcast Pro", icon: Podcast, filterKey: "podcast_pro" },
  { label: "Radio Pro", icon: Radio, filterKey: "radio_pro" },
  { label: "Embed Pro", icon: Code2, filterKey: "embed_pro" },
  { label: "SUPA Pro", icon: Zap, filterKey: "supa_pro" },
  { label: "Live Stream", icon: Tv, filterKey: "live_stream" },
  { label: "Pro Events", icon: Calendar, filterKey: "events_calendar" },
];

// Free Channels
const freeChannels: ChannelItem[] = [
  { label: "Free Embed", icon: Zap, filterKey: "free_embed" },
  { label: "Live Stream", icon: Tv, filterKey: "live_stream" },
  { label: "Podcast Studio", icon: Mic, filterKey: "podcast_studio" },
  { label: "DJ Studio", icon: Music2, filterKey: "dj_studio" },
  { label: "Radio Studio", icon: Headphones, filterKey: "radio_studio" },
  { label: "Events Calendar", icon: Calendar, filterKey: "events_calendar" },
  { label: "News Hub", icon: NewsIcon, filterKey: "news_hub" },
];

// Community Channels
const communityChannels: ChannelItem[] = [
  { label: "Shopping Channel", icon: Store, filterKey: "my_store" },
  { label: "Open Mic", icon: Users, filterKey: "open_mic" },
  { label: "GBV Support", icon: Heart, filterKey: "gbv_support" },
];

// Youth Jobs Channel - Separate from Community
const jobsChannels: ChannelItem[] = [
  { label: "Youth Jobs", icon: Briefcase, filterKey: "youth_jobs" },
];

const studioMixItems: NavItem[] = [
  { label: "Podcast Studio", to: "/podcast-studio", icon: Mic },
  { label: "Music Studio", to: "/dj-studio", icon: Music2 },
  { label: "Radio Station", to: "/radio-studio", icon: Headphones },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [studiosOpen, setStudiosOpen] = useState(false);
  const [proOpen, setProOpen] = useState(true);
  const [freeChannelsOpen, setFreeChannelsOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string, end?: boolean) => {
    if (end) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const NavLink = ({ item, onClick }: { item: NavItem; onClick?: () => void }) => (
    <Link
      to={item.to}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
        isActive(item.to, item.end)
          ? "bg-primary/20 text-primary"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      <item.icon className="h-5 w-5" />
      <span className="font-medium">{item.label}</span>
    </Link>
  );

  // Handle channel click - navigate to /home with channel filter
  const handleChannelClick = (channel: ChannelItem) => {
    navigate(`/home?channel=${channel.filterKey}`);
    setOpen(false);
  };

  const ChannelButton = ({ item }: { item: ChannelItem }) => {
    const searchParams = new URLSearchParams(location.search);
    const activeChannel = searchParams.get("channel");
    const isChannelActive = activeChannel === item.filterKey;

    return (
      <button
        onClick={() => handleChannelClick(item)}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left",
          isChannelActive
            ? "bg-primary/20 text-primary"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        )}
      >
        <item.icon className="h-5 w-5" />
        <span className="font-medium">{item.label}</span>
      </button>
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] bg-card border-border p-0">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center text-primary-foreground font-bold text-sm">
              S
            </div>
            <span className="font-bold text-foreground">SUPA<span className="text-muted-foreground">view</span></span>
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-[calc(100vh-80px)] overflow-y-auto">
          {/* Search - Mobile compact */}
          <div className="p-3 border-b border-border">
            <GlobalSearch size="sm" className="w-full justify-start" />
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {/* Free Navigation Section */}
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2">Free</p>
            {freeItems.map((item) => (
              <NavLink key={item.to} item={item} onClick={() => setOpen(false)} />
            ))}

            {/* Studio Mix Group - For creators to manage */}
            <Collapsible open={studiosOpen} onOpenChange={setStudiosOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                <div className="flex items-center gap-3">
                  <Mic className="h-5 w-5" />
                  <span className="font-medium">Free Studios</span>
                </div>
                {studiosOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-4 space-y-1 mt-1">
                {studioMixItems.map((item) => (
                  <NavLink key={item.to} item={item} onClick={() => setOpen(false)} />
                ))}
              </CollapsibleContent>
            </Collapsible>

            {/* PRO Channels Section - Shows aggregated content */}
            <div className="mt-4">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider px-4 py-2 flex items-center gap-2">
                Pro Channels
                <span className="text-[10px] text-cyan-400 font-normal">7 day trial</span>
              </p>
              <Collapsible open={proOpen} onOpenChange={setProOpen} defaultOpen>
                <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors border border-primary/30 bg-primary/5">
                  <div className="flex items-center gap-3">
                    <Crown className="h-5 w-5 text-primary" />
                    <span className="font-medium">Browse Pro Content</span>
                  </div>
                  {proOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 space-y-1 mt-1">
                  {proChannels.map((item) => (
                    <ChannelButton key={item.filterKey} item={item} />
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* FREE Channels Section */}
            <div className="mt-4">
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider px-4 py-2">Free Channels</p>
              <Collapsible open={freeChannelsOpen} onOpenChange={setFreeChannelsOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors border border-emerald-500/30 bg-emerald-500/5">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-emerald-400" />
                    <span className="font-medium">Browse Free Content</span>
                  </div>
                  {freeChannelsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 space-y-1 mt-1">
                  {freeChannels.map((item) => (
                    <ChannelButton key={item.filterKey} item={item} />
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Community Channels Section */}
            <div className="mt-4">
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider px-4 py-2">Community</p>
              <Collapsible open={communityOpen} onOpenChange={setCommunityOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors border border-amber-500/30 bg-amber-500/5">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-amber-400" />
                    <span className="font-medium">Browse Community</span>
                  </div>
                  {communityOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 space-y-1 mt-1">
                  {communityChannels.map((item) => (
                    <ChannelButton key={item.filterKey} item={item} />
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Youth Jobs Section - Separate Channel */}
            <div className="mt-4">
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider px-4 py-2">Employment</p>
              {jobsChannels.map((item) => (
                <ChannelButton key={item.filterKey} item={item} />
              ))}
            </div>

            {/* Profile Link */}
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors border mt-4",
                isActive("/profile")
                  ? "bg-primary/20 text-primary border-primary/50"
                  : "text-muted-foreground border-border hover:bg-secondary hover:text-foreground"
              )}
            >
              <User className="h-5 w-5" />
              <span className="font-medium">My Profile</span>
            </Link>

            {/* Admin Link */}
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors border mt-1",
                isActive("/admin")
                  ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
                  : "text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10"
              )}
            >
              <Shield className="h-5 w-5" />
              <span className="font-medium">Admin</span>
            </Link>
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-border space-y-3">
            <Button
              asChild
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-semibold"
            >
              <Link to="/pricing" onClick={() => setOpen(false)}>
                <Crown className="h-4 w-4 mr-2" />
                Upgrade
              </Link>
            </Button>
            <div className="flex justify-center">
              <LoginModal size="default" />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
