import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, Download, LayoutGrid, HelpCircle, Video, Wifi, Store, BarChart3, ChevronRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const TEMPLATES = [
  {
    icon: Video, title: "YouTube Embed", desc: "Embed YouTube videos with custom channel organization",
    category: "Free Embed", categoryColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    iconBg: "bg-amber-500/10", iconColor: "text-amber-400",
    tags: ["Direct URL embed", "Playlist support", "Auto-thumbnails"],
    steps: [
      "Go to Free Embed → Add Content",
      "Paste your YouTube video URL",
      "Add a title and select a channel",
      "Choose thumbnail (auto-generated or custom)",
      "Save and preview your embed",
      "Copy the embed code for your website",
    ],
  },
  {
    icon: Video, title: "Vimeo Embed", desc: "Embed Vimeo videos with professional presentation",
    category: "Free Embed", categoryColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    iconBg: "bg-amber-500/10", iconColor: "text-amber-400",
    tags: ["HD embedding", "Privacy controls", "Custom thumbnails"],
    steps: [
      "Go to Free Embed → Add Content",
      "Paste your Vimeo video URL",
      "Configure privacy and display settings",
      "Add custom thumbnail if desired",
      "Save and preview your embed",
      "Copy the embed code for your website",
    ],
  },
  {
    icon: Wifi, title: "YouTube Live Stream", desc: "Stream live to YouTube using OBS",
    category: "Live Stream", categoryColor: "bg-red-500/20 text-red-400 border-red-500/30",
    iconBg: "bg-red-500/10", iconColor: "text-red-400",
    tags: ["RTMP support", "Guest invites", "Chat overlay"],
    steps: [
      "Go to Live Studio → Create Room",
      "Enter your room name",
      "Copy the Host broadcast link",
      "Open OBS and add a Browser Source with the host link",
      "Share guest invite links with co-hosts",
      "Start streaming to YouTube via OBS",
    ],
  },
  {
    icon: Wifi, title: "Twitch Stream", desc: "Stream to Twitch with guest collaboration",
    category: "Live Stream", categoryColor: "bg-red-500/20 text-red-400 border-red-500/30",
    iconBg: "bg-red-500/10", iconColor: "text-red-400",
    tags: ["Multi-platform", "Low latency", "Guest rooms"],
    steps: [
      "Go to Live Studio → Create Room",
      "Enter your room name",
      "Copy the Host broadcast link",
      "Open OBS and add a Browser Source",
      "Configure Twitch stream key in OBS settings",
      "Start streaming with guest collaboration",
    ],
  },
  {
    icon: Store, title: "Quick Store Setup", desc: "Create your online store in minutes",
    category: "Business Hub", categoryColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    iconBg: "bg-emerald-500/10", iconColor: "text-emerald-400",
    tags: ["Store branding", "Payment setup", "Product listing"],
    steps: [
      "Go to Business Hub → Launch Business Hub",
      "Complete the Getting Started checklist",
      "Add your store branding and logo",
      "Configure payment and shipping settings",
      "Add your first products",
      "Publish your store and share the link",
    ],
  },
  {
    icon: Store, title: "Product Catalog", desc: "Organize and manage your product inventory",
    category: "Business Hub", categoryColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    iconBg: "bg-emerald-500/10", iconColor: "text-emerald-400",
    tags: ["Categories", "Bulk upload", "Pricing tiers"],
    steps: [
      "Go to Business Hub → Products tab",
      "Click Add Product",
      "Fill in product name, description, and price",
      "Upload product images",
      "Set stock quantity and SKU",
      "Publish the product to your store",
    ],
  },
  {
    icon: BarChart3, title: "Event Creation", desc: "Create and sell tickets for your events",
    category: "Creator Dashboard", categoryColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    iconBg: "bg-cyan-500/10", iconColor: "text-cyan-400",
    tags: ["Ticket types", "Pricing", "Attendee tracking"],
    steps: [
      "Go to Creator Dashboard → Launch Creator Dashboard",
      "Navigate to My Events tab",
      "Click Create Event",
      "Set event details, date, and ticket pricing",
      "Configure ticket tiers (Adult, Child, Senior, VVIP)",
      "Publish and share your event link",
    ],
  },
  {
    icon: BarChart3, title: "Audience CRM", desc: "Manage your audience and subscriber base",
    category: "Creator Dashboard", categoryColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    iconBg: "bg-cyan-500/10", iconColor: "text-cyan-400",
    tags: ["Subscriber list", "Analytics", "Engagement"],
    steps: [
      "Go to Creator Dashboard → Launch Creator Dashboard",
      "View your Earnings tab for revenue overview",
      "Check Attendees for ticket buyer details",
      "Monitor analytics for audience insights",
      "Track payouts and pending revenue",
      "Export data for external analysis",
    ],
  },
  {
    icon: Video, title: "Playlist Builder", desc: "Create and organize video playlists",
    category: "Free Embed", categoryColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    iconBg: "bg-amber-500/10", iconColor: "text-amber-400",
    tags: ["Drag & drop", "Auto-play", "Custom order"],
    steps: [
      "Go to Free Embed → Playlists",
      "Click Create Playlist",
      "Name your playlist and add a description",
      "Select content from your library to add",
      "Arrange items in your preferred order",
      "Save and share your playlist",
    ],
  },
];

const GUIDE_SECTIONS = [
  {
    title: "Getting Started with Free Tier",
    content: "The Free Tier gives you access to four core services: Free Embed (100 video assets), Live Stream (10-guest rooms), My Business Hub (500 products), and Creator Dashboard (100 tickets/month). All services are completely free with no credit card required.",
  },
  {
    title: "Free Embed — Embedding Videos",
    content: "Embed videos from YouTube, Vimeo, Dailymotion, Spotify, SoundCloud, and direct URLs. Organize content into channels and playlists. You get 10 AI-generated thumbnail images per month. Maximum 100 video assets in your library.",
  },
  {
    title: "Live Stream — Broadcasting Live",
    content: "Create live rooms using VDO.Ninja technology for zero-latency, peer-to-peer streaming. Invite up to 10 guests per room. Use OBS to capture and broadcast to YouTube, Twitch, Facebook, TikTok, or any RTMP destination. No storage needed — all streaming is live.",
  },
  {
    title: "Live Studio — Room Management",
    content: "Create rooms, generate guest invite links, and share audience viewer URLs. Each room gets a unique ID, 10 guest slots, host broadcast link, audience viewer URL, and embeddable iframe code. Share QR codes for easy mobile access.",
  },
  {
    title: "My Business Hub — Online Store",
    content: "Create your online store with up to 500 products. Features include custom branding, product catalog, discount codes, order management, shipping companies, waybill tracking, support tickets, and store policies. Full dashboard with sales analytics.",
  },
  {
    title: "Creator Dashboard — Events & Revenue",
    content: "Manage events, sell up to 100 tickets per month, track earnings and payouts. Features include event creation with multiple ticket tiers (Adult, Child, Senior, VVIP), attendee check-in, revenue breakdown, payout tracking, and audience CRM.",
  },
  {
    title: "Content Limits & Usage",
    content: "Free Tier limits: 100 video assets, 10 AI images/month, 500 products, 100 tickets/month, 10 guests per live room. AI generations are counted monthly — if an AI-generated image is deleted, the usage is not restored.",
  },
  {
    title: "Upgrading to Embed Pro",
    content: "Embed Pro unlocks managed CDN video hosting (Gumlet/Adilo), advanced analytics, content protection, monetization tools, unlimited channels, priority support, and higher limits across all services.",
  },
];

const FAQ_ITEMS = [
  { q: "Is the Free Tier really free?", a: "Yes, 100% free with no credit card required. All four services are available at no cost." },
  { q: "What happens if I hit my limits?", a: "You'll be notified when approaching limits. You can upgrade to Embed Pro for higher limits, or manage your existing content to stay within the free tier." },
  { q: "Can I use my own domain?", a: "Custom domains are available with the Embed Pro plan. Free Tier content is hosted on the platform's default domain." },
  { q: "How do AI-generated images work?", a: "You get 10 AI thumbnail generations per month. Once used, they count toward your monthly limit even if deleted. The counter resets each month." },
  { q: "Is my data secure?", a: "All data is stored securely with row-level security policies. Your content is only accessible to you unless you choose to make it public." },
  { q: "Can I monetize on the Free Tier?", a: "Yes! You can sell event tickets (up to 100/month) via the Creator Dashboard and products via the Business Hub. Platform takes a small processing fee." },
];

export function FreeTierUserGuide() {
  const [activeTab, setActiveTab] = useState("templates");
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);

  const handleDownloadPDF = () => {
    toast.info("PDF download will be available soon. The guide is currently being finalized.");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <Card className="border-purple-500/20 bg-gradient-to-r from-purple-900/20 to-cyan-900/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">FREE Tier User Guide</h2>
                <p className="text-sm text-muted-foreground">Complete guide to all community services</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">108 Pages</Badge>
              <Button
                variant="outline"
                className="gap-2 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10"
                onClick={handleDownloadPDF}
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-card/50">
          <TabsTrigger value="templates" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <LayoutGrid className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="full-guide" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <BookOpen className="h-4 w-4" />
            Full Guide
          </TabsTrigger>
          <TabsTrigger value="faq" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">Quick Start Templates</h3>
              <p className="text-sm text-muted-foreground">Step-by-step guides for each FREE service</p>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              {TEMPLATES.length} Templates
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEMPLATES.map((t) => {
              const isExpanded = expandedTemplate === t.title;
              return (
                <Card
                  key={t.title}
                  className={`border-border/50 transition-colors cursor-pointer ${isExpanded ? "border-primary/40 bg-card/80" : "hover:border-border"}`}
                  onClick={() => setExpandedTemplate(isExpanded ? null : t.title)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg ${t.iconBg} flex items-center justify-center`}>
                        <t.icon className={`h-5 w-5 ${t.iconColor}`} />
                      </div>
                      <Badge variant="outline" className={`text-xs ${t.categoryColor}`}>
                        {t.category}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">{t.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{t.desc}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {t.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-muted/50">{tag}</Badge>
                      ))}
                    </div>

                    {isExpanded ? (
                      <div className="mt-4 space-y-2 border-t border-border/50 pt-4">
                        <h5 className="text-sm font-semibold text-foreground mb-2">Steps:</h5>
                        {t.steps.map((step, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-bold shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            {step}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>0 of {t.steps.length} steps</span>
                          <span className="flex items-center gap-1">
                            View steps <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                        <Progress value={0} className="h-1 mt-1" />
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Full Guide Tab */}
        <TabsContent value="full-guide" className="mt-6">
          <div className="space-y-4">
            <Accordion type="single" collapsible className="space-y-2">
              {GUIDE_SECTIONS.map((section, i) => (
                <AccordionItem key={i} value={`section-${i}`} className="border border-border/50 rounded-lg px-4 bg-card/30">
                  <AccordionTrigger className="text-foreground hover:no-underline">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-bold">
                        {i + 1}
                      </span>
                      {section.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {section.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="mt-6">
          <Accordion type="single" collapsible className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-border/50 rounded-lg px-4 bg-card/30">
                <AccordionTrigger className="text-foreground hover:no-underline">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-4 w-4 text-cyan-400 shrink-0" />
                    {item.q}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  );
}
