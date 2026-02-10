import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Upload, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ProUploadVideo() {
  const navigate = useNavigate();
  const { profile, user, isDemoMode } = useAuth();
  const [title, setTitle] = useState("");
  const [cdnProvider, setCdnProvider] = useState<"GUMLET" | "ADILO">("GUMLET");
  const [externalAssetId, setExternalAssetId] = useState("");
  const [playbackUrl, setPlaybackUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const profileId = profile?.id || user?.id || "";

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (isDemoMode) {
        toast({ title: "Demo Mode", description: "Asset created (demo)." });
        navigate("/pro/assets");
        return;
      }

      const { error: dbError } = await supabase.from("pro_managed_assets" as any).insert({
        user_id: profileId,
        title: title.trim(),
        cdn_provider: cdnProvider,
        external_asset_id: externalAssetId || null,
        playback_url: playbackUrl || null,
        thumbnail_url: thumbnailUrl || null,
        status: "UPLOADING",
        metadata_json: {},
      } as any);

      if (dbError) throw dbError;

      toast({ title: "Asset created!", description: "Your managed video asset has been created." });
      navigate("/pro/assets");
    } catch (err: any) {
      setError(err.message || "Failed to create asset.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate("/pro")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Pro Dashboard
        </Button>

        <h1 className="text-3xl font-bold mb-2">Upload / Add Managed Video</h1>
        <p className="text-muted-foreground mb-6">
          Create a managed asset record linked to your Gumlet or Adilo account
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Asset Details</CardTitle>
            <CardDescription>
              Fill in the details for your managed video asset
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="My pro video"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="cdn-provider">CDN Provider</Label>
              <Select value={cdnProvider} onValueChange={(v) => setCdnProvider(v as "GUMLET" | "ADILO")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GUMLET">Gumlet</SelectItem>
                  <SelectItem value="ADILO">Adilo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="asset-id">External Asset ID (from {cdnProvider})</Label>
              <Input
                id="asset-id"
                placeholder="e.g. asset_abc123"
                value={externalAssetId}
                onChange={(e) => setExternalAssetId(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="playback-url">Playback URL</Label>
              <Input
                id="playback-url"
                placeholder="https://video.gumlet.io/..."
                value={playbackUrl}
                onChange={(e) => setPlaybackUrl(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="thumbnail-url">Thumbnail URL (optional)</Label>
              <Input
                id="thumbnail-url"
                placeholder="https://..."
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3 mt-6">
          <Button onClick={handleSave} disabled={saving || !title.trim()}>
            <Upload className="h-4 w-4 mr-2" />
            {saving ? "Creating..." : "Create Asset"}
          </Button>
          <Button variant="outline" onClick={() => navigate("/pro")}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
