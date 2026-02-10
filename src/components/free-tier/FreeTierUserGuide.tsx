import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Download, LayoutGrid, HelpCircle, Video, Wifi, Store, BarChart3 } from "lucide-react";

const TEMPLATES = [
  {
    icon: Video,
    title: "YouTube Embed",
    desc: "Embed YouTube videos with custom channel organization",
    category: "Free Embed",
    categoryColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    tags: ["Direct URL embed", "Playlist support", "Auto-thumbnails"],
    steps: 6,
    completed: 0,
  },
  {
    icon: Video,
    title: "Vimeo Embed",
    desc: "Embed Vimeo videos with professional presentation",
    category: "Free Embed",
    categoryColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    tags: ["HD embedding", "Privacy controls", "Custom thumbnails"],
    steps: 6,
    completed: 0,
  },
  {
    icon: Wifi,
    title: "YouTube Live Stream",
    desc: "Stream live to YouTube using OBS",
    category: "Live Stream",
    categoryColor: "bg-red-500/20 text-red-400 border-red-500/30",
    iconBg: "bg-red-500/10",
    iconColor: "text-red-400",
    tags: ["RTMP support", "Guest invites", "Chat overlay"],
    steps: 6,
    completed: 0,
  },
  {
    icon: Wifi,
    title: "Twitch Stream",
    desc: "Stream to Twitch with guest collaboration",
    category: "Live Stream",
    categoryColor: "bg-red-500/20 text-red-400 border-red-500/30",
    iconBg: "bg-red-500/10",
    iconColor: "text-red-400",
    tags: ["Multi-platform", "Low latency", "Guest rooms"],
    steps: 6,
    completed: 0,
  },
  {
    icon: Store,
    title: "Quick Store Setup",
    desc: "Create your online store in minutes",
    category: "Business Hub",
    categoryColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    tags: ["Store branding", "Payment setup", "Product listing"],
    steps: 6,
    completed: 0,
  },
  {
    icon: Store,
    title: "Product Catalog",
    desc: "Organize and manage your product inventory",
    category: "Business Hub",
    categoryColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    tags: ["Categories", "Bulk upload", "Pricing tiers"],
    steps: 6,
    completed: 0,
  },
  {
    icon: BarChart3,
    title: "Event Creation",
    desc: "Create and sell tickets for your events",
    category: "Creator Dashboard",
    categoryColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-400",
    tags: ["Ticket types", "Pricing", "Attendee tracking"],
    steps: 6,
    completed: 0,
  },
  {
    icon: BarChart3,
    title: "Audience CRM",
    desc: "Manage your audience and subscriber base",
    category: "Creator Dashboard",
    categoryColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-400",
    tags: ["Subscriber list", "Analytics", "Engagement"],
    steps: 6,
    completed: 0,
  },
  {
    icon: Video,
    title: "Playlist Builder",
    desc: "Create and organize video playlists",
    category: "Free Embed",
    categoryColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    tags: ["Drag & drop", "Auto-play", "Custom order"],
    steps: 6,
    completed: 0,
  },
];

export function FreeTierUserGuide() {
  const [activeTab, setActiveTab] = useState("templates");

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
              <Button variant="outline" className="gap-2 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-card/50">
          <TabsTrigger value="templates" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <LayoutGrid className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="full-guide" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Full Guide
          </TabsTrigger>
          <TabsTrigger value="faq" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
        </TabsList>

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
            {TEMPLATES.map((t) => (
              <Card key={t.title} className="border-border/50 hover:border-border transition-colors cursor-pointer">
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
                  <div className="flex flex-wrap gap-1 mb-4">
                    {t.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-muted/50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{t.completed} of {t.steps} steps</span>
                    <span>{Math.round((t.completed / t.steps) * 100)}%</span>
                  </div>
                  <Progress value={(t.completed / t.steps) * 100} className="h-1 mt-1" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="full-guide" className="mt-6">
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-bold text-foreground mb-2">Full Guide</h3>
              <p>The complete 108-page guide covering all Free Tier services in detail.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="mt-6">
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-bold text-foreground mb-2">Frequently Asked Questions</h3>
              <p>Common questions about Free Tier services answered.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
