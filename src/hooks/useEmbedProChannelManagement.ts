import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Standalone Embed Pro Channel Management Hook
// Uses embed_pro_channels table (separate from VOD Pro and Elite Pro)

export interface EmbedProChannel {
  id: string;
  name: string;
  description?: string;
  thumbnail_url?: string;
  category?: string;
  is_free: boolean;
  subscription_price: number;
  package_price?: number;
  currency: string;
  subscriber_count: number;
  content_count: number;
  is_private: boolean;
  sell_individually?: boolean;
  owner_id: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
}

interface CreateEmbedProChannelInput {
  name: string;
  description?: string;
  thumbnail_url?: string;
  category?: string;
  is_free: boolean;
  subscription_price?: number;
  package_price?: number;
  sell_individually?: boolean;
  is_private?: boolean;
  parent_id?: string;
}

export function useEmbedProChannelManagement(profileId: string | undefined) {
  const [channels, setChannels] = useState<EmbedProChannel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChannels = useCallback(async () => {
    if (!profileId) {
      setChannels([]);
      setIsLoading(false);
      return;
    }

    try {
      // Fetch Embed Pro channels
      const { data: channelsData, error: channelsError } = await supabase
        .from("embed_pro_channels")
        .select("*")
        .eq("owner_id", profileId)
        .order("created_at", { ascending: false });

      if (channelsError) throw channelsError;

      // Fetch content counts from embed_pro_content
      const { data: contentCounts, error: countsError } = await supabase
        .from("embed_pro_content")
        .select("channel_id")
        .eq("owner_id", profileId)
        .not("channel_id", "is", null);

      if (countsError) throw countsError;

      // Build count map
      const countMap: Record<string, number> = {};
      (contentCounts || []).forEach((item) => {
        if (item.channel_id) {
          countMap[item.channel_id] = (countMap[item.channel_id] || 0) + 1;
        }
      });

      // Merge counts into channels
      const channelsWithCounts = (channelsData || []).map((ch) => ({
        ...ch,
        content_count: countMap[ch.id] || 0,
      }));

      setChannels(channelsWithCounts as EmbedProChannel[]);
    } catch (error) {
      console.error("Error fetching Embed Pro channels:", error);
      toast.error("Failed to load channels");
    } finally {
      setIsLoading(false);
    }
  }, [profileId]);

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  const createChannel = async (input: CreateEmbedProChannelInput): Promise<EmbedProChannel | null> => {
    if (!profileId) {
      toast.error("You must be logged in to create a channel");
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("embed_pro_channels")
        .insert({
          name: input.name,
          description: input.description,
          thumbnail_url: input.thumbnail_url,
          category: input.category,
          is_free: input.is_free,
          subscription_price: input.is_free ? 0 : (input.subscription_price || 0),
          package_price: input.is_free ? 0 : (input.package_price || 0),
          sell_individually: input.sell_individually ?? true,
          is_private: input.is_private || false,
          owner_id: profileId,
          parent_id: input.parent_id || null,
        })
        .select()
        .single();

      if (error) throw error;

      const newChannel = data as EmbedProChannel;
      setChannels((prev) => [newChannel, ...prev]);
      toast.success("Channel created successfully");
      return newChannel;
    } catch (error) {
      console.error("Error creating Embed Pro channel:", error);
      toast.error("Failed to create channel");
      return null;
    }
  };

  const updateChannel = async (
    channelId: string,
    updates: Partial<CreateEmbedProChannelInput>
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("embed_pro_channels")
        .update({
          name: updates.name,
          description: updates.description,
          category: updates.category,
          is_free: updates.is_free,
          subscription_price: updates.is_free ? 0 : (updates.subscription_price ?? 0),
          package_price: updates.is_free ? 0 : (updates.package_price ?? 0),
          sell_individually: updates.sell_individually ?? true,
          is_private: updates.is_private ?? false,
          parent_id: updates.parent_id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", channelId)
        .eq("owner_id", profileId);

      if (error) throw error;

      setChannels((prev) =>
        prev.map((ch) =>
          ch.id === channelId ? { ...ch, ...updates } : ch
        )
      );
      toast.success("Channel updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating Embed Pro channel:", error);
      toast.error("Failed to update channel");
      return false;
    }
  };

  const deleteChannel = async (channelId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("embed_pro_channels")
        .delete()
        .eq("id", channelId)
        .eq("owner_id", profileId);

      if (error) throw error;

      setChannels((prev) => prev.filter((ch) => ch.id !== channelId));
      toast.success("Channel deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting Embed Pro channel:", error);
      toast.error("Failed to delete channel");
      return false;
    }
  };

  return {
    channels,
    isLoading,
    createChannel,
    updateChannel,
    deleteChannel,
    refetch: fetchChannels,
    canCreateChannel: true,
  };
}
