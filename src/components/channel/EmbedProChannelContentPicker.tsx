import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Video, Film, Loader2, Save } from "lucide-react";

interface ContentItem {
  id: string;
  title: string;
  thumbnail_url: string | null;
  content_type: string;
  main_category: string | null;
  channel_id: string | null;
  created_at: string;
}

interface FreeEmbedChannelContentPickerProps {
  channelId: string;
  channelName: string;
  profileId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FreeEmbedChannelContentPicker({
  channelId,
  channelName,
  profileId,
  open,
  onOpenChange,
}: FreeEmbedChannelContentPickerProps) {
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [originalIds, setOriginalIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      fetchContent();
    }
  }, [open, profileId, channelId]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      // Fetch all Free Embed content owned by this creator
      const { data, error } = await supabase
        .from("free_embed_content")
        .select("id, title, thumbnail_url, content_type, main_category, channel_id, created_at")
        .eq("owner_id", profileId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setAllContent(data || []);
      
      // Set initially selected items (already in this channel)
      const currentlyInChannel = new Set(
        (data || []).filter(item => item.channel_id === channelId).map(item => item.id)
      );
      setSelectedIds(currentlyInChannel);
      setOriginalIds(currentlyInChannel);
    } catch (error) {
      console.error("Error fetching content:", error);
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Find items to add and remove
      const toAdd = [...selectedIds].filter(id => !originalIds.has(id));
      const toRemove = [...originalIds].filter(id => !selectedIds.has(id));

      // Add items to channel
      if (toAdd.length > 0) {
        const { error: addError } = await supabase
          .from("free_embed_content")
          .update({ channel_id: channelId })
          .in("id", toAdd);

        if (addError) throw addError;
      }

      // Remove items from channel
      if (toRemove.length > 0) {
        const { error: removeError } = await supabase
          .from("free_embed_content")
          .update({ channel_id: null })
          .in("id", toRemove);

        if (removeError) throw removeError;
      }

      toast.success(`Channel updated: ${toAdd.length} added, ${toRemove.length} removed`);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating channel content:", error);
      toast.error("Failed to update channel content");
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = () => {
    if (selectedIds.size !== originalIds.size) return true;
    for (const id of selectedIds) {
      if (!originalIds.has(id)) return true;
    }
    return false;
  };

  // Content not in any channel or in this channel
  const availableContent = allContent.filter(
    item => item.channel_id === null || item.channel_id === channelId
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            Manage Content: {channelName}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Select content to include in this channel
          </p>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : availableContent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Film className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h4 className="font-medium mb-2">No content available</h4>
            <p className="text-sm text-muted-foreground">
              Add content to your library first, then assign it to channels
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2">
              {availableContent.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                    selectedIds.has(item.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-accent/50"
                  }`}
                  onClick={() => toggleSelection(item.id)}
                >
                  <Checkbox
                    checked={selectedIds.has(item.id)}
                    onCheckedChange={() => toggleSelection(item.id)}
                  />
                  
                  {item.thumbnail_url ? (
                    <img
                      src={item.thumbnail_url}
                      alt=""
                      className="w-16 h-10 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-10 bg-muted rounded flex items-center justify-center">
                      <Film className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {item.content_type}
                      </Badge>
                      {item.main_category && (
                        <Badge variant="secondary" className="text-xs">
                          {item.main_category}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <DialogFooter className="gap-2">
          <div className="flex-1 text-sm text-muted-foreground">
            {selectedIds.size} item(s) selected
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges() || saving}
            className="gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
