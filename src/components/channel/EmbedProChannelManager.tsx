import { useState } from "react";
import { useEmbedProChannelManagement, EmbedProChannel } from "@/hooks/useEmbedProChannelManagement";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Tv,
  Edit,
  Trash2,
  Lock,
  Video,
  ChevronRight,
  Layers,
} from "lucide-react";
import { EmbedProChannelContentPicker } from "./EmbedProChannelContentPicker";
import { EmbedProSubChannelContentList } from "./EmbedProSubChannelContentList";

interface EmbedProChannelManagerProps {
  profileId: string;
}

const DEFAULT_CATEGORIES = [
  "Entertainment",
  "Church",
  "Education",
  "Music",
  "Sports",
  "News",
  "Documentary",
  "Kids",
  "Lifestyle",
  "Business",
  "Technology",
  "Health",
  "Cooking",
  "Travel",
  "Gaming",
  "Other",
];

export function EmbedProChannelManager({ profileId }: EmbedProChannelManagerProps) {
  const {
    channels,
    isLoading,
    createChannel,
    updateChannel,
    deleteChannel,
    canCreateChannel,
  } = useEmbedProChannelManagement(profileId);

  const [showChannelModal, setShowChannelModal] = useState(false);
  const [editingChannel, setEditingChannel] = useState<EmbedProChannel | null>(null);
  const [contentPickerChannel, setContentPickerChannel] = useState<EmbedProChannel | null>(null);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  // Channel form state
  const [channelForm, setChannelForm] = useState({
    name: "",
    description: "",
    category: "",
    is_free: true,
    subscription_price: 0,
    package_price: 0,
    sell_individually: false,
    is_private: false,
    parent_id: undefined as string | undefined,
  });
  
  // Custom category input state
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");

  const resetChannelForm = () => {
    setChannelForm({
      name: "",
      description: "",
      category: "",
      is_free: true,
      subscription_price: 0,
      package_price: 0,
      sell_individually: false,
      is_private: false,
      parent_id: undefined,
    });
    setEditingChannel(null);
    setSelectedParentId(null);
    setShowCustomCategory(false);
    setCustomCategory("");
  };

  const handleOpenChannelModal = (channel?: EmbedProChannel, parentId?: string) => {
    if (channel) {
      setEditingChannel(channel);
      setChannelForm({
        name: channel.name,
        description: channel.description || "",
        category: channel.category || "",
        is_free: channel.is_free,
        subscription_price: channel.subscription_price || 0,
        package_price: channel.package_price || 0,
        sell_individually: channel.sell_individually ?? true,
        is_private: channel.is_private,
        parent_id: channel.parent_id,
      });
    } else {
      resetChannelForm();
      if (parentId) {
        setChannelForm(prev => ({ ...prev, parent_id: parentId }));
        setSelectedParentId(parentId);
      }
    }
    setShowChannelModal(true);
  };

  const handleSaveChannel = async () => {
    if (editingChannel) {
      await updateChannel(editingChannel.id, channelForm);
    } else {
      await createChannel(channelForm);
    }
    setShowChannelModal(false);
    resetChannelForm();
  };

  const handleDeleteChannel = async (channelId: string) => {
    if (confirm("Are you sure you want to delete this channel? This action cannot be undone.")) {
      await deleteChannel(channelId);
    }
  };

  // Get parent channels
  const parentChannels = channels.filter((ch) => !ch.parent_id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Your Embed Pro Channels</h3>
          <p className="text-sm text-muted-foreground">
            Create and manage unlimited subscription channels for embedded content
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {parentChannels.length} parent channel(s) • {channels.filter(ch => ch.parent_id).length} sub-channel(s)
          </p>
        </div>
        <Button 
          onClick={() => handleOpenChannelModal()} 
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Channel
        </Button>
      </div>

      {channels.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Tv className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h4 className="font-medium text-foreground mb-2">No channels yet</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first channel to start organizing your embedded content
            </p>
            <Button onClick={() => handleOpenChannelModal()} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Channel
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Parent Channels with nested Sub-channels */}
          {parentChannels.map((parentChannel) => {
            const subChannels = channels.filter(
              (ch) => ch.parent_id === parentChannel.id
            );
            return (
              <Card key={parentChannel.id} className="overflow-hidden">
                <CardHeader className="pb-3 bg-secondary/30">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Tv className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {parentChannel.name}
                          {parentChannel.package_price && parentChannel.package_price > 0 && (
                            <Badge variant="default" className="text-xs">
                              R{parentChannel.package_price} Package
                            </Badge>
                          )}
                          {parentChannel.is_free && (
                            <Badge variant="secondary" className="text-xs">Free</Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {parentChannel.description || parentChannel.category || "Parent Channel"}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => setContentPickerChannel(parentChannel)}
                        title="Manage Content"
                      >
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleOpenChannelModal(parentChannel)}
                        title="Edit Channel"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteChannel(parentChannel.id)}
                        title="Delete Channel"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                {/* Sub-channels */}
                <CardContent className="pt-4">
                  {subChannels.length > 0 ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Layers className="h-4 w-4" />
                        <span>Sub-channels ({subChannels.length})</span>
                      </div>
                      <div className="space-y-3">
                        {subChannels.map((subChannel) => (
                          <div
                            key={subChannel.id}
                            className="p-3 rounded-lg border bg-card hover:bg-accent/30 transition-colors group"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-sm">{subChannel.name}</p>
                                    <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                                      {subChannel.content_count || 0} items
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    {subChannel.subscription_price && subChannel.subscription_price > 0 ? (
                                      <Badge variant="outline" className="text-xs">
                                        R{subChannel.subscription_price}
                                      </Badge>
                                    ) : (
                                      <Badge variant="secondary" className="text-xs">
                                        Package Only
                                      </Badge>
                                    )}
                                    {subChannel.sell_individually && (
                                      <span className="text-xs text-muted-foreground">Individual</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={() => setContentPickerChannel(subChannel)}
                                  title="Manage Content"
                                >
                                  <Video className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={() => handleOpenChannelModal(subChannel)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteChannel(subChannel.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            
                            {/* Expandable Content List */}
                            <EmbedProSubChannelContentList
                              channelId={subChannel.id}
                              channelName={subChannel.name}
                              contentCount={subChannel.content_count || 0}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                      <Layers className="h-4 w-4" />
                      <span>No sub-channels yet</span>
                    </div>
                  )}
                  
                  {/* Add Sub-channel Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 gap-2"
                    onClick={() => handleOpenChannelModal(undefined, parentChannel.id)}
                  >
                    <Plus className="h-3 w-3" />
                    Add Sub-channel
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Channel Modal */}
      <Dialog open={showChannelModal} onOpenChange={setShowChannelModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingChannel ? "Edit Channel" : selectedParentId ? "Create Sub-channel" : "Create New Channel"}
            </DialogTitle>
            <DialogDescription>
              {editingChannel
                ? "Update your channel settings"
                : "Set up a new channel for your embedded content"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Channel Name *</Label>
              <Input
                id="name"
                value={channelForm.name}
                onChange={(e) =>
                  setChannelForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Training Videos"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={channelForm.description}
                onChange={(e) =>
                  setChannelForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="What content will this channel feature?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="category">Category</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs h-6"
                  onClick={() => setShowCustomCategory(!showCustomCategory)}
                >
                  {showCustomCategory ? "Select Existing" : "+ Custom"}
                </Button>
              </div>
              {showCustomCategory ? (
                <Input
                  value={customCategory}
                  onChange={(e) => {
                    setCustomCategory(e.target.value);
                    setChannelForm((prev) => ({ ...prev, category: e.target.value }));
                  }}
                  placeholder="Enter custom category..."
                />
              ) : (
                <Select
                  value={channelForm.category}
                  onValueChange={(value) =>
                    setChannelForm((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Free/Paid Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div className="space-y-0.5">
                <Label>Free Channel</Label>
                <p className="text-sm text-muted-foreground">
                  {channelForm.is_free ? "Anyone can view without subscribing" : "Paid - set pricing below"}
                </p>
              </div>
              <Switch
                checked={channelForm.is_free}
                onCheckedChange={(checked) =>
                  setChannelForm((prev) => ({ 
                    ...prev, 
                    is_free: checked,
                    subscription_price: checked ? 0 : (prev.subscription_price || 49),
                    package_price: checked ? 0 : (prev.package_price || 199),
                    sell_individually: checked ? false : prev.sell_individually,
                  }))
                }
              />
            </div>

            {/* Always show pricing section */}
            <div className="space-y-4 p-4 rounded-lg border bg-secondary/20">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Pricing</h4>
                {channelForm.is_free && (
                  <Badge variant="secondary" className="text-xs">Free - R0</Badge>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="package_price" className={channelForm.is_free ? "text-muted-foreground" : ""}>
                  Package Price (R) - Full Channel Access
                </Label>
                <Input
                  id="package_price"
                  type="number"
                  min={0}
                  step={1}
                  value={channelForm.is_free ? 0 : channelForm.package_price}
                  onChange={(e) =>
                    setChannelForm((prev) => ({
                      ...prev,
                      package_price: parseFloat(e.target.value) || 0,
                    }))
                  }
                  disabled={channelForm.is_free}
                  className={channelForm.is_free ? "opacity-50" : ""}
                  placeholder="e.g., 199 for full package"
                />
                <p className="text-xs text-muted-foreground">
                  One-time price for access to all content in this channel
                </p>
              </div>

              {!channelForm.is_free && (
                <>
                  <div className="flex items-center justify-between py-2 p-3 rounded-lg bg-background/50 border">
                    <div className="space-y-0.5">
                      <Label>Allow Individual Purchases</Label>
                      <p className="text-sm text-muted-foreground">
                        {channelForm.sell_individually 
                          ? "Viewers can buy sub-channels separately" 
                          : "Sub-channels only available with package"}
                      </p>
                    </div>
                    <Switch
                      checked={channelForm.sell_individually}
                      onCheckedChange={(checked) =>
                        setChannelForm((prev) => ({ ...prev, sell_individually: checked }))
                      }
                    />
                  </div>

                  {channelForm.sell_individually && (
                    <div className="space-y-2">
                      <Label htmlFor="subscription_price">Individual Price (R/month)</Label>
                      <Input
                        id="subscription_price"
                        type="number"
                        min={0}
                        step={1}
                        value={channelForm.subscription_price}
                        onChange={(e) =>
                          setChannelForm((prev) => ({
                            ...prev,
                            subscription_price: parseFloat(e.target.value) || 0,
                          }))
                        }
                        placeholder="e.g., 49 per month"
                      />
                      <p className="text-xs text-muted-foreground">
                        Monthly subscription for this channel only
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Private Channel
                </Label>
                <p className="text-sm text-muted-foreground">
                  Hidden from public browse
                </p>
              </div>
              <Switch
                checked={channelForm.is_private}
                onCheckedChange={(checked) =>
                  setChannelForm((prev) => ({ ...prev, is_private: checked }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChannelModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveChannel}
              disabled={!channelForm.name.trim()}
            >
              {editingChannel ? "Save Changes" : "Create Channel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Content Picker Modal */}
      {contentPickerChannel && (
        <EmbedProChannelContentPicker
          channelId={contentPickerChannel.id}
          channelName={contentPickerChannel.name}
          profileId={profileId}
          open={!!contentPickerChannel}
          onOpenChange={(open) => !open && setContentPickerChannel(null)}
        />
      )}
    </div>
  );
}
