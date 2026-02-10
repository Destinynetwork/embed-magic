import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Calendar,
  DollarSign,
  Users,
  Settings,
  ArrowLeft,
  BarChart3,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function FreeCreatorDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "events", label: "Events", icon: Calendar },
    { id: "earnings", label: "Earnings", icon: DollarSign },
    { id: "audience", label: "Audience", icon: Users },
    { id: "payouts", label: "Payouts", icon: CreditCard },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-card/50 hidden md:flex flex-col">
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-2 font-bold text-xl text-foreground">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-cyan-500" />
            </div>
            Creator Dash
          </div>
          <p className="text-xs text-muted-foreground mt-1 ml-10">Free Tier Edition</p>
        </div>

        <ScrollArea className="flex-1 py-4">
          <div className="px-3 space-y-1">
            {sidebarItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  activeTab === item.id ? "bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20" : ""
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border/50">
          <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate("/free")}>
            <ArrowLeft className="h-4 w-4" />
            Back to Free Tier
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-border bg-card/50 flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold capitalize">
            {sidebarItems.find(i => i.id === activeTab)?.label || "Overview"}
          </h1>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-muted/10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground">
              <BarChart3 className="h-16 w-16 mb-4 opacity-20" />
              <h2 className="text-xl font-semibold mb-2">Creator Dashboard</h2>
              <p className="max-w-md text-center">
                The {activeTab} feature is currently being provisioned for your account. 
                Please check back soon for full access to events, earnings, and audience management.
              </p>
              <Button className="mt-6" onClick={() => toast.info("This feature is coming soon!")}>
                Get Notified When Ready
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
