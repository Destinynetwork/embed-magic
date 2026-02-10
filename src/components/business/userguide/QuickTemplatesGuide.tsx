import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Store, ShoppingBag, Truck, Tag, Package, Crown,
  Clock, ChevronDown, ChevronRight, CheckCircle2, Circle, Lightbulb,
  Play, FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

export const BUSINESS_TEMPLATES = [
  {
    tier: "Starter",
    name: "Solo Vendor",
    description: "Single product store with basic settings. Perfect first store.",
    setupMinutes: 10,
    icon: Store,
    requirements: ["Product photos", "Pricing information", "Contact details"],
    steps: [
      { id: "settings", label: "Configure store settings", description: "Add store name, email, phone, and WhatsApp number" },
      { id: "kyc", label: "Complete KYC verification", description: "Upload bank letter and wait for admin approval" },
      { id: "product", label: "Add your first product", description: "Create a listing with title, description, price, and images" },
      { id: "policies", label: "Set up store policies", description: "Add refund, shipping, and privacy policies" },
      { id: "share", label: "Share your store link", description: "Copy your profile link and share it with customers" },
    ],
    tips: [
      "Use clear, well-lit product photos for best results",
      "Keep product titles short and descriptive",
      "Add your WhatsApp number so customers can reach you easily",
    ],
  },
  {
    tier: "Starter",
    name: "Product Catalogue",
    description: "Multi-product store with categories and organised listings.",
    setupMinutes: 20,
    icon: Package,
    requirements: ["Multiple product images", "Category plan", "Stock counts"],
    steps: [
      { id: "settings", label: "Complete store setup", description: "Fill in all store settings including GPS coordinates" },
      { id: "categories", label: "Plan product categories", description: "Decide how to organise your products (e.g., Clothing, Electronics)" },
      { id: "products", label: "Add products per category", description: "Create 5–10 initial listings with consistent formatting" },
      { id: "inventory", label: "Set stock quantities", description: "Track inventory for each product" },
      { id: "policies", label: "Configure all policies", description: "Refund, return, shipping, privacy, and T&Cs" },
    ],
    tips: [
      "AI can generate category images for you — use the tool when creating products",
      "Consistent product photo style makes your store look professional",
      "Start with your best-selling items to build momentum",
    ],
  },
  {
    tier: "Growth",
    name: "Discount Marketer",
    description: "Drive sales with coupon codes, seasonal promotions, and loyalty rewards.",
    setupMinutes: 15,
    icon: Tag,
    requirements: ["Active products", "Discount strategy", "Customer contacts"],
    steps: [
      { id: "products", label: "Ensure products are listed", description: "You need active products before running promotions" },
      { id: "codes", label: "Create discount codes", description: "Set up percentage or fixed-amount coupons" },
      { id: "seasonal", label: "Plan seasonal campaigns", description: "Black Friday, holiday sales, launch specials" },
      { id: "loyalty", label: "Set up loyalty discounts", description: "Reward repeat customers with exclusive codes" },
      { id: "share", label: "Distribute codes", description: "Share via WhatsApp, social media, or email" },
    ],
    tips: [
      "Limit coupon uses to create urgency",
      "Use expiry dates to drive quick action",
      "Track which codes perform best and double down",
    ],
  },
  {
    tier: "Growth",
    name: "Fulfilment Pro",
    description: "Streamlined order processing with shipping partners and waybills.",
    setupMinutes: 25,
    icon: Truck,
    requirements: ["Shipping partner accounts", "Packaging supplies", "Process plan"],
    steps: [
      { id: "shipping", label: "Add shipping companies", description: "Register your delivery partners (e.g., The Courier Guy, Pargo)" },
      { id: "rates", label: "Configure shipping rates", description: "Set flat-rate or weight-based pricing" },
      { id: "workflow", label: "Define order workflow", description: "Pending → Confirmed → Packed → Shipped → Delivered" },
      { id: "waybills", label: "Set up waybill generation", description: "Generate tracking numbers and waybills for each order" },
      { id: "tracking", label: "Enable customer tracking", description: "Share tracking numbers with buyers via email/WhatsApp" },
    ],
    tips: [
      "Pack orders within 24 hours for best customer satisfaction",
      "Always confirm orders before preparing shipments",
      "Keep waybill records for dispute resolution",
    ],
  },
  {
    tier: "Scale",
    name: "Business Empire",
    description: "Full-scale e-commerce operation with analytics and customer management.",
    setupMinutes: 45,
    icon: Crown,
    requirements: ["Large product catalogue", "Dedicated team", "Growth strategy"],
    steps: [
      { id: "catalogue", label: "Build full catalogue", description: "50+ products across multiple categories" },
      { id: "automation", label: "Streamline fulfilment", description: "Shipping templates, waybill batches, and status tracking" },
      { id: "marketing", label: "Launch marketing campaigns", description: "Discount codes, seasonal promotions, and loyalty rewards" },
      { id: "support", label: "Set up customer support", description: "Support ticket workflow and FAQ management" },
      { id: "analytics", label: "Monitor performance", description: "Track sales, top products, and customer trends" },
      { id: "scale", label: "Plan for growth", description: "Expand product range, optimise pricing, hire help" },
    ],
    tips: [
      "Review sales data weekly to spot trends",
      "Respond to support tickets within 24 hours",
      "Reinvest profits into inventory and marketing",
    ],
  },
];

interface TemplateDetailProps {
  template: (typeof BUSINESS_TEMPLATES)[0];
  isExpanded: boolean;
  onToggle: () => void;
  completedSteps: string[];
  onStepToggle: (stepId: string) => void;
}

function TemplateDetail({ template, isExpanded, onToggle, completedSteps, onStepToggle }: TemplateDetailProps) {
  const Icon = template.icon;
  const tierColors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    Starter: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
      badge: "bg-emerald-500/20 border-emerald-500/50 text-emerald-400",
    },
    Growth: {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/30",
      text: "text-cyan-400",
      badge: "bg-cyan-500/20 border-cyan-500/50 text-cyan-400",
    },
    Scale: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/30",
      text: "text-purple-400",
      badge: "bg-purple-500/20 border-purple-500/50 text-purple-400",
    },
  };

  const colors = tierColors[template.tier] ?? tierColors.Starter;
  const completedCount = template.steps.filter((s) => completedSteps.includes(s.id)).length;
  const progress = (completedCount / template.steps.length) * 100;

  return (
    <Card className={cn("border-2 transition-all", colors.border, isExpanded && colors.bg)}>
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={cn("p-2 rounded-lg", colors.bg)}>
                  <Icon className={cn("h-5 w-5", colors.text)} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge className={colors.badge}>{template.tier}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {template.setupMinutes} min
                  </div>
                  {completedCount > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {completedCount}/{template.steps.length} steps
                    </div>
                  )}
                </div>
                {isExpanded ? <ChevronDown className="h-5 w-5 text-muted-foreground" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
              </div>
            </div>
            {completedCount > 0 && (
              <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className={cn("h-full transition-all duration-300", colors.text.replace("text-", "bg-"))} style={{ width: `${progress}%` }} />
              </div>
            )}
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-6">
            {/* Requirements */}
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                What You'll Need
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {template.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Circle className="h-2 w-2 fill-current" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps */}
            <div>
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Play className="h-4 w-4" />
                Step-by-Step Setup ({completedCount}/{template.steps.length} completed)
              </h4>
              <div className="space-y-2">
                {template.steps.map((step, idx) => {
                  const isCompleted = completedSteps.includes(step.id);
                  return (
                    <div
                      key={step.id}
                      className={cn(
                        "p-3 rounded-lg border transition-all cursor-pointer",
                        isCompleted ? "bg-emerald-500/10 border-emerald-500/30" : "bg-card border-border hover:border-primary/50"
                      )}
                      onClick={() => onStepToggle(step.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2 pt-0.5">
                          <span
                            className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                              isCompleted ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                            )}
                          >
                            {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                          </span>
                        </div>
                        <div>
                          <p className={cn("text-sm font-medium", isCompleted && "line-through text-muted-foreground")}>{step.label}</p>
                          <p className="text-xs text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tips */}
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                Pro Tips
              </h4>
              <ul className="space-y-1">
                {template.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export function BusinessQuickTemplatesGuide() {
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => (prev.includes(stepId) ? prev.filter((s) => s !== stepId) : [...prev, stepId]));
  };

  const grouped = {
    Starter: BUSINESS_TEMPLATES.filter((t) => t.tier === "Starter"),
    Growth: BUSINESS_TEMPLATES.filter((t) => t.tier === "Growth"),
    Scale: BUSINESS_TEMPLATES.filter((t) => t.tier === "Scale"),
  };

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([tier, templates]) => (
        <div key={tier}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Badge
              className={cn(
                tier === "Starter" && "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
                tier === "Growth" && "bg-cyan-500/20 text-cyan-400 border-cyan-500/50",
                tier === "Scale" && "bg-purple-500/20 text-purple-400 border-purple-500/50"
              )}
            >
              {tier}
            </Badge>
            <span className="text-muted-foreground text-sm font-normal">
              {tier === "Starter" && "— Get your store running"}
              {tier === "Growth" && "— Drive sales and streamline fulfilment"}
              {tier === "Scale" && "— Full e-commerce operation"}
            </span>
          </h3>
          <div className="space-y-4">
            {templates.map((template) => (
              <TemplateDetail
                key={template.name}
                template={template}
                isExpanded={expandedTemplate === template.name}
                onToggle={() => setExpandedTemplate(expandedTemplate === template.name ? null : template.name)}
                completedSteps={completedSteps}
                onStepToggle={toggleStep}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
