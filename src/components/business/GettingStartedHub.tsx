import { useState } from "react";
import { 
  Rocket, 
  CheckCircle2, 
  Store, 
  User, 
  Settings, 
  ImagePlus, 
  Phone,
  Upload,
  Trash2,
  MessageSquare,
  Wallet,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Send,
  Mail,
  ExternalLink,
  Package,
  ShoppingCart,
  Percent,
  FileText,
  Truck,
  Tag,
  ArrowRight,
  Edit,
  Eye,
  DollarSign,
  RefreshCw,
  Users,
  Sparkles,
  Camera,
  MapPin,
  Globe,
  Shield,
  Clock,
  Receipt,
  CreditCard,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useNavigate } from "react-router-dom";
import CustomerSupportSection from "./CustomerSupportSection";

interface GettingStartedHubProps {
  hasLogo: boolean;
  hasContactDetails: boolean;
  hasProducts: boolean;
  storeLink: string;
  onTabChange: (tab: string) => void;
}

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  action: () => void;
}

// Workflow step component with numbered badge
function WorkflowStep({ 
  number, 
  title, 
  subtitle, 
  icon: Icon, 
  color,
  showArrow = true 
}: { 
  number: number; 
  title: string; 
  subtitle: string; 
  icon: React.ElementType; 
  color: string;
  showArrow?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`relative flex items-center gap-3 p-3 rounded-lg flex-1 ${color}`}>
        <Icon className="h-5 w-5 shrink-0" />
        <div className="flex-1">
          <p className="font-semibold text-sm">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <div className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xs shadow-lg shrink-0">
          {number}
        </div>
      </div>
      {showArrow && (
        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
      )}
    </div>
  );
}

// Detailed instruction step
function InstructionStep({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
        {number}
      </div>
      <div className="text-sm flex-1">{children}</div>
    </div>
  );
}

// Tip box component
function TipBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
      <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
      <p className="text-xs text-amber-300">{children}</p>
    </div>
  );
}

export default function GettingStartedHub({
  hasLogo,
  hasContactDetails,
  hasProducts,
  storeLink,
  onTabChange,
}: GettingStartedHubProps) {
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    overview: true,
    brand: false,
    products: false,
    orders: false,
    discounts: false,
    policies: false,
    shipping: false,
    tickets: false,
  });
  const [showSupport, setShowSupport] = useState(false);

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const checklistItems: ChecklistItem[] = [
    {
      id: "logo",
      label: "Upload your logo",
      completed: hasLogo,
      action: () => navigate("/profile"),
    },
    {
      id: "contact",
      label: "Set contact details",
      completed: hasContactDetails,
      action: () => onTabChange("settings"),
    },
    {
      id: "product",
      label: "Add your first product",
      completed: hasProducts,
      action: () => onTabChange("products"),
    },
    {
      id: "share",
      label: "Share your store link",
      completed: false,
      action: () => {
        navigator.clipboard.writeText(storeLink);
      },
    },
  ];

  if (showSupport) {
    return (
      <CustomerSupportSection onBack={() => setShowSupport(false)} />
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Rocket className="h-10 w-10 text-emerald-400" />
          <h1 className="text-3xl font-bold text-foreground">Getting Started Guide</h1>
        </div>
        <p className="text-muted-foreground">
          Your complete guide to setting up and managing your SUPAView store
        </p>
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
          Step-by-step instructions for beginners
        </Badge>
      </div>

      {/* Quick Start Checklist */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            Quick Start Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {checklistItems.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                  item.completed
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-card/30 border-border/50 hover:border-primary/50"
                }`}
              >
                <CheckCircle2
                  className={`h-5 w-5 ${
                    item.completed ? "text-emerald-400" : "text-muted-foreground"
                  }`}
                />
                <span className={item.completed ? "text-emerald-400" : "text-foreground"}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 1: Workflow Overview */}
      <Collapsible open={openSections.overview} onOpenChange={() => toggleSection("overview")}>
        <Card className="bg-card/50 border-border/50">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-card/80 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20">
                    <Store className="h-5 w-5 text-emerald-400" />
                  </div>
                  <span>Business Hub Workflow Overview</span>
                </div>
                {openSections.overview ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Your journey from setup to selling - follow these steps in order:
              </p>
              <div className="space-y-2">
                <WorkflowStep 
                  number={1} 
                  title="Brand Your Store" 
                  subtitle="Logo, name & contact details" 
                  icon={Store}
                  color="bg-blue-500/10 border border-blue-500/30"
                />
                <WorkflowStep 
                  number={2} 
                  title="Add Products" 
                  subtitle="Upload up to 500 products" 
                  icon={Package}
                  color="bg-emerald-500/10 border border-emerald-500/30"
                />
                <WorkflowStep 
                  number={3} 
                  title="Set Policies" 
                  subtitle="Returns, refunds & privacy" 
                  icon={FileText}
                  color="bg-purple-500/10 border border-purple-500/30"
                />
                <WorkflowStep 
                  number={4} 
                  title="Configure Shipping" 
                  subtitle="Delivery partners & rates" 
                  icon={Truck}
                  color="bg-orange-500/10 border border-orange-500/30"
                />
                <WorkflowStep 
                  number={5} 
                  title="Create Discounts" 
                  subtitle="Promo codes & sales" 
                  icon={Percent}
                  color="bg-pink-500/10 border border-pink-500/30"
                />
                <WorkflowStep 
                  number={6} 
                  title="Start Selling" 
                  subtitle="Manage orders & customers" 
                  icon={ShoppingCart}
                  color="bg-amber-500/10 border border-amber-500/30"
                  showArrow={false}
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Section 2: Brand Your Store */}
      <Collapsible open={openSections.brand} onOpenChange={() => toggleSection("brand")}>
        <Card className="bg-card/50 border-border/50">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-card/80 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Store className="h-5 w-5 text-blue-400" />
                  </div>
                  <span>Step 1: Brand Your Store</span>
                  <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xs">1</div>
                </div>
                {openSections.brand ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              {/* Visual mockup */}
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b border-border">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">Profile Page</span>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute -left-2 -top-2">
                        <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-[10px]">1</div>
                      </div>
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-primary">
                        <Camera className="h-6 w-6 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="relative inline-block">
                        <div className="absolute -right-2 -top-2">
                          <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-[10px]">2</div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span>Email</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span>Phone</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
                      <MessageSquare className="h-3 w-3 text-emerald-500" />
                      <span>WhatsApp</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span>Location</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                <InstructionStep number={1}>
                  <p><strong>Go to Profile Page</strong> - Click "Profile" in the sidebar menu or use the button below</p>
                </InstructionStep>
                <InstructionStep number={2}>
                  <p><strong>Click "Edit Profile"</strong> - Opens the profile editor modal</p>
                </InstructionStep>
                <InstructionStep number={3}>
                  <p><strong>Upload Your Logo</strong> - Click the camera icon → Select JPG or PNG image (recommended: 200x200px)</p>
                </InstructionStep>
                <InstructionStep number={4}>
                  <p><strong>Set Your Store Name</strong> - Enter your business/brand name (e.g., "My Fashion Store")</p>
                </InstructionStep>
                <InstructionStep number={5}>
                  <p><strong>Add Contact Details</strong> - Fill in email, phone, WhatsApp number, and physical location</p>
                </InstructionStep>
              </div>

              <TipBox>
                Your logo appears on invoices, receipts, and your public store page. Use a square image for best results.
              </TipBox>

              <Button 
                onClick={() => navigate("/profile")}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <User className="h-4 w-4 mr-2" />
                Go to Profile Page
              </Button>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Section 3: Add Products */}
      <Collapsible open={openSections.products} onOpenChange={() => toggleSection("products")}>
        <Card className="bg-card/50 border-border/50">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-card/80 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20">
                    <Package className="h-5 w-5 text-emerald-400" />
                  </div>
                  <span>Step 2: Add Products</span>
                  <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xs">2</div>
                </div>
                {openSections.products ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              {/* Visual mockup */}
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b border-border">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">Business Hub - Products Tab</span>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">My Products (0/500)</span>
                    <div className="relative flex items-center gap-2">
                      <div className="absolute -left-3 -top-1">
                        <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-[10px]">1</div>
                      </div>
                      <Button size="sm" className="ml-4 bg-emerald-600">
                        <Upload className="h-4 w-4 mr-1" />
                        Add Product
                      </Button>
                      <ArrowRight className="h-4 w-4 text-red-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 rounded border border-dashed border-border bg-muted/30 text-center">
                      <ImagePlus className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                      <p className="text-[10px] text-muted-foreground">Product Image</p>
                    </div>
                    <div className="p-2 rounded border border-dashed border-border bg-muted/30 text-center">
                      <Tag className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                      <p className="text-[10px] text-muted-foreground">Price & Stock</p>
                    </div>
                    <div className="p-2 rounded border border-dashed border-border bg-muted/30 text-center">
                      <FileText className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                      <p className="text-[10px] text-muted-foreground">Description</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product types */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <Package className="h-5 w-5 text-blue-400 mb-2" />
                  <h4 className="font-semibold text-sm">Physical Products</h4>
                  <p className="text-xs text-muted-foreground">Items that need shipping (clothes, electronics, food)</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <Globe className="h-5 w-5 text-purple-400 mb-2" />
                  <h4 className="font-semibold text-sm">Digital Products</h4>
                  <p className="text-xs text-muted-foreground">Downloadable items (eBooks, templates, courses)</p>
                </div>
              </div>

              {/* Instructions */}
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                <InstructionStep number={1}>
                  <p><strong>Click "Add Product"</strong> - Opens the product creation form</p>
                </InstructionStep>
                <InstructionStep number={2}>
                  <p><strong>Upload Product Images</strong> - Add up to 5 photos per product (first image is the main one)</p>
                </InstructionStep>
                <InstructionStep number={3}>
                  <p><strong>Enter Product Details</strong> - Name, description, category, and SKU code</p>
                </InstructionStep>
                <InstructionStep number={4}>
                  <p><strong>Set Pricing</strong> - Regular price, sale price (optional), and stock quantity</p>
                </InstructionStep>
                <InstructionStep number={5}>
                  <p><strong>Choose Product Type</strong> - Physical (requires shipping) or Digital (instant download)</p>
                </InstructionStep>
                <InstructionStep number={6}>
                  <p><strong>Publish or Save Draft</strong> - Make it live immediately or save for later</p>
                </InstructionStep>
              </div>

              <TipBox>
                You can upload up to 500 products and generate up to 50 AI-powered product images using our built-in tools.
              </TipBox>

              <Button 
                onClick={() => onTabChange("products")}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                <Package className="h-4 w-4 mr-2" />
                Go to Products
              </Button>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Section 4: Set Policies */}
      <Collapsible open={openSections.policies} onOpenChange={() => toggleSection("policies")}>
        <Card className="bg-card/50 border-border/50">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-card/80 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <FileText className="h-5 w-5 text-purple-400" />
                  </div>
                  <span>Step 3: Set Store Policies</span>
                  <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xs">3</div>
                </div>
                {openSections.policies ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              {/* Policy types */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-card/50 border border-border">
                  <RefreshCw className="h-5 w-5 text-blue-400 mb-2" />
                  <h4 className="font-semibold text-sm">Return Policy</h4>
                  <p className="text-xs text-muted-foreground">How customers can return items</p>
                </div>
                <div className="p-3 rounded-lg bg-card/50 border border-border">
                  <Wallet className="h-5 w-5 text-amber-400 mb-2" />
                  <h4 className="font-semibold text-sm">Refund Policy</h4>
                  <p className="text-xs text-muted-foreground">When and how refunds are processed</p>
                </div>
                <div className="p-3 rounded-lg bg-card/50 border border-border">
                  <Shield className="h-5 w-5 text-emerald-400 mb-2" />
                  <h4 className="font-semibold text-sm">Privacy Policy</h4>
                  <p className="text-xs text-muted-foreground">How customer data is handled</p>
                </div>
                <div className="p-3 rounded-lg bg-card/50 border border-border">
                  <FileText className="h-5 w-5 text-purple-400 mb-2" />
                  <h4 className="font-semibold text-sm">Terms of Service</h4>
                  <p className="text-xs text-muted-foreground">Legal terms for using your store</p>
                </div>
              </div>

              {/* Instructions */}
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                <InstructionStep number={1}>
                  <p><strong>Go to Policies Tab</strong> - Click "Policies" in the Business Hub sidebar</p>
                </InstructionStep>
                <InstructionStep number={2}>
                  <p><strong>Click "Edit"</strong> on each policy type to customize it</p>
                </InstructionStep>
                <InstructionStep number={3}>
                  <p><strong>Use Templates</strong> - We provide pre-written templates you can customize</p>
                </InstructionStep>
                <InstructionStep number={4}>
                  <p><strong>Save & Publish</strong> - Policies are automatically displayed on your store</p>
                </InstructionStep>
              </div>

              <TipBox>
                Clear policies build customer trust. State your return window (e.g., 30 days), refund processing time, and any exceptions.
              </TipBox>

              <Button 
                onClick={() => onTabChange("policies")}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                Go to Policies
              </Button>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Section 5: Configure Shipping */}
      <Collapsible open={openSections.shipping} onOpenChange={() => toggleSection("shipping")}>
        <Card className="bg-card/50 border-border/50">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-card/80 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/20">
                    <Truck className="h-5 w-5 text-orange-400" />
                  </div>
                  <span>Step 4: Configure Shipping</span>
                  <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xs">4</div>
                </div>
                {openSections.shipping ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              {/* Visual mockup */}
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b border-border">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">Business Hub - Shipping Tab</span>
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-orange-400" />
                      <span className="text-sm">The Courier Guy</span>
                    </div>
                    <Badge variant="outline" className="text-xs">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-orange-400" />
                      <span className="text-sm">Pudo Lockers</span>
                    </div>
                    <Badge variant="outline" className="text-xs">Available</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-orange-400" />
                      <span className="text-sm">Self Collection</span>
                    </div>
                    <Badge variant="outline" className="text-xs text-emerald-400">Active</Badge>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                <InstructionStep number={1}>
                  <p><strong>Go to Shipping Tab</strong> - Click "Shipping" in the Business Hub sidebar</p>
                </InstructionStep>
                <InstructionStep number={2}>
                  <p><strong>Add Shipping Partners</strong> - Connect with courier services like The Courier Guy, Pudo, etc.</p>
                </InstructionStep>
                <InstructionStep number={3}>
                  <p><strong>Set Shipping Rates</strong> - Flat rate, weight-based, or free shipping thresholds</p>
                </InstructionStep>
                <InstructionStep number={4}>
                  <p><strong>Enable Self Collection</strong> - Let customers pick up orders from your location</p>
                </InstructionStep>
                <InstructionStep number={5}>
                  <p><strong>Create Waybills</strong> - Generate shipping labels directly from orders</p>
                </InstructionStep>
              </div>

              <TipBox>
                Offer multiple shipping options. Customers love having choices between fast delivery and budget-friendly options.
              </TipBox>

              <Button 
                onClick={() => onTabChange("shipping")}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                <Truck className="h-4 w-4 mr-2" />
                Go to Shipping
              </Button>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Section 6: Create Discounts */}
      <Collapsible open={openSections.discounts} onOpenChange={() => toggleSection("discounts")}>
        <Card className="bg-card/50 border-border/50">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-card/80 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-pink-500/20">
                    <Percent className="h-5 w-5 text-pink-400" />
                  </div>
                  <span>Step 5: Create Discount Codes</span>
                  <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xs">5</div>
                </div>
                {openSections.discounts ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              {/* Discount types */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-pink-500/10 border border-pink-500/30">
                  <Percent className="h-5 w-5 text-pink-400 mb-2" />
                  <h4 className="font-semibold text-sm">Percentage Off</h4>
                  <p className="text-xs text-muted-foreground">e.g., 20% off entire order</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <DollarSign className="h-5 w-5 text-emerald-400 mb-2" />
                  <h4 className="font-semibold text-sm">Fixed Amount</h4>
                  <p className="text-xs text-muted-foreground">e.g., R50 off orders over R200</p>
                </div>
              </div>

              {/* Instructions */}
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                <InstructionStep number={1}>
                  <p><strong>Go to Discounts Tab</strong> - Click "Discounts" in the Business Hub sidebar</p>
                </InstructionStep>
                <InstructionStep number={2}>
                  <p><strong>Click "Create Discount"</strong> - Opens the discount code creation form</p>
                </InstructionStep>
                <InstructionStep number={3}>
                  <p><strong>Set Code Name</strong> - Create a memorable code (e.g., SUMMER20, WELCOME10)</p>
                </InstructionStep>
                <InstructionStep number={4}>
                  <p><strong>Choose Discount Type</strong> - Percentage off or fixed amount</p>
                </InstructionStep>
                <InstructionStep number={5}>
                  <p><strong>Set Validity Period</strong> - Start date, end date, and usage limits</p>
                </InstructionStep>
                <InstructionStep number={6}>
                  <p><strong>Share with Customers</strong> - Promote on social media, email, or your store banner</p>
                </InstructionStep>
              </div>

              <TipBox>
                Use discount codes to attract first-time buyers (WELCOME10) or reward loyal customers with exclusive offers.
              </TipBox>

              <Button 
                onClick={() => onTabChange("discounts")}
                className="w-full bg-pink-600 hover:bg-pink-700"
              >
                <Percent className="h-4 w-4 mr-2" />
                Go to Discounts
              </Button>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Section 7: Manage Orders */}
      <Collapsible open={openSections.orders} onOpenChange={() => toggleSection("orders")}>
        <Card className="bg-card/50 border-border/50">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-card/80 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/20">
                    <ShoppingCart className="h-5 w-5 text-amber-400" />
                  </div>
                  <span>Step 6: Manage Orders</span>
                  <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xs">6</div>
                </div>
                {openSections.orders ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              {/* Order status flow */}
              <div className="rounded-xl border border-border bg-card p-4">
                <h4 className="font-semibold text-sm mb-3 text-center">Order Status Flow</h4>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <Receipt className="h-4 w-4 text-amber-400" />
                    </div>
                    <span className="text-muted-foreground">New</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="text-muted-foreground">Processing</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <Truck className="h-4 w-4 text-orange-400" />
                    </div>
                    <span className="text-muted-foreground">Shipped</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    </div>
                    <span className="text-muted-foreground">Delivered</span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                <InstructionStep number={1}>
                  <p><strong>Go to Orders Tab</strong> - Click "Orders" in the Business Hub sidebar</p>
                </InstructionStep>
                <InstructionStep number={2}>
                  <p><strong>View New Orders</strong> - See incoming orders with customer details and items</p>
                </InstructionStep>
                <InstructionStep number={3}>
                  <p><strong>Update Status</strong> - Mark orders as Processing → Shipped → Delivered</p>
                </InstructionStep>
                <InstructionStep number={4}>
                  <p><strong>Generate Waybills</strong> - Create shipping labels for courier pickup</p>
                </InstructionStep>
                <InstructionStep number={5}>
                  <p><strong>Process Refunds</strong> - Handle returns and issue refunds when needed</p>
                </InstructionStep>
                <InstructionStep number={6}>
                  <p><strong>Track Performance</strong> - View order analytics and revenue reports</p>
                </InstructionStep>
              </div>

              <TipBox>
                Process orders quickly! Fast shipping leads to positive reviews and repeat customers.
              </TipBox>

              <Button 
                onClick={() => onTabChange("orders")}
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Go to Orders
              </Button>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Section 8: Customer Support */}
      <Collapsible open={openSections.tickets} onOpenChange={() => toggleSection("tickets")}>
        <Card className="bg-card/50 border-border/50">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-card/80 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/20">
                    <MessageSquare className="h-5 w-5 text-cyan-400" />
                  </div>
                  <span>Customer Communication</span>
                </div>
                {openSections.tickets ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              {/* Communication methods */}
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-card/50 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-emerald-400" />
                    <h4 className="font-semibold text-sm">WhatsApp Button (Instant)</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Customers click the green "WhatsApp" button on your store → Opens WhatsApp app → They message you directly
                  </p>
                </div>
                
                <div className="p-3 rounded-lg bg-card/50 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-purple-400" />
                    <h4 className="font-semibold text-sm">Product Inquiry Form</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    On each product, customers can click "Ask a Question" → Fill form → You see it in My Business → Inquiries
                  </p>
                </div>
                
                <div className="p-3 rounded-lg bg-card/50 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-blue-400" />
                    <h4 className="font-semibold text-sm">Email Contact</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your email is displayed on your store → Customers can click to email you directly
                  </p>
                </div>
                
                <div className="p-3 rounded-lg bg-card/50 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <HelpCircle className="h-4 w-4 text-amber-400" />
                    <h4 className="font-semibold text-sm">Support Tickets</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Customers can submit support tickets for order issues, returns, and general inquiries
                  </p>
                </div>
              </div>

              <TipBox>
                Respond to customer inquiries within 24 hours for best results. Quick responses build trust and increase sales.
              </TipBox>

              <Button 
                onClick={() => onTabChange("tickets")}
                className="w-full bg-cyan-600 hover:bg-cyan-700"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                View Customer Tickets
              </Button>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Need More Help */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-6 text-center space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Need More Help?</h3>
          <p className="text-muted-foreground">Contact SUPAView support for assistance</p>
          <div className="flex items-center justify-center gap-3">
            <Button
              onClick={() => setShowSupport(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Customer Support
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/profile")}
              className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
            >
              <User className="h-4 w-4 mr-2" />
              Go to Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
