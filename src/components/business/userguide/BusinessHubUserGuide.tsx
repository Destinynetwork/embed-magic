import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BookOpen,
  Download,
  Loader2,
  Zap,
  Package,
  ShoppingBag,
  Truck,
  HeadphonesIcon,
  HelpCircle,
  Store,
  Tag,
  FileText,
  Shield,
  Settings,
  CheckCircle2,
} from "lucide-react";
import { useBusinessPdfGenerator } from "./useBusinessPdfGenerator";
import { GuideOverview } from "./GuideOverview";
import { BusinessQuickTemplatesGuide } from "./QuickTemplatesGuide";

// Visual section header
function SectionHeader({
  icon: Icon,
  title,
  description,
  gradient,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className={`mb-6 rounded-xl overflow-hidden border border-border shadow-lg bg-gradient-to-br ${gradient} p-8`}>
      <div className="flex items-center gap-4">
        <div className="p-4 rounded-xl bg-black/20 backdrop-blur-sm">
          <Icon className="h-10 w-10 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-white/80 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}

export function BusinessHubUserGuide() {
  const [activeTab, setActiveTab] = useState("templates");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const { generatePdf } = useBusinessPdfGenerator();

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await generatePdf();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
        <div>
          <CardTitle className="text-xl text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-400" />
            Business Hub User Guide
          </CardTitle>
          <p className="text-sm text-foreground/80 mt-1">
            Step-by-step guide to setting up and running your store
          </p>
        </div>
        <Button
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className="gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
        >
          {isGeneratingPdf ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Download PDF Guide
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="templates" className="gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Templates</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <Truck className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="marketing" className="gap-2">
              <Tag className="h-4 w-4" />
              <span className="hidden sm:inline">Marketing</span>
            </TabsTrigger>
            <TabsTrigger value="overview" className="gap-2 hidden lg:flex">
              <BookOpen className="h-4 w-4" />
              <span>Full Guide</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="gap-2 hidden lg:flex">
              <HelpCircle className="h-4 w-4" />
              <span>FAQ</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="mt-6">
            <BusinessQuickTemplatesGuide />
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <ProductsGuide />
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <OrdersGuide />
          </TabsContent>

          <TabsContent value="marketing" className="mt-6">
            <MarketingGuide />
          </TabsContent>

          <TabsContent value="overview" className="mt-6">
            <GuideOverview />
          </TabsContent>

          <TabsContent value="faq" className="mt-6">
            <FAQGuide />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// ---------- Products Guide ----------
function ProductsGuide() {
  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Package}
        title="Products & Catalog"
        description="Create, manage, and organise your product listings"
        gradient="from-emerald-600 to-emerald-800"
      />

      <div className="grid md:grid-cols-2 gap-6">
        <GuideCard
          icon={Package}
          title="Adding Products"
          color="text-emerald-400"
          items={[
            "Navigate to the Products tab",
            "Click 'Add Product' to create a listing",
            "Enter title, description, and price (ZAR)",
            "Upload product images (clear, well-lit photos)",
            "Set stock quantity and category",
          ]}
        />
        <GuideCard
          icon={ShoppingBag}
          title="Product Categories"
          color="text-emerald-400"
          items={[
            "Use AI to generate category images automatically",
            "Group similar products for easy browsing",
            "Set main category and sub-category",
            "Categories appear on your storefront",
          ]}
        />
        <GuideCard
          icon={Settings}
          title="Inventory Management"
          color="text-emerald-400"
          items={[
            "Track stock levels for each product",
            "Get alerts when stock runs low",
            "Update quantities after restocking",
            "Archive products that are out of stock",
          ]}
        />
        <GuideCard
          icon={Shield}
          title="Product Limits"
          color="text-emerald-400"
          items={[
            "Free Tier: Up to 500 active products",
            "50 AI-generated images per month",
            "Monitor usage on the Dashboard tab",
            "Progress bars show remaining capacity",
          ]}
        />
      </div>
    </div>
  );
}

// ---------- Orders Guide ----------
function OrdersGuide() {
  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Truck}
        title="Orders & Fulfilment"
        description="Process orders, manage shipping, and track deliveries"
        gradient="from-cyan-600 to-cyan-800"
      />

      <div className="grid md:grid-cols-2 gap-6">
        <GuideCard
          icon={ShoppingBag}
          title="Order Processing"
          color="text-cyan-400"
          items={[
            "New orders appear as 'Pending'",
            "Review order details and confirm",
            "Pack the items and prepare for shipping",
            "Update status: Confirmed → Packed → Shipped",
            "Mark as Delivered once received",
          ]}
        />
        <GuideCard
          icon={Truck}
          title="Shipping Companies"
          color="text-cyan-400"
          items={[
            "Add your delivery partners in the Shipping tab",
            "Configure rates (flat or weight-based)",
            "Assign a shipping company when fulfilling orders",
            "Supported: The Courier Guy, Pargo, DPD, custom",
          ]}
        />
        <GuideCard
          icon={FileText}
          title="Waybills & Tracking"
          color="text-cyan-400"
          items={[
            "Generate waybills from the Waybills tab",
            "Each waybill gets a unique tracking number",
            "Share tracking with customers via WhatsApp",
            "Keep records for dispute resolution",
          ]}
        />
        <GuideCard
          icon={HeadphonesIcon}
          title="Support Tickets"
          color="text-cyan-400"
          items={[
            "Customers can raise support tickets",
            "Tickets flow: Open → In Progress → Resolved",
            "Respond promptly for best satisfaction",
            "Track open ticket count on Dashboard",
          ]}
        />
      </div>
    </div>
  );
}

// ---------- Marketing Guide ----------
function MarketingGuide() {
  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Tag}
        title="Marketing & Sales"
        description="Grow revenue with discount codes and promotions"
        gradient="from-purple-600 to-purple-800"
      />

      <div className="grid md:grid-cols-2 gap-6">
        <GuideCard
          icon={Tag}
          title="Discount Codes"
          color="text-purple-400"
          items={[
            "Navigate to the Discounts tab",
            "Create percentage or fixed-amount coupons",
            "Set usage limits and expiry dates",
            "Codes apply automatically at checkout",
          ]}
        />
        <GuideCard
          icon={Store}
          title="Store Branding"
          color="text-purple-400"
          items={[
            "Upload a store logo in Store Settings",
            "Add your physical address and GPS coordinates",
            "Configure WhatsApp for customer inquiries",
            "Your profile link becomes your storefront URL",
          ]}
        />
        <GuideCard
          icon={FileText}
          title="Store Policies"
          color="text-purple-400"
          items={[
            "Go to the Policies tab to set up your terms",
            "Privacy Policy — how you handle customer data",
            "Refund Policy — conditions for refunds",
            "Shipping Policy — delivery times and costs",
            "Terms of Service — general store rules",
          ]}
        />
        <GuideCard
          icon={CheckCircle2}
          title="KYC Verification"
          color="text-purple-400"
          items={[
            "Required before you can process payments",
            "Upload a bank confirmation letter",
            "Admin reviews and approves your store",
            "Once verified, your store is unlocked for sales",
          ]}
        />
      </div>
    </div>
  );
}

// ---------- FAQ Guide ----------
function FAQGuide() {
  const faqs = [
    {
      q: "How do I start selling?",
      a: "Complete the Getting Started checklist: add your store details, upload a bank letter for KYC, add at least one product, and wait for admin verification.",
    },
    {
      q: "What are the product limits?",
      a: "Free Tier allows up to 500 active products and 50 AI-generated category images per month. Monitor your usage on the Dashboard tab.",
    },
    {
      q: "How does payment work?",
      a: "Payments are processed via PayFast in South African Rand (ZAR). You must complete KYC verification before receiving payouts.",
    },
    {
      q: "Can I offer discounts?",
      a: "Yes! Go to the Discounts tab to create coupon codes with percentage or fixed-amount discounts, usage limits, and expiry dates.",
    },
    {
      q: "How do I handle shipping?",
      a: "Add your shipping partners in the Shipping tab, then generate waybills for each order in the Waybills tab. Share tracking numbers with customers.",
    },
    {
      q: "What if my store is locked?",
      a: "Your store is locked until KYC verification is complete. Upload your bank confirmation letter and wait for admin approval.",
    },
    {
      q: "How do support tickets work?",
      a: "Customers submit tickets from your storefront. You can view and respond in the Support Tickets tab. Aim to resolve within 24 hours.",
    },
    {
      q: "Can I add store policies?",
      a: "Yes. The Policies tab lets you add Privacy, Refund, Shipping, Return, and Terms of Service policies. Pre-written templates are available.",
    },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={HelpCircle}
        title="Frequently Asked Questions"
        description="Quick answers to common Business Hub questions"
        gradient="from-emerald-600 to-cyan-700"
      />

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <Card key={idx} className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                {faq.q}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------- Reusable Card ----------
function GuideCard({
  icon: Icon,
  title,
  color,
  items,
}: {
  icon: React.ElementType;
  title: string;
  color: string;
  items: string[];
}) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className={`h-4 w-4 ${color}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="text-sm text-muted-foreground space-y-1">
          {items.map((item, idx) => (
            <li key={idx}>• {item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
