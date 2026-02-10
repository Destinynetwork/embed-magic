import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Plus, Check, AlertTriangle, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  detectProvider,
  sanitizeEmbedHtml,
  ALLOWED_PROVIDERS,
} from "@/lib/auth-helpers";

export default function FreeAddEmbed() {
  const navigate = useNavigate();
  const { profile, user, isDemoMode } = useAuth();
  const [title, setTitle] = useState("");
  const [embedInput, setEmbedInput] = useState("");
  const [inputType, setInputType] = useState<"url" | "code">("url");
  const [saving, setSaving] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [detectedProvider, setDetectedProvider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const profileId = profile?.id || user?.id || "";

  const handleDetect = () => {
    setError(null);
    setPreviewHtml(null);
    setDetectedProvider(null);

    if (!embedInput.trim()) {
      setError("Please enter a URL or embed code.");
      return;
    }

    if (inputType === "url") {
      const provider = detectProvider(embedInput);
      if (!provider) {
        setError(
          `Provider not recognised. Allowed providers: ${ALLOWED_PROVIDERS.join(", ")}`
        );
        return;
      }
      setDetectedProvider(provider);
      // Build a basic iframe for preview
      setPreviewHtml(
        `<iframe src="${embedInput}" width="100%" height="400" frameborder="0" allowfullscreen sandbox="allow-scripts allow-same-origin allow-popups"></iframe>`
      );
    } else {
      const sanitized = sanitizeEmbedHtml(embedInput);
      if (!sanitized) {
        setError("Could not extract a valid iframe from the embed code. Only iframes from allowed providers are accepted.");
        return;
      }
      // Detect provider from the iframe src
      const srcMatch = sanitized.match(/src="([^"]*)"/);
      if (srcMatch) {
        const p = detectProvider(srcMatch[1]);
        setDetectedProvider(p);
      }
      setPreviewHtml(sanitized);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }
    if (!detectedProvider || !previewHtml) {
      setError("Please validate the embed first.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (isDemoMode) {
        toast({ title: "Demo Mode", description: "Embed saved (demo)." });
        navigate("/free/embeds");
        return;
      }

      const { error: dbError } = await supabase.from("free_embed_records" as any).insert({
        user_id: profileId,
        title: title.trim(),
        provider: detectedProvider,
        embed_url: inputType === "url" ? embedInput : null,
        embed_code_raw: inputType === "code" ? embedInput : null,
        embed_html_sanitized: previewHtml,
        status: "active",
      } as any);

      if (dbError) throw dbError;

      toast({ title: "Embed saved!", description: "Your embed has been added." });
      navigate("/free/embeds");
    } catch (err: any) {
      setError(err.message || "Failed to save embed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate("/free")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Free Hub
        </Button>

        <h1 className="text-3xl font-bold mb-2">Add New Embed</h1>
        <p className="text-muted-foreground mb-6">
          Paste a URL or embed code from a supported provider
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Embed Details</CardTitle>
            <CardDescription>
              Supported: {ALLOWED_PROVIDERS.join(", ")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="My awesome video"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant={inputType === "url" ? "default" : "outline"}
                size="sm"
                onClick={() => { setInputType("url"); setPreviewHtml(null); setDetectedProvider(null); }}
              >
                Paste URL
              </Button>
              <Button
                variant={inputType === "code" ? "default" : "outline"}
                size="sm"
                onClick={() => { setInputType("code"); setPreviewHtml(null); setDetectedProvider(null); }}
              >
                Paste Embed Code
              </Button>
            </div>

            {inputType === "url" ? (
              <div>
                <Label htmlFor="embed-url">Embed URL</Label>
                <Input
                  id="embed-url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={embedInput}
                  onChange={(e) => setEmbedInput(e.target.value)}
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="embed-code">Embed Code (HTML)</Label>
                <Textarea
                  id="embed-code"
                  placeholder='<iframe src="https://...">'
                  value={embedInput}
                  onChange={(e) => setEmbedInput(e.target.value)}
                  rows={4}
                />
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDetect}>
                <Eye className="h-4 w-4 mr-2" />
                Validate & Preview
              </Button>
            </div>

            {detectedProvider && (
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span className="text-sm">Provider detected:</span>
                <Badge>{detectedProvider}</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {previewHtml && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="rounded-lg overflow-hidden bg-black/20"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={saving || !previewHtml || !title.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Embed"}
          </Button>
          <Button variant="outline" onClick={() => navigate("/free")}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
