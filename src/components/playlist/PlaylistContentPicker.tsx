import { useState, useEffect, forwardRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  ListVideo,
  Search,
  Loader2,
  Check,
  Film,
  Music,
  Tv,
  Clock,
  Tag,
} from "lucide-react";

interface ContentAsset {
  id: string;
  title: string;
  thumbnail_url: string | null;
  content_type: string;
  duration_seconds: number | null;
  main_category: string | null;
  created_at: string;
}

interface PlaylistItem {
  content_asset_id: string;
  position: number;
}

interface PlaylistContentPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlistId: string;
  playlistName: string;
  profileId: string;
  onSuccess?: () => void;
}

export function PlaylistContentPicker({
  open,
  onOpenChange,
  playlistId,
  playlistName,
  profileId,
  onSuccess,
}: PlaylistContentPickerProps) {
  const [allContent, setAllContent] = useState<ContentAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [initialSelectedIds, setInitialSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (open) {
      fetchContent();
    }
  }, [open, profileId, playlistId]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      // Fetch all content owned by this creator
      const { data: contentData, error: contentError } = await supabase
        .from("content_assets")
        .select("id, title, thumbnail_url, content_type, duration_seconds, main_category, created_at")
        .eq("owner_id", profileId)
        .order("created_at", { ascending: false });

      if (contentError) throw contentError;

      // Fetch existing playlist items
      const { data: playlistItems, error: itemsError } = await supabase
        .from("playlist_items")
        .select("content_asset_id")
        .eq("playlist_id", playlistId);

      if (itemsError) throw itemsError;

      setAllContent(contentData || []);

      // Set initial selection based on what's already in this playlist
      const inPlaylist = new Set(
        (playlistItems || []).map((item) => item.content_asset_id)
      );
      setSelectedIds(inPlaylist);
      setInitialSelectedIds(new Set(inPlaylist));
    } catch (err) {
      console.error("Error fetching content:", err);
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (contentId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(contentId)) {
        next.delete(contentId);
      } else {
        next.add(contentId);
      }
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const toAdd = [...selectedIds].filter((id) => !initialSelectedIds.has(id));
      const toRemove = [...initialSelectedIds].filter((id) => !selectedIds.has(id));

      // Add new items to playlist
      if (toAdd.length > 0) {
        // Get current item count to determine next position
        const { count } = await supabase
          .from("playlist_items")
          .select("*", { count: "exact", head: true })
          .eq("playlist_id", playlistId);

        let nextPosition = (count || 0) + 1;

        const newItems = toAdd.map((contentId, idx) => ({
          playlist_id: playlistId,
          content_asset_id: contentId,
          position: nextPosition + idx,
        }));

        const { error: addError } = await supabase
          .from("playlist_items")
          .insert(newItems);

        if (addError) throw addError;
      }

      // Remove items from playlist
      if (toRemove.length > 0) {
        const { error: removeError } = await supabase
          .from("playlist_items")
          .delete()
          .eq("playlist_id", playlistId)
          .in("content_asset_id", toRemove);

        if (removeError) throw removeError;
      }

      const changes = [];
      if (toAdd.length > 0) changes.push(`${toAdd.length} added`);
      if (toRemove.length > 0) changes.push(`${toRemove.length} removed`);

      if (changes.length > 0) {
        toast.success(`Playlist updated: ${changes.join(", ")}`);
      } else {
        toast.info("No changes made");
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      console.error("Error updating playlist content:", err);
      toast.error("Failed to update playlist content");
    } finally {
      setSaving(false);
    }
  };

  const filteredContent = allContent.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const inPlaylist = filteredContent.filter((c) => selectedIds.has(c.id));
  const notInPlaylist = filteredContent.filter((c) => !selectedIds.has(c.id));

  const getContentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "audio":
      case "podcast":
        return <Music className="h-4 w-4" />;
      case "series":
      case "tv shows":
        return <Tv className="h-4 w-4" />;
      default:
        return <Film className="h-4 w-4" />;
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
  };

  const hasChanges =
    [...selectedIds].some((id) => !initialSelectedIds.has(id)) ||
    [...initialSelectedIds].some((id) => !selectedIds.has(id));

  const ContentItem = forwardRef<HTMLDivElement, { content: ContentAsset }>(
    ({ content }, ref) => {
      const isSelected = selectedIds.has(content.id);

      return (
        <div
          ref={ref}
          className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
            isSelected
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50 hover:bg-accent"
          }`}
          onClick={() => toggleSelection(content.id)}
        >
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => toggleSelection(content.id)}
            className="pointer-events-none"
          />

          {content.thumbnail_url ? (
            <img
              src={content.thumbnail_url}
              alt={content.title}
              className="w-16 h-10 object-cover rounded"
              loading="lazy"
            />
          ) : (
            <div className="w-16 h-10 bg-muted rounded flex items-center justify-center">
              {getContentIcon(content.content_type)}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{content.title}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                {content.content_type}
              </Badge>
              {content.duration_seconds && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDuration(content.duration_seconds)}
                </span>
              )}
              {content.main_category && (
                <span className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {content.main_category}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    }
  );
  ContentItem.displayName = "ContentItem";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ListVideo className="h-5 w-5 text-primary" />
            Manage Content for "{playlistName}"
          </DialogTitle>
          <DialogDescription>
            Select content to add or remove from this playlist. Content can belong to multiple playlists.
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search content..."
            className="pl-9"
          />
        </div>

        {/* Stats Bar */}
        <div className="flex gap-4 text-sm py-2 px-3 bg-muted/50 rounded-lg">
          <span className="text-muted-foreground">
            <strong className="text-primary">{selectedIds.size}</strong> in playlist
          </span>
          <span className="text-muted-foreground">
            <strong className="text-foreground">{allContent.length}</strong> total
          </span>
          {hasChanges && (
            <span className="ml-auto text-primary font-medium animate-pulse">
              Unsaved changes
            </span>
          )}
        </div>

        {/* Content List */}
        <div className="flex-1 min-h-0 h-[60vh] max-h-[520px] overflow-y-auto overscroll-contain -mx-6 px-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : allContent.length === 0 ? (
            <div className="text-center py-12">
              <ListVideo className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No content found</p>
              <p className="text-sm text-muted-foreground">
                Add content first using the upload feature
              </p>
            </div>
          ) : filteredContent.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No matching content</p>
            </div>
          ) : (
            <div className="space-y-6 pb-4">
              {/* In this playlist */}
              {inPlaylist.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-2 text-green-500 sticky top-0 bg-background py-2 z-10">
                    <Check className="h-4 w-4" />
                    In This Playlist ({inPlaylist.length})
                  </h4>
                  <div className="space-y-2">
                    {inPlaylist.map((content) => (
                      <ContentItem key={content.id} content={content} />
                    ))}
                  </div>
                </div>
              )}

              {/* Available content */}
              {notInPlaylist.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground sticky top-0 bg-background py-2 z-10">
                    <Film className="h-4 w-4" />
                    Available Content ({notInPlaylist.length})
                  </h4>
                  <div className="space-y-2">
                    {notInPlaylist.map((content) => (
                      <ContentItem key={content.id} content={content} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
