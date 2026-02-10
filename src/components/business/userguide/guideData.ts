// Business Hub User Guide Section Data
export interface GuideChapter {
  page: string;
  title: string;
  tier: "Starter" | "Growth" | "Scale" | "All";
  route?: string;
  description?: string;
}

export interface GuideSection {
  part: number;
  title: string;
  pages: string;
  tier: string;
  chapters: GuideChapter[];
}

export const GUIDE_SECTIONS: GuideSection[] = [
  {
    part: 1,
    title: "Getting Started",
    pages: "1–10",
    tier: "All",
    chapters: [
      { page: "1", title: "Welcome to Business Hub", tier: "All" },
      { page: "2–3", title: "Dashboard Overview", tier: "All", route: "dashboard", description: "Stats, quick actions, and tier limits" },
      { page: "4–5", title: "Store Setup Checklist", tier: "All", route: "getting-started", description: "Logo, contact details, first product" },
      { page: "6–7", title: "KYC Verification", tier: "All", description: "Bank letter upload and admin approval" },
      { page: "8–9", title: "Store Settings", tier: "All", route: "settings", description: "Name, address, WhatsApp, coordinates" },
      { page: "10", title: "Free Tier Limits", tier: "All", description: "500 products, 50 AI images/month" },
    ],
  },
  {
    part: 2,
    title: "Products & Catalog",
    pages: "11–22",
    tier: "Starter+",
    chapters: [
      { page: "11–12", title: "Adding Products", tier: "Starter", route: "products", description: "Create listings with images and pricing" },
      { page: "13–14", title: "Product Categories", tier: "Starter", description: "AI-generated category images" },
      { page: "15–16", title: "Inventory Management", tier: "Starter", description: "Stock tracking and variants" },
      { page: "17–18", title: "Product SEO", tier: "Growth", description: "Titles, descriptions, and discoverability" },
      { page: "19–20", title: "Bulk Product Actions", tier: "Growth", description: "Multi-select edit, archive, and delete" },
      { page: "21–22", title: "Product Analytics", tier: "Scale", description: "Views, conversions, and top sellers" },
    ],
  },
  {
    part: 3,
    title: "Orders & Fulfilment",
    pages: "23–34",
    tier: "Starter+",
    chapters: [
      { page: "23–24", title: "Orders Dashboard", tier: "Starter", route: "orders", description: "Pending, confirmed, shipped, delivered" },
      { page: "25–26", title: "Order Processing", tier: "Starter", description: "Confirm, pack, and ship workflow" },
      { page: "27–28", title: "Shipping Companies", tier: "Starter", route: "shipping", description: "Add and manage delivery partners" },
      { page: "29–30", title: "Waybills & Tracking", tier: "Growth", route: "waybills", description: "Generate waybills and tracking numbers" },
      { page: "31–32", title: "Returns & Refunds", tier: "Growth", description: "Handle return requests and issue refunds" },
      { page: "33–34", title: "Fulfilment Analytics", tier: "Scale", description: "Delivery times and customer satisfaction" },
    ],
  },
  {
    part: 4,
    title: "Marketing & Sales",
    pages: "35–44",
    tier: "Growth+",
    chapters: [
      { page: "35–36", title: "Discount Codes", tier: "Growth", route: "discounts", description: "Percentage and fixed-amount coupons" },
      { page: "37–38", title: "Coupon Strategies", tier: "Growth", description: "Seasonal, loyalty, and referral codes" },
      { page: "39–40", title: "Store Branding", tier: "Growth", description: "Logo, colours, and storefront appearance" },
      { page: "41–42", title: "Customer Engagement", tier: "Scale", description: "Repeat buyers and loyalty tracking" },
      { page: "43–44", title: "Sales Reports", tier: "Scale", description: "Monthly revenue and growth trends" },
    ],
  },
  {
    part: 5,
    title: "Support & Policies",
    pages: "45–54",
    tier: "All",
    chapters: [
      { page: "45–46", title: "Support Tickets", tier: "All", route: "tickets", description: "Customer inquiries and issue tracking" },
      { page: "47–48", title: "Ticket Workflow", tier: "All", description: "Open → In Progress → Resolved" },
      { page: "49–50", title: "Store Policies", tier: "All", route: "policies", description: "Privacy, refund, shipping, and T&Cs" },
      { page: "51–52", title: "Policy Templates", tier: "All", description: "Pre-written policies you can customise" },
      { page: "53–54", title: "Help & FAQ", tier: "All", description: "Common questions and troubleshooting" },
    ],
  },
];

export const getTierColor = (tier: string): string => {
  switch (tier) {
    case "Starter":
      return "border-emerald-500/50 text-emerald-400 bg-emerald-500/10";
    case "Growth":
      return "border-cyan-500/50 text-cyan-400 bg-cyan-500/10";
    case "Scale":
      return "border-purple-500/50 text-purple-400 bg-purple-500/10";
    default:
      return "border-foreground/30 text-foreground bg-foreground/5";
  }
};

export const getTierBgColor = (tier: string): string => {
  switch (tier) {
    case "Starter":
      return "#22c55e";
    case "Growth":
      return "#06b6d4";
    case "Scale":
      return "#a855f7";
    default:
      return "#888888";
  }
};
