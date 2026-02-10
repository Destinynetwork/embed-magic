import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Video, Play, Plus, Trash2, FolderOpen, ListMusic, Pencil,
  ChevronDown, ChevronRight, GripVertical
} from "lucide-react";
import { toast } from "sonner";

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

export function FreeTierFreeEmbed() {
  const navigate = useNavigate();
  const { profile, user, isDemoMode } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [newChannelName, setNewChannelName] = useState("");
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [showChannelForm, setShowChannelForm] = useState(false);
  const [showPlaylistForm, setShowPlaylistForm] = useState(false);
  const [channelsExpanded, setChannelsExpanded] = useState(true);
  const [playlistsExpanded, setPlaylistsExpanded] = useState(true);

  const profileId = profile?.id || user?.id || "";

  useEffect(() => {
    if (isDemoMode) {
      setChannels([
        { id: "demo-ch-1", name: "Music Videos", content_count: 12 },
        { id: "demo-ch-2", name: "Tutorials", content_count: 5 },
        { id: "demo-ch-3", name: "Vlogs", content_count: 8 },
      ]);
      setPlaylists([
        { id: "demo-pl-1", name: "Top Hits 2025", description: "Best music this year", item_count: 10 },
        { id: "demo-pl-2", name: "Learn React", description: "Full tutorial series", item_count: 7 },
      ]);
    } else if (profileId) {
      loadChannels();
      loadPlaylists();
    }
  }, [profileId, isDemoMode]);

  const loadChannels = async () => {
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
    const { data } = await (supabase as any)
      .from("playlists")
      .select("id, name, description, item_count")
      .eq("owner_id", profileId)
      .order("created_at", { ascending: false });

    if (data) {
      setPlaylists(data as Playlist[]);
    }
  };

  const handleAddChannel = async () => {
    if (!newChannelName.trim()) return;

    if (isDemoMode) {
      setChannels((prev) => [
        ...prev,
        { id: `demo-ch-${Date.now()}`, name: newChannelName.trim(), content_count: 0 },
      ]);
      setNewChannelName("");
      setShowChannelForm(false);
      toast.success("Channel created (demo)");
      return;
    }

    // For real mode, channels are derived from content categories
    toast.success(`Channel "${newChannelName.trim()}" ready — assign content to this category`);
    setNewChannelName("");
    setShowChannelForm(false);
  };

  const handleAddPlaylist = async () => {
    if (!newPlaylistName.trim()) return;

    if (isDemoMode) {
      setPlaylists((prev) => [
        ...prev,
        { id: `demo-pl-${Date.now()}`, name: newPlaylistName.trim(), description: null, item_count: 0 },
      ]);
      setNewPlaylistName("");
      setShowPlaylistForm(false);
      toast.success("Playlist created (demo)");
      return;
    }

    const { error } = await (supabase as any).from("playlists").insert({
      owner_id: profileId,
      name: newPlaylistName.trim(),
      is_public: true,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Playlist created");
      setNewPlaylistName("");
      setShowPlaylistForm(false);
      loadPlaylists();
    }
  };

  const handleDeleteChannel = (id: string) => {
    if (isDemoMode) {
      setChannels((prev) => prev.filter((c) => c.id !== id));
      toast.success("Channel removed (demo)");
    }
  };

  const handleDeletePlaylist = async (id: string) => {
    if (isDemoMode) {
      setPlaylists((prev) => prev.filter((p) => p.id !== id));
      toast.success("Playlist removed (demo)");
      return;
    }

    const { error } = await (supabase as any).from("playlists").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      setPlaylists((prev) => prev.filter((p) => p.id !== id));
      toast.success("Playlist deleted");
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <Card className="border-amber-500/20 bg-gradient-to-br from-amber-900/10 to-amber-800/5">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Video className="h-7 w-7 text-amber-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Free Embed</h2>
              <p className="text-muted-foreground">Embed videos from any platform</p>
            </div>
          </div>

          <p className="text-muted-foreground mb-8 max-w-2xl">
            Create up to 100 video assets by embedding URLs from YouTube, Vimeo, and other
            platforms. Organize your content into channels and playlists with our easy-to-use
            dashboard.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Features Included:</h4>
              <ul className="space-y-3">
                {["100 video assets", "Channel organization", "10 AI-generated images per month", "Playlist support"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Supported Platforms:</h4>
              <ul className="space-y-3">
                {["YouTube, Vimeo, Dailymotion", "Spotify, SoundCloud", "Direct audio/video URLs"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Button
            className="gap-2 bg-amber-600 hover:bg-amber-700 text-white"
            onClick={() => navigate("/free/embeds")}
          >
            <Play className="h-4 w-4" />
            Launch Free Embed
          </Button>
        </CardContent>
      </Card>

      {/* Channels Section */}
      <Card>
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
                  <div
                    key={channel.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FolderOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{channel.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {channel.content_count} items
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteChannel(channel.id)}
                    >
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
      <Card>
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
                  <div
                    key={playlist.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ListMusic className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium text-sm">{playlist.name}</span>
                        {playlist.description && (
                          <p className="text-xs text-muted-foreground">{playlist.description}</p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {playlist.item_count || 0} items
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeletePlaylist(playlist.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
