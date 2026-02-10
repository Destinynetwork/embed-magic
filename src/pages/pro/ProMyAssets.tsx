import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Upload, Trash2, ExternalLink, Play, Clock, CheckCircle, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ProAsset {
  id: string;
  title: string;
  cdn_provider: string;
  external_asset_id: string | null;
  playback_url: string | null;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  status: string;
  created_at: string;
}

const statusConfig: Record<string, { icon: React.ReactNode; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  UPLOADING: { icon: <Clock className="h-3 w-3" />, variant: "secondary" },
  READY: { icon: <CheckCircle className="h-3 w-3" />, variant: "default" },
  FAILED: { icon: <XCircle className="h-3 w-3" />, variant: "destructive" },
};

export default function ProMyAssets() {
  const navigate = useNavigate();
  const { profile, user, isDemoMode } = useAuth();
  const [assets, setAssets] = useState<ProAsset[]>([]);
  const [loading, setLoading] = useState(true);

  const profileId = profile?.id || user?.id || "";

  useEffect(() => {
    loadAssets();
  }, [profileId]);

  const loadAssets = async () => {
    if (isDemoMode) {
      setAssets([
        {
          id: "demo-1",
          title: "Demo Pro Video",
          cdn_provider: "GUMLET",
          external_asset_id: "demo_asset_001",
          playback_url: "https://video.gumlet.io/demo",
          thumbnail_url: null,
          duration_seconds: 120,
          status: "READY",
          created_at: new Date().toISOString(),
        },
        {
          id: "demo-2",
          title: "Uploading Video",
          cdn_provider: "ADILO",
          external_asset_id: "demo_asset_002",
          playback_url: null,
          thumbnail_url: null,
          duration_seconds: null,
          status: "UPLOADING",
          created_at: new Date().toISOString(),
        },
      ]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("pro_managed_assets" as any)
      .select("*")
      .eq("user_id", profileId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setAssets(data as any);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (isDemoMode) {
      setAssets((prev) => prev.filter((a) => a.id !== id));
      toast({ title: "Deleted (demo)" });
      return;
    }

    const { error } = await supabase
      .from("pro_managed_assets" as any)
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setAssets((prev) => prev.filter((a) => a.id !== id));
      toast({ title: "Asset deleted" });
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "—";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" onClick={() => navigate("/pro")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pro Dashboard
          </Button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Managed Assets</h1>
          <Button onClick={() => navigate("/pro/upload")}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Video
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : assets.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">No managed assets yet.</p>
              <Button onClick={() => navigate("/pro/upload")}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Your First Video
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {assets.map((asset) => {
              const sc = statusConfig[asset.status] || statusConfig.UPLOADING;
              return (
                <Card key={asset.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">{asset.title}</CardTitle>
                        <Badge variant="outline">{asset.cdn_provider}</Badge>
                        <Badge variant={sc.variant} className="gap-1">
                          {sc.icon}
                          {asset.status}
                        </Badge>
                        {asset.duration_seconds && (
                          <span className="text-sm text-muted-foreground">
                            {formatDuration(asset.duration_seconds)}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {asset.playback_url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(asset.playback_url!, "_blank")}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        {asset.external_asset_id && (
                          <span className="text-xs text-muted-foreground self-center">
                            ID: {asset.external_asset_id}
                          </span>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Asset</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{asset.title}"? This cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(asset.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
