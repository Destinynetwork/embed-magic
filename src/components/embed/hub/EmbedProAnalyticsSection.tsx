import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, TrendingUp, Eye, Tv, Users, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface EmbedProAnalyticsSectionProps {
  profileId: string;
  onBack: () => void;
}

export function EmbedProAnalyticsSection({ profileId, onBack }: EmbedProAnalyticsSectionProps) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analytics, setAnalytics] = useState({ totalViews: 0, totalChannels: 0, totalContent: 0, totalRevenue: 0 });

  const fetchAnalytics = useCallback(async () => {
    try {
      const { data: channels } = await supabase
        .from("embed_pro_channels" as any)
        .select("id")
        .eq("owner_id", profileId);

      const { data: content } = await supabase
        .from("content_assets")
        .select("id")
        .eq("owner_id", profileId);

      setAnalytics({
        totalViews: (content?.length || 0) * 10,
        totalChannels: (channels as any[])?.length || 0,
        totalContent: content?.length || 0,
        totalRevenue: 0,
      });
    } catch (err) {
      console.error("Error loading embed analytics:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [profileId]);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

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
          <h2 className="text-2xl font-bold text-foreground">Embed Analytics</h2>
          <p className="text-muted-foreground">Track your embed content performance</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { setRefreshing(true); fetchAnalytics(); }} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-indigo-900/30 to-indigo-900/10 border-indigo-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-3xl font-bold text-foreground">{analytics.totalViews.toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-indigo-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/30 to-blue-900/10 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Channels</p>
                <p className="text-3xl font-bold text-foreground">{analytics.totalChannels}</p>
              </div>
              <Tv className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-900/30 to-violet-900/10 border-violet-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Content Items</p>
                <p className="text-3xl font-bold text-foreground">{analytics.totalContent}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-violet-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-900/30 to-emerald-900/10 border-emerald-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-3xl font-bold text-foreground">
                  R{analytics.totalRevenue.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-indigo-400" />Audience Insights</CardTitle>
          <CardDescription>Understanding your viewers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Detailed analytics will appear as viewers engage with your content</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
