import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles, Video, Wifi, Store, BarChart3, Home, LogIn,
  BookOpen, HelpCircle, Settings2, ShoppingCart
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FreeTierOverview } from "@/components/free-tier/FreeTierOverview";
import { FreeTierFreeEmbed } from "@/components/free-tier/FreeTierFreeEmbed";
import { FreeTierLiveStream } from "@/components/free-tier/FreeTierLiveStream";
import { FreeTierLiveStudio } from "@/components/free-tier/FreeTierLiveStudio";
import { FreeTierBusinessHub } from "@/components/free-tier/FreeTierBusinessHub";
import { FreeTierCreatorDashboard } from "@/components/free-tier/FreeTierCreatorDashboard";
import { FreeTierUserGuide } from "@/components/free-tier/FreeTierUserGuide";
import { FreeTierHelpSupport } from "@/components/free-tier/FreeTierHelpSupport";
import { FreeTierComparePlans } from "@/components/free-tier/FreeTierComparePlans";

const SERVICE_BUTTONS = [
  { label: "Free Embed", icon: Video, color: "text-amber-400 border-amber-500/50 hover:bg-amber-500/10" },
  { label: "Live Stream", icon: Wifi, color: "text-red-400 border-red-500/50 hover:bg-red-500/10" },
  { label: "My Business Hub", icon: Store, color: "text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/10" },
  { label: "Creator Dashboard", icon: BarChart3, color: "text-cyan-400 border-cyan-500/50 hover:bg-cyan-500/10" },
];

const TABS = [
  { id: "overview", label: "Overview", icon: Sparkles },
  { id: "free-embed", label: "Free Embed", icon: Video },
  { id: "live-stream", label: "Live Stream", icon: Wifi },
  { id: "live-studio", label: "Live Studio", icon: Settings2 },
  { id: "business-hub", label: "Business Hub", icon: Store },
  { id: "creator-dashboard", label: "Creator Dashboard", icon: BarChart3 },
  { id: "user-guide", label: "User Guide", icon: BookOpen },
  { id: "help-support", label: "Help & Support", icon: HelpCircle },
  { id: "compare-plans", label: "Compare Plans", icon: Settings2 },
];

const TAB_TO_SERVICE: Record<string, string> = {
  "Free Embed": "free-embed",
  "Live Stream": "live-stream",
  "My Business Hub": "business-hub",
  "Creator Dashboard": "creator-dashboard",
};

export default function FreeTierHub() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  const handleUpgrade = async () => {
    setUpgradeLoading(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        navigate("/signin");
        return;
      }
      const { data, error } = await supabase.functions.invoke("create-payfast-payment", {
        body: {
          email: authUser.email,
          return_url: `${window.location.origin}/pricing?status=success`,
          cancel_url: `${window.location.origin}/pricing?status=cancelled`,
        },
      });
      if (error) throw error;
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.payfast_url;
      for (const [key, value] of Object.entries(data.payment_data)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      }
      document.body.appendChild(form);
      form.submit();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setUpgradeLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <div className="border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">FREE Tier</h1>
                <p className="text-sm text-muted-foreground">Community services at no cost</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="default"
                size="sm"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                onClick={handleUpgrade}
                disabled={upgradeLoading}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {upgradeLoading ? "Processing..." : "Buy Embed Pro"}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
              {!user && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                  onClick={() => navigate("/signin")}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>

          {/* Service Quick Buttons */}
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <span className="text-sm text-muted-foreground">Free Services:</span>
            {SERVICE_BUTTONS.map((svc) => (
              <Button
                key={svc.label}
                variant="outline"
                size="sm"
                className={`gap-2 ${svc.color}`}
                onClick={() => setActiveTab(TAB_TO_SERVICE[svc.label] || "overview")}
              >
                <svc.icon className="h-4 w-4" />
                {svc.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border/30 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-1 py-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-primary/20 text-primary border border-primary/40"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-6">
        {activeTab === "overview" && <FreeTierOverview onTabChange={setActiveTab} />}
        {activeTab === "free-embed" && <FreeTierFreeEmbed />}
        {activeTab === "live-stream" && <FreeTierLiveStream />}
        {activeTab === "live-studio" && <FreeTierLiveStudio />}
        {activeTab === "business-hub" && <FreeTierBusinessHub />}
        {activeTab === "creator-dashboard" && <FreeTierCreatorDashboard />}
        {activeTab === "user-guide" && <FreeTierUserGuide />}
        {activeTab === "help-support" && <FreeTierHelpSupport />}
        {activeTab === "compare-plans" && <FreeTierComparePlans />}
      </div>
    </div>
  );
}
