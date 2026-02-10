import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  Truck,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  Store,
  BookOpen,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import GettingStartedHub from "@/components/business/GettingStartedHub";
import ProductsManager from "@/components/business/ProductsManager";
import DiscountCodesManager from "@/components/business/DiscountCodesManager";
import OrdersManager from "@/components/business/OrdersManager";
import WaybillManager from "@/components/business/WaybillManager";
import ShippingCompaniesManager from "@/components/business/ShippingCompaniesManager";
import PoliciesManager from "@/components/business/PoliciesManager";
import TicketsManager from "@/components/business/TicketsManager";
import BusinessHubHelpSupport from "@/components/business/BusinessHubHelpSupport";
import { BusinessHubUserGuide } from "@/components/business/userguide/BusinessHubUserGuide";
import { toast } from "sonner";

export default function FreeBusinessHub() {
  const navigate = useNavigate();
  const { profile, isDemoMode, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    // In a real implementation, we would fetch the user's business ID
    // For now, we'll use the profile ID or a demo ID
    if (profile) {
      setBusinessId(profile.id);
    } else if (isDemoMode) {
      setBusinessId("demo-business-id");
    }
  }, [profile, isDemoMode]);

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "discounts", label: "Discounts", icon: Tag },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "waybills", label: "Waybills", icon: FileText },
    { id: "support", label: "Support Tickets", icon: HelpCircle },
    { id: "policies", label: "Store Policies", icon: FileText },
    { id: "guide", label: "User Guide", icon: BookOpen },
    { id: "settings", label: "Store Settings", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <GettingStartedHub onNavigate={setActiveTab} />;
      case "products":
        return <ProductsManager businessId={businessId} demoMode={isDemoMode} />;
      case "discounts":
        return <DiscountCodesManager businessId={businessId} demoMode={isDemoMode} />;
      case "orders":
        return <OrdersManager businessId={businessId} demoMode={isDemoMode} />;
      case "shipping":
        return <ShippingCompaniesManager businessId={businessId} demoMode={isDemoMode} />;
      case "waybills":
        return <WaybillManager businessId={businessId} demoMode={isDemoMode} />;
      case "support":
        return <TicketsManager businessId={businessId} demoMode={isDemoMode} />;
      case "policies":
        return <PoliciesManager businessId={businessId} demoMode={isDemoMode} />;
      case "guide":
        return <BusinessHubUserGuide />;
      case "settings":
        return (
          <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground">
            <Settings className="h-16 w-16 mb-4 opacity-20" />
            <h2 className="text-xl font-semibold mb-2">Store Settings</h2>
            <p>Store profile and configuration coming soon.</p>
          </div>
        );
      default:
        return <GettingStartedHub onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-card/50 hidden md:flex flex-col">
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-2 font-bold text-xl text-foreground">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Store className="h-5 w-5 text-emerald-500" />
            </div>
            Business Hub
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
                  activeTab === item.id ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" : ""
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border/50 space-y-2">
          <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate("/free")}>
            <ArrowLeft className="h-4 w-4" />
            Back to Free Tier
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground" onClick={() => logout()}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-border bg-card/50 flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold capitalize">
            {sidebarItems.find(i => i.id === activeTab)?.label || "Dashboard"}
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setHelpOpen(true)}>
              <HelpCircle className="h-4 w-4 mr-2" />
              Help & Support
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-muted/10">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      <BusinessHubHelpSupport 
        open={helpOpen} 
        onOpenChange={setHelpOpen} 
        profileId={businessId}
      />
    </div>
  );
}
