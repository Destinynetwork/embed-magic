import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Wifi, Store, BarChart3, Sparkles } from "lucide-react";

interface FreeTierOverviewProps {
  onTabChange: (tab: string) => void;
}

const SERVICES = [
  {
    icon: Video,
    title: "Free Embed",
    desc: "Embed URLs to create 100 video assets with channel organization.",
    features: ["100 video assets", "Channel organization", "10 AI images/month"],
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  {
    icon: Wifi,
    title: "Live Stream",
    desc: "Stream live to YouTube, Twitch, Facebook, TikTok and more.",
    features: ["Free live streaming", "Up to 10 guests", "OBS integration"],
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
  {
    icon: Store,
    title: "My Business Hub",
    desc: "Create your store in minutes with full dashboard access.",
    features: ["500 products", "Custom branding", "Order management"],
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  {
    icon: BarChart3,
    title: "Creator Dashboard",
    desc: "Manage events, track earnings, and your audience CRM.",
    features: ["100 tickets/month", "Earnings & payouts", "Full CRM access"],
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
  },
];

export function FreeTierOverview({ onTabChange }: FreeTierOverviewProps) {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-amber-900/20 border border-purple-500/20 p-8 md:p-10">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-4">
          100% FREE
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Everything You Need to Start
        </h2>
        <p className="text-muted-foreground max-w-xl mb-6">
          Access powerful community services at no cost. From video embedding to
          business management, we're here to empower your digital presence.
        </p>
        <div className="flex items-center gap-4">
          <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
            <Sparkles className="h-4 w-4" />
            Browse Creators
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            Learn More
          </Button>
        </div>
      </div>

      {/* Services Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-foreground">Explore Our Services</h3>
          <span className="flex items-center gap-2 text-sm text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            All services are 100% free
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICES.map((svc) => (
            <Card
              key={svc.title}
              className={`border ${svc.borderColor} bg-card/50 hover:bg-card/80 transition-colors cursor-pointer`}
              onClick={() => {
                const tabMap: Record<string, string> = {
                  "Free Embed": "free-embed",
                  "Live Stream": "live-stream",
                  "My Business Hub": "business-hub",
                  "Creator Dashboard": "creator-dashboard",
                };
                onTabChange(tabMap[svc.title] || "overview");
              }}
            >
              <CardContent className="p-5">
                <div className={`w-12 h-12 rounded-xl ${svc.bgColor} flex items-center justify-center mb-4`}>
                  <svc.icon className={`h-6 w-6 ${svc.color}`} />
                </div>
                <h4 className="font-semibold text-foreground mb-2">{svc.title}</h4>
                <p className="text-sm text-muted-foreground mb-4">{svc.desc}</p>
                <ul className="space-y-2">
                  {svc.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className={`w-1.5 h-1.5 rounded-full ${svc.color.replace("text-", "bg-")}`} />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
