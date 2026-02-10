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
import { ArrowLeft, Plus, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FreeEmbed {
  id: string;
  title: string;
  provider: string;
  embed_url: string | null;
  embed_html_sanitized: string | null;
  status: string;
  created_at: string;
}

export default function FreeMyEmbeds() {
  const navigate = useNavigate();
  const { profile, user, isDemoMode } = useAuth();
  const [embeds, setEmbeds] = useState<FreeEmbed[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const profileId = profile?.id || user?.id || "";

  useEffect(() => {
    loadEmbeds();
  }, [profileId]);

  const loadEmbeds = async () => {
    if (isDemoMode) {
      setEmbeds([
        {
          id: "demo-1",
          title: "Demo YouTube Video",
          provider: "youtube",
          embed_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          embed_html_sanitized: '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" width="100%" height="400" frameborder="0" allowfullscreen></iframe>',
          status: "active",
          created_at: new Date().toISOString(),
        },
        {
          id: "demo-2",
          title: "Demo Vimeo Video",
          provider: "vimeo",
          embed_url: "https://player.vimeo.com/video/76979871",
          embed_html_sanitized: '<iframe src="https://player.vimeo.com/video/76979871" width="100%" height="400" frameborder="0" allowfullscreen></iframe>',
          status: "active",
          created_at: new Date().toISOString(),
        },
      ]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("free_embed_records" as any)
      .select("*")
      .eq("user_id", profileId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setEmbeds(data as any);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (isDemoMode) {
      setEmbeds((prev) => prev.filter((e) => e.id !== id));
      toast({ title: "Deleted (demo)" });
      return;
    }

    const { error } = await supabase
      .from("free_embed_records" as any)
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setEmbeds((prev) => prev.filter((e) => e.id !== id));
      toast({ title: "Embed deleted" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" onClick={() => navigate("/free")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Free Hub
          </Button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Embeds</h1>
          <Button onClick={() => navigate("/free/add")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Embed
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : embeds.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">No embeds yet. Add your first one!</p>
              <Button onClick={() => navigate("/free/add")}>
                <Plus className="h-4 w-4 mr-2" />
                Add Embed
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {embeds.map((embed) => (
              <Card key={embed.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{embed.title}</CardTitle>
                      <Badge variant="outline">{embed.provider}</Badge>
                      <Badge
                        variant={embed.status === "active" ? "default" : "secondary"}
                      >
                        {embed.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setPreviewId(previewId === embed.id ? null : embed.id)
                        }
                      >
                        {previewId === embed.id ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      {embed.embed_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(embed.embed_url!, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Embed</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{embed.title}"? This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(embed.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                {previewId === embed.id && embed.embed_html_sanitized && (
                  <CardContent>
                    <div
                      className="rounded-lg overflow-hidden bg-black/20"
                      dangerouslySetInnerHTML={{ __html: embed.embed_html_sanitized }}
                    />
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
