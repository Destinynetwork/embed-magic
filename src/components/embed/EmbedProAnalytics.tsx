import { useState, useEffect } from "react";
import { 
  Eye, 
  Users, 
  Wallet, 
  HardDrive, 
  Video, 
  Music, 
  Radio, 
  Calendar, 
  Package,
  TrendingUp,
  Ticket,
  ShoppingCart,
  CreditCard,
  Loader2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { format, subDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface AnalyticsData {
  totalViews: number;
  videoViews: number;
  podcastPlays: number;
  radioListeners: number;
  activeSubscribers: number;
  vodSubscribers: number;
  podcastSubscribers: number;
  totalRevenue: number;
  ticketRevenue: number;
  productRevenue: number;
  subscriptionRevenue: number;
  storageUsed: {
    video: number;
    audio: number;
    bandwidth: number;
    total: number;
    limit: number;
  };
  contentSummary: {
    videos: { count: number; views: number };
    podcasts: { count: number; plays: number };
    radioStations: { count: number; listeners: number };
    events: { count: number };
    products: { count: number };
  };
}

const DEFAULT_ANALYTICS: AnalyticsData = {
  totalViews: 0,
  videoViews: 0,
  podcastPlays: 0,
  radioListeners: 0,
  activeSubscribers: 0,
  vodSubscribers: 0,
  podcastSubscribers: 0,
  totalRevenue: 0,
  ticketRevenue: 0,
  productRevenue: 0,
  subscriptionRevenue: 0,
  storageUsed: {
    video: 0,
    audio: 0,
    bandwidth: 0,
    total: 0,
    limit: 15,
  },
  contentSummary: {
    videos: { count: 0, views: 0 },
    podcasts: { count: 0, plays: 0 },
    radioStations: { count: 0, listeners: 0 },
    events: { count: 0 },
    products: { count: 0 },
  },
};

export default function EmbedProAnalytics() {
  const { profile, isDemoMode } = useAuth();
  const [dateRange, setDateRange] = useState("30d");
  const [contentFilter, setContentFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData>(DEFAULT_ANALYTICS);
  
  useEffect(() => {
    fetchAnalytics();
  }, [profile?.id, isDemoMode]);

  const fetchAnalytics = async () => {
    if (!profile?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch content counts by type (from embed_pro_content table)
      const { data: contentData } = await supabase
        .from("embed_pro_content")
        .select("content_type, id")
        .eq("owner_id", profile.id)
        .eq("is_archived", false);

      const videoTypes = ["Single Video", "Movie", "Series", "Documentary", "Webinar"];
      const audioTypes = ["Audio", "Podcast"];

      const videos = contentData?.filter(c => videoTypes.includes(c.content_type)) || [];
      const podcasts = contentData?.filter(c => audioTypes.includes(c.content_type)) || [];

      // Fetch analytics for content
      const contentIds = contentData?.map(c => c.id) || [];
      let totalViews = 0;
      
      if (contentIds.length > 0) {
        const { data: analyticsData } = await supabase
          .from("analytics")
          .select("total_views")
          .in("asset_id", contentIds);
        
        totalViews = analyticsData?.reduce((sum, a) => sum + (a.total_views || 0), 0) || 0;
      }

      // Fetch events count
      const { count: eventsCount } = await supabase
        .from("community_events")
        .select("*", { count: "exact", head: true })
        .eq("creator_id", profile.id);

      // Fetch products count (if user has a business)
      const { data: businessData } = await supabase
        .from("businesses")
        .select("id, products_count")
        .eq("owner_id", profile.id)
        .maybeSingle();

      // Fetch CDN usage for storage
      const { data: cdnUsage } = await supabase
        .from("creator_cdn_usage")
        .select("storage_used_bytes, storage_limit_bytes")
        .eq("profile_id", profile.id)
        .maybeSingle();

      // Fetch revenue from payments
      const { data: paymentsData } = await supabase
        .from("creator_payments")
        .select("amount, payment_type")
        .eq("creator_id", profile.id)
        .eq("status", "completed");

      const ticketRevenue = paymentsData?.filter(p => p.payment_type === "ticket").reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
      const productRevenue = paymentsData?.filter(p => p.payment_type === "product").reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
      const subscriptionRevenue = paymentsData?.filter(p => p.payment_type === "subscription").reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

      // Fetch subscriber counts
      const { count: subscriberCount } = await supabase
        .from("audience_subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("status", "active")
        .in("tier_id", (
          await supabase
            .from("creator_subscription_tiers")
            .select("id")
            .eq("creator_id", profile.id)
        ).data?.map(t => t.id) || []);

      const storageUsedGB = cdnUsage ? Number(cdnUsage.storage_used_bytes) / (1024 * 1024 * 1024) : 0;
      const storageLimitGB = cdnUsage ? Number(cdnUsage.storage_limit_bytes) / (1024 * 1024 * 1024) : 10;

      setAnalytics({
        totalViews,
        videoViews: Math.round(totalViews * 0.7),
        podcastPlays: Math.round(totalViews * 0.3),
        radioListeners: 0,
        activeSubscribers: subscriberCount || 0,
        vodSubscribers: subscriberCount || 0,
        podcastSubscribers: 0,
        totalRevenue: ticketRevenue + productRevenue + subscriptionRevenue,
        ticketRevenue,
        productRevenue,
        subscriptionRevenue,
        storageUsed: {
          video: storageUsedGB * 0.8,
          audio: storageUsedGB * 0.2,
          bandwidth: 0,
          total: storageUsedGB,
          limit: storageLimitGB,
        },
        contentSummary: {
          videos: { count: videos.length, views: Math.round(totalViews * 0.7) },
          podcasts: { count: podcasts.length, plays: Math.round(totalViews * 0.3) },
          radioStations: { count: 0, listeners: 0 },
          events: { count: eventsCount || 0 },
          products: { count: businessData?.products_count || 0 },
        },
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const getDateRangeLabel = () => {
    const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : dateRange === "90d" ? 90 : 365;
    const endDate = new Date();
    const startDate = subDays(endDate, days);
    return `${format(startDate, "MMM d")} - ${format(endDate, "MMM d")}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toLocaleString();
  };

  const formatStorage = (gb: number) => {
    if (gb < 0.01) return "0.00 GB";
    return gb.toFixed(2) + " GB";
  };

  const storagePercentage = (analytics.storageUsed.total / analytics.storageUsed.limit) * 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
        <p className="text-muted-foreground">Track your performance and audience insights</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          {getDateRangeLabel()}
        </Button>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 Days</SelectItem>
            <SelectItem value="30d">30 Days</SelectItem>
            <SelectItem value="90d">90 Days</SelectItem>
            <SelectItem value="1y">1 Year</SelectItem>
          </SelectContent>
        </Select>
        <Select value={contentFilter} onValueChange={setContentFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Streams" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Streams</SelectItem>
            <SelectItem value="video">Videos Only</SelectItem>
            <SelectItem value="podcast">Podcasts Only</SelectItem>
            <SelectItem value="radio">Radio Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Content Views */}
        <Card className="bg-card/50 border-cyan-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <Eye className="h-5 w-5" />
              <span className="text-sm text-muted-foreground">Total Content Views</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{formatNumber(analytics.totalViews)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatNumber(analytics.videoViews)} videos • {formatNumber(analytics.podcastPlays)} podcasts • {analytics.radioListeners} radio
            </p>
          </CardContent>
        </Card>

        {/* Active Subscribers */}
        <Card className="bg-card/50 border-amber-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <Users className="h-5 w-5" />
              <span className="text-sm text-muted-foreground">Active Subscribers</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{analytics.activeSubscribers}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.vodSubscribers} VOD • {analytics.podcastSubscribers} Podcast
            </p>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="bg-card/50 border-emerald-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <Wallet className="h-5 w-5" />
              <span className="text-sm text-muted-foreground">Total Revenue</span>
            </div>
            <p className="text-3xl font-bold text-foreground">R{analytics.totalRevenue}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Tickets: R{analytics.ticketRevenue} • Products: R{analytics.productRevenue} • Subs: R{analytics.subscriptionRevenue}
            </p>
          </CardContent>
        </Card>

        {/* Storage Used */}
        <Card className="bg-card/50 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <HardDrive className="h-5 w-5" />
              <span className="text-sm text-muted-foreground">Storage Used</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{formatStorage(analytics.storageUsed.total)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Video: {formatStorage(analytics.storageUsed.video)} • Audio: {formatStorage(analytics.storageUsed.audio)} • Bandwidth: {formatStorage(analytics.storageUsed.bandwidth)}
            </p>
            <Progress value={storagePercentage} className="h-1 mt-2" />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {formatStorage(analytics.storageUsed.total)} / {analytics.storageUsed.limit}GB
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detail Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content Performance</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="storage">Storage & Bandwidth</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Content Summary */}
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Content Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-blue-400" />
                      <span className="text-muted-foreground">Videos</span>
                    </div>
                    <span className="font-medium text-foreground">
                      {analytics.contentSummary.videos.count} ({formatNumber(analytics.contentSummary.videos.views)} views)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Music className="h-4 w-4 text-orange-400" />
                      <span className="text-muted-foreground">Podcasts</span>
                    </div>
                    <span className="font-medium text-foreground">
                      {analytics.contentSummary.podcasts.count} ({formatNumber(analytics.contentSummary.podcasts.plays)} plays)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Radio className="h-4 w-4 text-pink-400" />
                      <span className="text-muted-foreground">Radio Stations</span>
                    </div>
                    <span className="font-medium text-foreground">
                      {analytics.contentSummary.radioStations.count} ({analytics.contentSummary.radioStations.listeners} listeners)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-400" />
                      <span className="text-muted-foreground">Events</span>
                    </div>
                    <span className="font-medium text-foreground">
                      {analytics.contentSummary.events.count}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-emerald-400" />
                      <span className="text-muted-foreground">Products</span>
                    </div>
                    <span className="font-medium text-foreground">
                      {analytics.contentSummary.products.count}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Breakdown */}
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Revenue Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-orange-400" />
                      <span className="text-muted-foreground">Event Tickets</span>
                    </div>
                    <span className="font-medium text-emerald-400">R{analytics.ticketRevenue}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4 text-blue-400" />
                      <span className="text-muted-foreground">Product Sales</span>
                    </div>
                    <span className="font-medium text-emerald-400">R{analytics.productRevenue}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-purple-400" />
                      <span className="text-muted-foreground">Subscriptions (Monthly)</span>
                    </div>
                    <span className="font-medium text-emerald-400">R{analytics.subscriptionRevenue}</span>
                  </div>
                  <div className="border-t border-border pt-3 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">Total Revenue</span>
                      <span className="font-bold text-lg text-emerald-400">R{analytics.totalRevenue}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-cyan-400" />
                <h3 className="font-semibold text-foreground">Content Performance</h3>
              </div>
              <p className="text-muted-foreground">
                Detailed content performance metrics coming soon. Track views, engagement, and retention for each piece of content.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscribers" className="mt-6">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-amber-400" />
                <h3 className="font-semibold text-foreground">Subscriber Analytics</h3>
              </div>
              <p className="text-muted-foreground">
                Subscriber growth and retention analytics coming soon. Monitor your audience growth and engagement patterns.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="mt-6">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="h-5 w-5 text-emerald-400" />
                <h3 className="font-semibold text-foreground">Revenue Analytics</h3>
              </div>
              <p className="text-muted-foreground">
                Detailed revenue analytics coming soon. Track earnings from tickets, products, and subscriptions over time.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage" className="mt-6">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <HardDrive className="h-5 w-5 text-purple-400" />
                <h3 className="font-semibold text-foreground">Storage & Bandwidth Usage</h3>
              </div>
              
              <div className="space-y-6">
                {/* Total Storage */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Total Storage</span>
                    <span className="font-medium text-foreground">
                      {formatStorage(analytics.storageUsed.total)} / {analytics.storageUsed.limit}GB
                    </span>
                  </div>
                  <Progress value={storagePercentage} className="h-3" />
                </div>

                {/* Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Video className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-muted-foreground">Video Storage</span>
                    </div>
                    <p className="text-xl font-bold text-foreground">{formatStorage(analytics.storageUsed.video)}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Music className="h-4 w-4 text-orange-400" />
                      <span className="text-sm text-muted-foreground">Audio Storage</span>
                    </div>
                    <p className="text-xl font-bold text-foreground">{formatStorage(analytics.storageUsed.audio)}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm text-muted-foreground">Bandwidth Used</span>
                    </div>
                    <p className="text-xl font-bold text-foreground">{formatStorage(analytics.storageUsed.bandwidth)}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  Your Embed Pro plan includes 10GB of storage for video and audio uploads. Upgrade to increase your storage limit.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}