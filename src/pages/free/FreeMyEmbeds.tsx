import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import {
  ArrowLeft, Plus, Trash2, Eye, EyeOff, ExternalLink,
  FolderOpen, ListMusic, ChevronDown, ChevronRight
} from "lucide-react";
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

interface Channel {
  id: string;
  name: string;
  content_count: number;
}

interface Playlist {
  id: string;
  name: string;
  description: string | null;
  item_count: number;
}

export default function FreeMyEmbeds() {
  const navigate = useNavigate();
  const { profile, user, isDemoMode } = useAuth();
  const [embeds, setEmbeds] = useState<FreeEmbed[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [channelsExpanded, setChannelsExpanded] = useState(true);
  const [playlistsExpanded, setPlaylistsExpanded] = useState(true);
  const [showChannelForm, setShowChannelForm] = useState(false);
  const [showPlaylistForm, setShowPlaylistForm] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const profileId = profile?.id || user?.id || "";

  useEffect(() => {
    loadEmbeds();
    loadChannels();
    loadPlaylists();
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

    const { data, error } = await (supabase as any)
      .from("free_embed_records")
      .select("*")
      .eq("user_id", profileId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setEmbeds(data as any);
    }
    setLoading(false);
  };

  const loadChannels = async () => {
    if (isDemoMode) {
      setChannels([
        { id: "demo-ch-1", name: "Music Videos", content_count: 12 },
        { id: "demo-ch-2", name: "Tutorials", content_count: 5 },
        { id: "demo-ch-3", name: "Vlogs", content_count: 8 },
      ]);
      return;
    }

    const { data } = await (supabase as any)
      .from("free_embed_content")
      .select("channel_id, main_category")
      .eq("owner_id", profileId);

    if (data) {
      const channelMap: Record<string, Channel> = {};
      (data as any[]).forEach((item: any) => {
        const chId = item.channel_id || "uncategorized";
        const chName = item.main_category || "Uncategorized";
        if (!channelMap[chId]) {
          channelMap[chId] = { id: chId, name: chName, content_count: 0 };
        }
        channelMap[chId].content_count++;
      });
      setChannels(Object.values(channelMap));
    }
  };

  const loadPlaylists = async () => {
    if (isDemoMode) {
      setPlaylists([
        { id: "demo-pl-1", name: "Top Hits 2025", description: "Best music this year", item_count: 10 },
        { id: "demo-pl-2", name: "Learn React", description: "Full tutorial series", item_count: 7 },
      ]);
      return;
    }

    const { data } = await (supabase as any)
      .from("playlists")
      .select("id, name, description, item_count")
      .eq("owner_id", profileId)
      .order("created_at", { ascending: false });

    if (data) {
      setPlaylists(data as Playlist[]);
    }
  };

  const handleDelete = async (id: string) => {
    if (isDemoMode) {
      setEmbeds((prev) => prev.filter((e) => e.id !== id));
      toast({ title: "Deleted (demo)" });
      return;
    }

    const { error } = await (supabase as any)
      .from("free_embed_records")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setEmbeds((prev) => prev.filter((e) => e.id !== id));
      toast({ title: "Embed deleted" });
    }
  };

  const handleAddChannel = () => {
    if (!newChannelName.trim()) return;
    if (isDemoMode) {
      setChannels((prev) => [...prev, { id: `demo-ch-${Date.now()}`, name: newChannelName.trim(), content_count: 0 }]);
      toast({ title: "Channel created (demo)" });
    } else {
      toast({ title: "Channel ready", description: `Assign content to "${newChannelName.trim()}" category` });
    }
    setNewChannelName("");
    setShowChannelForm(false);
  };

  const handleAddPlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    if (isDemoMode) {
      setPlaylists((prev) => [...prev, { id: `demo-pl-${Date.now()}`, name: newPlaylistName.trim(), description: null, item_count: 0 }]);
      toast({ title: "Playlist created (demo)" });
      setNewPlaylistName("");
      setShowPlaylistForm(false);
      return;
    }

    const { error } = await (supabase as any).from("playlists").insert({
      owner_id: profileId,
      name: newPlaylistName.trim(),
      is_public: true,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Playlist created" });
      setNewPlaylistName("");
      setShowPlaylistForm(false);
      loadPlaylists();
    }
  };

  const handleDeleteChannel = (id: string) => {
    if (isDemoMode) {
      setChannels((prev) => prev.filter((c) => c.id !== id));
      toast({ title: "Channel removed (demo)" });
    }
  };

  const handleDeletePlaylist = async (id: string) => {
    if (isDemoMode) {
      setPlaylists((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "Playlist removed (demo)" });
      return;
    }
    const { error } = await (supabase as any).from("playlists").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setPlaylists((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "Playlist deleted" });
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

        {/* Channels Section */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <button
                className="flex items-center gap-2 text-left"
                onClick={() => setChannelsExpanded(!channelsExpanded)}
              >
                {channelsExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <FolderOpen className="h-5 w-5 text-amber-400" />
                <CardTitle className="text-lg">My Channels</CardTitle>
                <Badge variant="secondary" className="ml-2">{channels.length}</Badge>
              </button>
              <Button variant="outline" size="sm" onClick={() => setShowChannelForm(!showChannelForm)}>
                <Plus className="h-4 w-4 mr-1" />
                New Channel
              </Button>
            </div>
          </CardHeader>
          {channelsExpanded && (
            <CardContent className="space-y-3">
              {showChannelForm && (
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Channel name..."
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddChannel()}
                  />
                  <Button size="sm" onClick={handleAddChannel}>Add</Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowChannelForm(false)}>Cancel</Button>
                </div>
              )}
              {channels.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No channels yet. Create one to organize your content.
                </p>
              ) : (
                <div className="space-y-2">
                  {channels.map((channel) => (
                    <div key={channel.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <FolderOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{channel.name}</span>
                        <Badge variant="outline" className="text-xs">{channel.content_count} items</Badge>
                      </div>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDeleteChannel(channel.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {/* Playlists Section */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <button
                className="flex items-center gap-2 text-left"
                onClick={() => setPlaylistsExpanded(!playlistsExpanded)}
              >
                {playlistsExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <ListMusic className="h-5 w-5 text-amber-400" />
                <CardTitle className="text-lg">My Playlists</CardTitle>
                <Badge variant="secondary" className="ml-2">{playlists.length}</Badge>
              </button>
              <Button variant="outline" size="sm" onClick={() => setShowPlaylistForm(!showPlaylistForm)}>
                <Plus className="h-4 w-4 mr-1" />
                New Playlist
              </Button>
            </div>
          </CardHeader>
          {playlistsExpanded && (
            <CardContent className="space-y-3">
              {showPlaylistForm && (
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Playlist name..."
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddPlaylist()}
                  />
                  <Button size="sm" onClick={handleAddPlaylist}>Add</Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowPlaylistForm(false)}>Cancel</Button>
                </div>
              )}
              {playlists.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No playlists yet. Create one to curate your embeds.
                </p>
              ) : (
                <div className="space-y-2">
                  {playlists.map((playlist) => (
                    <div key={playlist.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <ListMusic className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <span className="font-medium text-sm">{playlist.name}</span>
                          {playlist.description && <p className="text-xs text-muted-foreground">{playlist.description}</p>}
                        </div>
                        <Badge variant="outline" className="text-xs">{playlist.item_count || 0} items</Badge>
                      </div>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDeletePlaylist(playlist.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {/* Embeds List */}
        <h2 className="text-xl font-semibold mb-4">Embed Assets</h2>
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
                      <Badge variant={embed.status === "active" ? "default" : "secondary"}>
                        {embed.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setPreviewId(previewId === embed.id ? null : embed.id)}>
                        {previewId === embed.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      {embed.embed_url && (
                        <Button variant="ghost" size="sm" onClick={() => window.open(embed.embed_url!, "_blank")}>
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
                            <AlertDialogAction onClick={() => handleDelete(embed.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                {previewId === embed.id && embed.embed_html_sanitized && (
                  <CardContent>
                    <div className="rounded-lg overflow-hidden bg-black/20" dangerouslySetInnerHTML={{ __html: embed.embed_html_sanitized }} />
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
