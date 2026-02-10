import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Banknote, TrendingUp, Tv, Video, Wallet, BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EmbedProCreatorDashboardSectionProps {
  profileId: string;
  onBack: () => void;
}

export function EmbedProCreatorDashboardSection({ profileId, onBack }: EmbedProCreatorDashboardSectionProps) {
  const [activeTab, setActiveTab] = useState("earnings");
  const [stats, setStats] = useState({ totalChannels: 0, totalContent: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profileId) loadData();
  }, [profileId]);

  const loadData = async () => {
    try {
      const { data: channels } = await supabase
        .from("embed_pro_channels" as any)
        .select("id")
        .eq("owner_id", profileId);

      const { data: content } = await supabase
        .from("content_assets")
        .select("id")
        .eq("owner_id", profileId);

      setStats({
        totalChannels: (channels as any[])?.length || 0,
        totalContent: content?.length || 0,
        totalRevenue: 0,
      });
    } catch (err) {
      console.error("Error loading embed dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Creator Dashboard</h1>
          <p className="text-muted-foreground">Track your embed content and earnings</p>
        </div>
        <Button variant="outline" onClick={onBack}>← Back to Hub</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Channels</CardTitle>
            <Tv className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalChannels}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Content Items</CardTitle>
            <Video className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalContent}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
            <Banknote className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              R{stats.totalRevenue.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-secondary flex-wrap h-auto gap-1">
          <TabsTrigger value="earnings"><BarChart3 className="h-4 w-4 mr-1" />Earnings</TabsTrigger>
          <TabsTrigger value="channels"><Tv className="h-4 w-4 mr-1" />Channels</TabsTrigger>
          <TabsTrigger value="payouts"><Wallet className="h-4 w-4 mr-1" />Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="earnings">
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center text-muted-foreground">
              <Banknote className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Earnings tracking</p>
              <p className="text-sm">Revenue from channel subscriptions and content sales will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels">
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center text-muted-foreground">
              <Tv className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Channel management</p>
              <p className="text-sm">Manage your embed channels from the main dashboard</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts">
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center text-muted-foreground">
              <Wallet className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No payouts yet</p>
              <p className="text-sm">Earnings will appear here once you start making sales</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
