import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import {
  Banknote, TrendingUp, Eye, Video, Wallet, BarChart3, Calendar, Tv,
  DollarSign, CheckCircle, Clock, Ticket, Copy, QrCode, Edit,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmbedProUserGuide } from "@/components/embed/EmbedProUserGuide";

interface EmbedProCreatorDashboardSectionProps {
  profileId: string;
  onBack: () => void;
}

export function EmbedProCreatorDashboardSection({ profileId, onBack }: EmbedProCreatorDashboardSectionProps) {
  const [activeTab, setActiveTab] = useState("earnings");
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalRevenue: 0, pendingPayout: 0, totalViews: 0, ticketsSold: 0,
    totalChannels: 0, totalContent: 0, pendingPayments: 0,
    storageUsed: 0, storageLimit: 25,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profileId) loadData();
  }, [profileId]);

  const loadData = async () => {
    try {
      const [profileRes, channelsRes, contentRes, paymentsRes, cdnRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", profileId).maybeSingle(),
        supabase.from("embed_pro_channels" as any).select("id").eq("owner_id", profileId),
        supabase.from("content_assets").select("id").eq("owner_id", profileId),
        supabase.from("creator_payments").select("amount, status").eq("creator_id", profileId),
        supabase.from("creator_cdn_usage").select("storage_used_bytes, storage_limit_bytes").eq("profile_id", profileId).maybeSingle(),
      ]);

      setProfile(profileRes.data);

      const payments = (paymentsRes.data as any[]) || [];
      const totalRevenue = payments.reduce((s, p) => s + (p.amount || 0), 0);
      const pendingPayout = payments.filter(p => p.status === "pending").reduce((s, p) => s + (p.amount || 0), 0);

      setStats({
        totalRevenue,
        pendingPayout,
        totalViews: 0,
        ticketsSold: 0,
        totalChannels: (channelsRes.data as any[])?.length || 0,
        totalContent: contentRes.data?.length || 0,
        pendingPayments: payments.filter(p => p.status === "pending").length,
        storageUsed: cdnRes.data ? ((cdnRes.data as any).storage_used_bytes || 0) / (1024 * 1024 * 1024) : 0,
        storageLimit: cdnRes.data ? ((cdnRes.data as any).storage_limit_bytes || 0) / (1024 * 1024 * 1024) : 25,
      });
    } catch (err) {
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const displayName = profile?.display_name || profile?.full_name || "Creator";
  const username = profile?.username || "user";
  const tier = profile?.subscription_tier || "free";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Creator Dashboard</h1>
        <p className="text-muted-foreground">Track your earnings, content performance, and pending payouts</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: `R${stats.totalRevenue.toFixed(2).replace(".", ",")}`, sub: "Lifetime earnings from content", icon: DollarSign, color: "text-emerald-400" },
          { label: "Pending Payout", value: `R${stats.pendingPayout.toFixed(2).replace(".", ",")}`, sub: `${stats.pendingPayments} payments pending`, icon: Banknote, color: "text-teal-400" },
          { label: "Total Views", value: `${stats.totalViews}`, sub: `Across ${stats.totalContent} content items`, icon: Eye },
          { label: "Tickets Sold", value: `${stats.ticketsSold}`, sub: "Single purchases", icon: Ticket, color: "text-primary" },
        ].map((s, i) => (
          <Card key={i} className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <s.icon className={`h-4 w-4 ${s.color || "text-muted-foreground"}`} />
              </div>
              <p className={`text-2xl font-bold mt-1 ${s.color || "text-foreground"}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content: Profile sidebar + tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-teal-500/20 to-primary/10 border-border/50">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-primary/30 flex items-center justify-center text-2xl font-bold mx-auto">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xl font-bold">{displayName}</p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <Badge variant="outline" className="gap-1"><Tv className="h-3 w-3" />{tier === "free" ? "Free" : tier}</Badge>
                  <Badge className="bg-primary/20 text-primary border-primary/30">@{username}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Button variant="outline" size="sm" className="gap-1"><Edit className="h-3 w-3" />Edit</Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1"><Copy className="h-3 w-3" />Copy Profile Link</Button>
                <Button variant="outline" size="sm" className="flex-1 gap-1"><QrCode className="h-3 w-3" />QR Code</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Your Subscription</h3>
                <Badge variant="outline" className="gap-1"><Tv className="h-3 w-3" />{tier === "free" ? "Free" : tier}</Badge>
              </div>
              <div className="text-sm space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground">Storage Used</span><span>{stats.storageUsed.toFixed(1)}GB / {stats.storageLimit}GB</span></div>
                <Progress value={(stats.storageUsed / stats.storageLimit) * 100} className="h-2" />
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground font-medium">Plan Features</p>
                {["Adilo VOD Hosting", "Video Analytics", "Lead Capture Forms", "A/B Testing", "Custom Thumbnails", `${stats.storageLimit}GB Storage`].map((f, i) => (
                  <p key={i} className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-emerald-400" />{f}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="bg-card/50 flex-wrap h-auto gap-1">
              <TabsTrigger value="earnings"><BarChart3 className="h-3.5 w-3.5 mr-1" />Earnings</TabsTrigger>
              <TabsTrigger value="events"><Calendar className="h-3.5 w-3.5 mr-1" />My Events</TabsTrigger>
              <TabsTrigger value="content"><Video className="h-3.5 w-3.5 mr-1" />Content</TabsTrigger>
              <TabsTrigger value="payouts"><Wallet className="h-3.5 w-3.5 mr-1" />Payouts</TabsTrigger>
              <TabsTrigger value="channels"><Tv className="h-3.5 w-3.5 mr-1" />My Channels</TabsTrigger>
              <TabsTrigger value="user-guide">User Guide</TabsTrigger>
            </TabsList>

            <TabsContent value="earnings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-card border-border">
                  <CardHeader><CardTitle>Revenue Breakdown</CardTitle><p className="text-sm text-muted-foreground">Your earnings by category</p></CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: "Total Earned", sub: "Before platform fees", value: `R${stats.totalRevenue.toFixed(2).replace(".", ",")}`, icon: DollarSign, color: "text-emerald-400 bg-emerald-500/10" },
                      { label: "Paid Out", sub: "Completed payments", value: `R${(stats.totalRevenue - stats.pendingPayout).toFixed(2).replace(".", ",")}`, icon: CheckCircle, color: "text-primary bg-primary/10" },
                      { label: "Pending", sub: "Awaiting payout", value: `R${stats.pendingPayout.toFixed(2).replace(".", ",")}`, icon: Clock, color: "text-amber-400 bg-amber-500/10" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center ${item.color}`}>
                            <item.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.sub}</p>
                          </div>
                        </div>
                        <p className="font-bold">{item.value}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader><CardTitle>Recent Transactions</CardTitle><p className="text-sm text-muted-foreground">Latest payment activity</p></CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Wallet className="h-10 w-10 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No transactions yet</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {["events", "content", "payouts", "channels"].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <Card className="bg-card border-border">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    {tab === "events" && <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />}
                    {tab === "content" && <Video className="h-12 w-12 mx-auto mb-3 opacity-50" />}
                    {tab === "payouts" && <Wallet className="h-12 w-12 mx-auto mb-3 opacity-50" />}
                    {tab === "channels" && <Tv className="h-12 w-12 mx-auto mb-3 opacity-50" />}
                    <p className="text-lg capitalize">{tab}</p>
                    <p className="text-sm">Your {tab} will appear here</p>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}

            <TabsContent value="user-guide">
              <EmbedProUserGuide profileId={profileId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}