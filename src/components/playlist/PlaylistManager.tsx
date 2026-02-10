import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  ListVideo,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Loader2,
  Video,
  Lock,
  Globe,
  Wallet,
  Link2,
} from "lucide-react";
import { PlaylistContentPicker } from "./PlaylistContentPicker";
import { formatPrice } from "@/lib/currency";

interface Playlist {
  id: string;
  name: string;
  description: string | null;
  thumbnail_url: string | null;
  is_public: boolean;
  item_count: number;
  created_at: string;
  channel_id: string | null;
  subscription_price: number | null;
  sell_separately: boolean | null;
}

interface Channel {
  id: string;
  name: string;
}

interface PlaylistManagerProps {
  profileId: string;
}

export function PlaylistManager({ profileId }: PlaylistManagerProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editPlaylist, setEditPlaylist] = useState<Playlist | null>(null);
  const [pickerPlaylist, setPickerPlaylist] = useState<Playlist | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [channelId, setChannelId] = useState<string | null>(null);
  const [subscriptionPrice, setSubscriptionPrice] = useState<number | null>(null);
  const [sellSeparately, setSellSeparately] = useState(false);

  useEffect(() => {
    fetchData();
  }, [profileId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [playlistsRes, channelsRes] = await Promise.all([
        supabase
          .from("playlists")
          .select("*")
          .eq("owner_id", profileId)
          .order("created_at", { ascending: false }),
        supabase
          .from("channels")
          .select("id, name")
          .eq("owner_id", profileId)
          .order("name"),
      ]);

      if (playlistsRes.error) throw playlistsRes.error;
      if (channelsRes.error) throw channelsRes.error;

      setPlaylists(playlistsRes.data || []);
      setChannels(channelsRes.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to load playlists");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Playlist name is required");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from("playlists").insert({
        owner_id: profileId,
        name: name.trim(),
        description: description.trim() || null,
        is_public: isPublic,
        channel_id: channelId,
        subscription_price: subscriptionPrice,
        sell_separately: sellSeparately,
      });

      if (error) throw error;

      toast.success("Playlist created successfully");
      setCreateOpen(false);
      resetForm();
      fetchData();
    } catch (err) {
      console.error("Error creating playlist:", err);
      toast.error("Failed to create playlist");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!editPlaylist || !name.trim()) {
      toast.error("Playlist name is required");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("playlists")
        .update({
          name: name.trim(),
          description: description.trim() || null,
          is_public: isPublic,
          channel_id: channelId,
          subscription_price: subscriptionPrice,
          sell_separately: sellSeparately,
        })
        .eq("id", editPlaylist.id);

      if (error) throw error;

      toast.success("Playlist updated successfully");
      setEditPlaylist(null);
      resetForm();
      fetchData();
    } catch (err) {
      console.error("Error updating playlist:", err);
      toast.error("Failed to update playlist");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (playlist: Playlist) => {
    if (!confirm(`Delete "${playlist.name}"? This will also remove all items from the playlist.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("playlists")
        .delete()
        .eq("id", playlist.id);

      if (error) throw error;

      toast.success("Playlist deleted");
      fetchData();
    } catch (err) {
      console.error("Error deleting playlist:", err);
      toast.error("Failed to delete playlist");
    }
  };

  const openEdit = (playlist: Playlist) => {
    setName(playlist.name);
    setDescription(playlist.description || "");
    setIsPublic(playlist.is_public);
    setChannelId(playlist.channel_id);
    setSubscriptionPrice(playlist.subscription_price);
    setSellSeparately(playlist.sell_separately || false);
    setEditPlaylist(playlist);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setIsPublic(true);
    setChannelId(null);
    setSubscriptionPrice(null);
    setSellSeparately(false);
  };

  const getChannelName = (id: string | null) => {
    if (!id) return null;
    return channels.find((c) => c.id === id)?.name || "Unknown";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ListVideo className="h-6 w-6 text-primary" />
            Playlists
          </h2>
          <p className="text-muted-foreground">
            Organize your content into playlists for better discovery
          </p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Playlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Playlist</DialogTitle>
              <DialogDescription>
                Create a playlist to organize your content
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Playlist"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your playlist..."
                  rows={3}
                />
              </div>

              {/* Channel Link */}
              <div className="space-y-2">
                <Label htmlFor="channel-link">Link to Channel (optional)</Label>
                <Select
                  value={channelId || "none"}
                  onValueChange={(value) => setChannelId(value === "none" ? null : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Standalone playlist" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Standalone (no channel)</SelectItem>
                    {channels.map((ch) => (
                      <SelectItem key={ch.id} value={ch.id}>
                        {ch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Link to a channel to include in package, or keep standalone
                </p>
              </div>

              {/* Pricing */}
              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Subscription Price (ZAR)
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="1"
                  value={subscriptionPrice || ""}
                  onChange={(e) => setSubscriptionPrice(e.target.value ? Number(e.target.value) : null)}
                  placeholder="e.g., 49 (leave empty for free)"
                />
                <p className="text-xs text-muted-foreground">
                  Set a price for standalone sale, or leave empty if part of channel package
                </p>
              </div>

              {/* Sell Separately Toggle */}
              {channelId && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="space-y-0.5">
                    <Label>Sell Separately</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow purchase outside of channel package
                    </p>
                  </div>
                  <Switch checked={sellSeparately} onCheckedChange={setSellSeparately} />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Public</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow others to view this playlist
                  </p>
                </div>
                <Switch checked={isPublic} onCheckedChange={setIsPublic} />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create Playlist"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {playlists.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ListVideo className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-2">No playlists yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first playlist to start organizing content
            </p>
            <Button onClick={() => setCreateOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Playlist
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {playlists.map((playlist) => (
            <Card key={playlist.id} className="group relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="truncate text-lg">{playlist.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {playlist.description || "No description"}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setPickerPlaylist(playlist)}>
                        <Video className="h-4 w-4 mr-2" />
                        Manage Content
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEdit(playlist)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(playlist)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="secondary" className="gap-1">
                    <Video className="h-3 w-3" />
                    {playlist.item_count} items
                  </Badge>
                  <Badge variant={playlist.is_public ? "outline" : "secondary"} className="gap-1">
                    {playlist.is_public ? (
                      <>
                        <Globe className="h-3 w-3" />
                        Public
                      </>
                    ) : (
                      <>
                        <Lock className="h-3 w-3" />
                        Private
                      </>
                    )}
                  </Badge>
                  {playlist.subscription_price && (
                    <Badge variant="default" className="gap-1">
                      <Wallet className="h-3 w-3" />
                      {formatPrice(playlist.subscription_price)}
                    </Badge>
                  )}
                  {playlist.channel_id && (
                    <Badge variant="outline" className="gap-1 text-xs">
                      <Link2 className="h-3 w-3" />
                      {getChannelName(playlist.channel_id)}
                    </Badge>
                  )}
                  {playlist.sell_separately && (
                    <Badge variant="secondary" className="text-xs">
                      Sells separately
                    </Badge>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => setPickerPlaylist(playlist)}
                >
                  <Video className="h-4 w-4" />
                  Manage Content
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editPlaylist} onOpenChange={(open) => !open && setEditPlaylist(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Playlist</DialogTitle>
            <DialogDescription>
              Update your playlist details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Playlist"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (optional)</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your playlist..."
                rows={3}
              />
            </div>

            {/* Channel Link */}
            <div className="space-y-2">
              <Label htmlFor="edit-channel-link">Link to Channel (optional)</Label>
              <Select
                value={channelId || "none"}
                onValueChange={(value) => setChannelId(value === "none" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Standalone playlist" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Standalone (no channel)</SelectItem>
                  {channels.map((ch) => (
                    <SelectItem key={ch.id} value={ch.id}>
                      {ch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Link to a channel to include in package, or keep standalone
              </p>
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <Label htmlFor="edit-price" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Subscription Price (ZAR)
              </Label>
              <Input
                id="edit-price"
                type="number"
                min="0"
                step="1"
                value={subscriptionPrice || ""}
                onChange={(e) => setSubscriptionPrice(e.target.value ? Number(e.target.value) : null)}
                placeholder="e.g., 49 (leave empty for free)"
              />
              <p className="text-xs text-muted-foreground">
                Set a price for standalone sale, or leave empty if part of channel package
              </p>
            </div>

            {/* Sell Separately Toggle */}
            {channelId && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="space-y-0.5">
                  <Label>Sell Separately</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow purchase outside of channel package
                  </p>
                </div>
                <Switch checked={sellSeparately} onCheckedChange={setSellSeparately} />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Public</Label>
                <p className="text-sm text-muted-foreground">
                  Allow others to view this playlist
                </p>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPlaylist(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Content Picker */}
      {pickerPlaylist && (
        <PlaylistContentPicker
          open={!!pickerPlaylist}
          onOpenChange={(open) => !open && setPickerPlaylist(null)}
          playlistId={pickerPlaylist.id}
          playlistName={pickerPlaylist.name}
          profileId={profileId}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
