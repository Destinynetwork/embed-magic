import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Video, 
  Settings, 
  Shield, 
  Sparkles, 
  AlertTriangle, 
  Loader2, 
  Trash2, 
  ListVideo, 
  Plus,
  Tag,
  Image,
  Link,
  Copy,
  Check,
  Baby,
  Info,
  Crown,
  Folder,
  Upload,
  Music,
  Ban,
  ShieldAlert
} from "lucide-react";

interface CreateVODContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileId: string;
  onSuccess: () => void;
  initialTab?: "basic" | "media" | "categories";
}

type ContentType = "Podcast" | "Series" | "Movie" | "Documentary" | "Single Video" | "Audio" | "Webinar" | "E-Book";

const CONTENT_TYPES: ContentType[] = ["Single Video", "Movie", "Series", "Documentary", "Podcast", "Audio", "Webinar", "E-Book"];
const CONTENT_RATINGS = ["G", "PG", "PG-13", "R", "NC-17", "All Ages", "General", "Parental Guidance", "Teen 14+", "Mature"];

// Pre-generated categories and genres from the platform
const MAIN_CATEGORIES = [
  "Music",
  "Food & Cooking",
  "Health & Fitness",
  "Technology",
  "Entertainment",
  "Documentaries",
  "Movies",
  "Podcast",
  "Education",
  "Sports",
  "News",
  "Religion",
  "Kids",
  "Lifestyle",
  "Drama Shows",
  "TV Shows",
];

const GENRES = [
  "Drama",
  "Comedy",
  "Documentary",
  "Action",
  "Thriller",
  "Sci-Fi",
  "Romance",
  "Horror",
  "Mystery",
  "Fantasy",
  "Animation",
  "Crime",
  "Biography",
  "History",
  "Musical",
  "War",
  "Western",
  "Family",
  "Adventure",
  "Sport",
];

const SUB_CATEGORIES: Record<string, string[]> = {
  "TV Shows": ["Recently Added", "Originals", "Favourites", "Brand New Shows", "Classic", "Reality"],
  "Movies": ["Action", "Comedy", "Horror", "Romance", "Thriller", "Sci-Fi", "Drama"],
  "Music": ["Pop", "Rock", "Hip-Hop", "Jazz", "Classical", "R&B", "Country", "Gospel"],
  "Documentaries": ["Nature", "History", "Science", "True Crime", "Biographies", "Travel"],
  "Drama Shows": ["Crime", "Legal", "Medical", "Family", "Period", "Anthology"],
  "Food & Cooking": ["Recipes", "Baking", "Healthy", "Quick Meals", "International"],
  "Podcast": ["Interviews", "Storytelling", "News", "Comedy", "Education", "True Crime"],
  "Education": ["Language", "Science", "Math", "History", "Art", "Coding"],
  "Sports": ["Football", "Basketball", "Soccer", "Tennis", "Golf", "Combat Sports"],
  "Religion": ["Sermons", "Bible Study", "Worship", "Testimonies", "Youth"],
  "Kids": ["Cartoons", "Educational", "Movies", "Music", "Games"],
  "Lifestyle": ["Fashion", "Beauty", "Home", "Travel", "Fitness", "Wellness"],
};

export default function CreateVODContentModal({
  open,
  onOpenChange,
  profileId,
  onSuccess,
  initialTab = "basic",
}: CreateVODContentModalProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Reset to initialTab when modal opens
  useEffect(() => {
    if (open) {
      setActiveTab(initialTab);
    }
  }, [open, initialTab]);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [copiedThumb, setCopiedThumb] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  // AI Thumbnail
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGenerationsUsed, setAiGenerationsUsed] = useState(0);
  const [generatingThumbnail, setGeneratingThumbnail] = useState(false);
  const aiGenerationsLimit = 25;

  // Basic Info
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentType, setContentType] = useState<ContentType>("Single Video");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  // Categories
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  // Genres
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [customGenre, setCustomGenre] = useState("");
  const [showCustomGenre, setShowCustomGenre] = useState(false);

  // Media & Embeds
  const [playlistMode, setPlaylistMode] = useState(false);
  const [embedUrls, setEmbedUrls] = useState<string[]>([""]);
  const [embedProvider, setEmbedProvider] = useState("");
  const [assetId, setAssetId] = useState("");
  const [sourcePlatform, setSourcePlatform] = useState("");
  const [duration, setDuration] = useState("");
  
  const isAudioContent = contentType === "Audio" || contentType === "Podcast";

  // Helper to detect embed provider from URL
  const detectProvider = (url: string): string => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube";
    if (url.includes("vimeo.com")) return "Vimeo";
    if (url.includes("gumlet.io") || url.includes("gumlet.com")) return "Gumlet";
    if (url.includes("adilo.")) return "Adilo";
    if (url.includes("wistia.")) return "Wistia";
    if (url.includes("soundcloud.com")) return "SoundCloud";
    if (url.includes("spotify.com")) return "Spotify";
    if (url.includes("dailymotion.com")) return "Dailymotion";
    if (url.match(/\.(mp4|webm|mp3|wav|m4a|ogg)(\?|$)/i)) return "Direct";
    return "Other";
  };

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...embedUrls];
    newUrls[index] = value;
    setEmbedUrls(newUrls);
    if (index === 0 && value) {
      const detected = detectProvider(value);
      setEmbedProvider(detected);
      setSourcePlatform(detected);
    }
  };

  const addEmbedUrl = () => {
    setEmbedUrls([...embedUrls, ""]);
  };

  const removeEmbedUrl = (index: number) => {
    if (embedUrls.length > 1) {
      setEmbedUrls(embedUrls.filter((_, i) => i !== index));
    }
  };

  // Player Settings
  const [autoplay, setAutoplay] = useState(false);
  const [loop, setLoop] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [directVideoUrl, setDirectVideoUrl] = useState(false);

  // Content Protection
  const [disableRightClick, setDisableRightClick] = useState(true); // Default ON for content protection
  const [allowDownload, setAllowDownload] = useState(false);
  const [passwordProtected, setPasswordProtected] = useState(false);
  const [watermark, setWatermark] = useState(false);
  const [drmEnabled, setDrmEnabled] = useState(false);
  
  // Trailer
  const [trailerUrl, setTrailerUrl] = useState("");
  const [trailerThumbnailUrl, setTrailerThumbnailUrl] = useState("");
  const [uploadingTrailerThumbnail, setUploadingTrailerThumbnail] = useState(false);
  const trailerThumbnailInputRef = useRef<HTMLInputElement>(null);

  // Pricing & Audience
  const [isSinglePurchase, setIsSinglePurchase] = useState(false);
  const [price, setPrice] = useState("");
  const [isMadeForKids, setIsMadeForKids] = useState(false);

  // Content Warnings (for adult/mature content)
  const [hasViolence, setHasViolence] = useState(false);
  const [hasNudity, setHasNudity] = useState(false);
  const [hasBadLanguage, setHasBadLanguage] = useState(false);
  const [hasGunshots, setHasGunshots] = useState(false);
  const [hasRacialRemarks, setHasRacialRemarks] = useState(false);
  
  // Creator Notes for moderation (justification for flagged content)
  const [creatorNotes, setCreatorNotes] = useState("");

  // Channel Hierarchy
  interface ChannelOption {
    id: string;
    name: string;
    parent_id: string | null;
    package_price: number | null;
    subscription_price: number | null;
    sell_individually: boolean | null;
  }
  const [parentChannels, setParentChannels] = useState<ChannelOption[]>([]);
  const [subChannels, setSubChannels] = useState<ChannelOption[]>([]);
  const [selectedParentChannel, setSelectedParentChannel] = useState("");
  const [selectedSubChannel, setSelectedSubChannel] = useState("");
  
  // Inline channel creation
  const [showCreateParent, setShowCreateParent] = useState(false);
  const [newParentName, setNewParentName] = useState("");
  const [newParentPrice, setNewParentPrice] = useState("");
  const [showCreateSub, setShowCreateSub] = useState(false);
  const [newSubName, setNewSubName] = useState("");
  const [newSubPrice, setNewSubPrice] = useState("");
  const [newSubSellSeparately, setNewSubSellSeparately] = useState(false);

  // Metadata
  const [cast, setCast] = useState("");
  const [director, setDirector] = useState("");
  const [producer, setProducer] = useState("");
  const [studio, setStudio] = useState("");
  const [country, setCountry] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [writer, setWriter] = useState("");
  const [contentRating, setContentRating] = useState("");
  const [language, setLanguage] = useState("");
  const [runtime, setRuntime] = useState("");
  const [musicComposer, setMusicComposer] = useState("");
  const [cinematographer, setCinematographer] = useState("");
  const [editor, setEditor] = useState("");
  const [subtitles, setSubtitles] = useState("");

  // Fetch channels for hierarchy selection
  useEffect(() => {
    const fetchChannels = async () => {
      const { data } = await supabase
        .from("channels")
        .select("id, name, parent_id, package_price, subscription_price, sell_individually")
        .eq("owner_id", profileId)
        .order("name");
      
      if (data) {
        // Parent channels have no parent_id
        setParentChannels(data.filter(ch => !ch.parent_id));
      }
    };
    
    if (profileId && open) {
      fetchChannels();
    }
  }, [profileId, open]);

  // Fetch sub-channels when parent is selected
  useEffect(() => {
    const fetchSubChannels = async () => {
      if (selectedParentChannel && selectedParentChannel !== "none") {
        const { data } = await supabase
          .from("channels")
          .select("id, name, parent_id, package_price, subscription_price, sell_individually")
          .eq("parent_id", selectedParentChannel)
          .order("display_order");
        
        if (data) {
          setSubChannels(data);
        }
      } else {
        setSubChannels([]);
      }
    };
    
    fetchSubChannels();
  }, [selectedParentChannel]);

  // Create parent channel inline
  const handleCreateParentChannel = async () => {
    if (!newParentName.trim()) {
      toast.error("Please enter a channel name");
      return;
    }

    const parsedPrice = newParentPrice ? Number.parseFloat(newParentPrice) : NaN;

    if (newParentPrice && !Number.isFinite(parsedPrice)) {
      toast.error("Please enter a valid package price");
      return;
    }

    const hasPrice = Number.isFinite(parsedPrice) && parsedPrice > 0;

    const { data, error } = await supabase
      .from("channels")
      .insert({
        name: newParentName.trim(),
        owner_id: profileId,
        // Parent channel subscription price (the "package")
        subscription_price: hasPrice ? parsedPrice : 0,
        // Keep legacy field for any UI still referencing it
        package_price: hasPrice ? parsedPrice : null,
        is_free: !hasPrice,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to create channel");
      return;
    }

    // Refresh and select
    setParentChannels(prev => [...prev, data as ChannelOption]);
    setSelectedParentChannel(data.id);
    setNewParentName("");
    setNewParentPrice("");
    setShowCreateParent(false);
    toast.success("Parent channel created!");
  };

  // Create sub-channel inline
  const handleCreateSubChannel = async () => {
    if (!newSubName.trim() || !selectedParentChannel || selectedParentChannel === "none") {
      toast.error("Please enter a sub-channel name");
      return;
    }

    // If price is entered, auto-enable sell_individually
    const hasPrice = newSubPrice && parseFloat(newSubPrice) > 0;
    const sellSeparately = hasPrice || newSubSellSeparately;

    const { data, error } = await supabase
      .from("channels")
      .insert({
        name: newSubName.trim(),
        owner_id: profileId,
        parent_id: selectedParentChannel,
        sell_individually: sellSeparately,
        subscription_price: hasPrice ? parseFloat(newSubPrice) : null,
        is_free: !hasPrice,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to create sub-channel");
      return;
    }

    // Refresh and select
    setSubChannels(prev => [...prev, data as ChannelOption]);
    setSelectedSubChannel(data.id);
    setNewSubName("");
    setNewSubPrice("");
    setNewSubSellSeparately(false);
    setShowCreateSub(false);
    toast.success(`Sub-channel created! ${hasPrice ? `Price: R${newSubPrice}/month` : 'Package only'}`);
  };

  const handleCopyEmbed = () => {
    if (embedUrls[0]) {
      navigator.clipboard.writeText(embedUrls[0]);
      setCopiedEmbed(true);
      toast.success("Embed URL copied!");
      setTimeout(() => setCopiedEmbed(false), 2000);
    }
  };

  const handleCopyThumbnail = () => {
    if (thumbnailUrl) {
      navigator.clipboard.writeText(thumbnailUrl);
      setCopiedThumb(true);
      toast.success("Thumbnail URL copied!");
      setTimeout(() => setCopiedThumb(false), 2000);
    }
  };

  // Audio Cover Upload Handler
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploadingCover(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `cover-${Date.now()}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("audio-covers")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("audio-covers")
        .getPublicUrl(filePath);

      setThumbnailUrl(publicUrl);
      toast.success("Cover image uploaded!");
    } catch (error) {
      console.error("Error uploading cover:", error);
      toast.error("Failed to upload cover image");
    } finally {
      setUploadingCover(false);
    }
  };

  // Thumbnail Upload Handler (for video content)
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be less than 10MB");
      return;
    }

    setUploadingThumbnail(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("profile_id", profileId);
      formData.append("image_type", "thumbnail");

      const { data, error } = await supabase.functions.invoke("gumlet-upload-image", {
        body: formData,
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      if (data?.image_url) {
        setThumbnailUrl(data.image_url);
        toast.success("Thumbnail uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      toast.error("Failed to upload thumbnail. Please try again.");
    } finally {
      setUploadingThumbnail(false);
    }
  };

  // Trailer Thumbnail Upload Handler
  const handleTrailerThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be less than 10MB");
      return;
    }

    setUploadingTrailerThumbnail(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("profile_id", profileId);
      formData.append("image_type", "trailer-thumbnail");

      const { data, error } = await supabase.functions.invoke("gumlet-upload-image", {
        body: formData,
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      if (data?.image_url) {
        setTrailerThumbnailUrl(data.image_url);
        toast.success("Trailer thumbnail uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading trailer thumbnail:", error);
      toast.error("Failed to upload trailer thumbnail. Please try again.");
    } finally {
      setUploadingTrailerThumbnail(false);
    }
  };

  // AI Thumbnail Generator
  const handleGenerateThumbnail = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please describe your thumbnail first");
      return;
    }

    if (aiGenerationsUsed >= aiGenerationsLimit) {
      toast.error("You've reached your monthly AI generation limit");
      return;
    }

    setGeneratingThumbnail(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-thumbnail", {
        body: { prompt: aiPrompt }
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      if (data?.imageUrl) {
        setThumbnailUrl(data.imageUrl);
        setAiGenerationsUsed(prev => prev + 1);
        toast.success("Thumbnail generated successfully!");
      }
    } catch (error) {
      console.error("Error generating thumbnail:", error);
      if (error instanceof Error && error.message.includes("429")) {
        toast.error("Rate limit exceeded. Please try again later.");
      } else if (error instanceof Error && error.message.includes("402")) {
        toast.error("AI credits exhausted. Please add credits to continue.");
      } else {
        toast.error("Failed to generate thumbnail. Please try again.");
      }
    } finally {
      setGeneratingThumbnail(false);
    }
  };

  const handleAddCustomCategory = () => {
    if (customCategory.trim()) {
      setMainCategory(customCategory.trim());
      setCustomCategory("");
      setShowCustomCategory(false);
      toast.success("Custom category added!");
    }
  };

  const handleAddCustomGenre = () => {
    if (customGenre.trim() && !selectedGenres.includes(customGenre.trim())) {
      setSelectedGenres([...selectedGenres, customGenre.trim()]);
      setCustomGenre("");
      setShowCustomGenre(false);
      toast.success("Custom genre added!");
    }
  };

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setContentType("Single Video");
    setThumbnailUrl("");
    setMainCategory("");
    setSubCategory("");
    setCustomCategory("");
    setShowCustomCategory(false);
    setSelectedGenres([]);
    setCustomGenre("");
    setShowCustomGenre(false);
    setPlaylistMode(false);
    setEmbedUrls([""]);
    setEmbedProvider("");
    setAssetId("");
    setSourcePlatform("");
    setDuration("");
    setAutoplay(false);
    setLoop(false);
    setShowControls(true);
    setDirectVideoUrl(false);
    setDisableRightClick(true);
    setAllowDownload(false);
    setPasswordProtected(false);
    setWatermark(false);
    setDrmEnabled(false);
    setTrailerUrl("");
    setIsSinglePurchase(false);
    setPrice("");
    setIsMadeForKids(false);
    setHasViolence(false);
    setHasNudity(false);
    setHasBadLanguage(false);
    setHasGunshots(false);
    setHasRacialRemarks(false);
    setCreatorNotes("");
    setCast("");
    setDirector("");
    setProducer("");
    setStudio("");
    setCountry("");
    setReleaseYear("");
    setWriter("");
    setContentRating("");
    setLanguage("");
    setRuntime("");
    setMusicComposer("");
    setCinematographer("");
    setEditor("");
    setSubtitles("");
    setAiPrompt("");
    setActiveTab("basic");
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    // Category is required for discovery
    if (!mainCategory) {
      toast.error("Category is required for content discovery");
      return;
    }

    const validUrls = embedUrls.filter(url => url.trim());
    if (validUrls.length === 0) {
      toast.error("At least one embed URL is required");
      return;
    }

    setSaving(true);

    try {
      // Determine channel_id: prefer sub-channel, fallback to parent, or null if neither
      let finalChannelId: string | null = null;
      if (selectedSubChannel && selectedSubChannel !== "none") {
        finalChannelId = selectedSubChannel;
      } else if (selectedParentChannel && selectedParentChannel !== "none") {
        finalChannelId = selectedParentChannel;
      }

      // Check if content needs moderation (any content warning checked)
      const hasContentWarnings = hasViolence || hasNudity || hasBadLanguage || hasGunshots || hasRacialRemarks;
      
      // Build moderation flags object for database
      const moderationFlags = {
        violence: hasViolence,
        nudity: hasNudity,
        bad_language: hasBadLanguage,
        gunshots: hasGunshots,
        racial_remarks: hasRacialRemarks,
      };
      
      // If NOT made for kids and NO content warnings checked, auto-approve
      // If content warnings are checked, require moderation
      const autoApprove = !hasContentWarnings && isMadeForKids;
      const qaStatus = hasContentWarnings ? "pending_moderation" : (autoApprove ? "approved" : "pending");
      
      // Build QA notes if any warnings
      const warningNotes: string[] = [];
      if (hasViolence) warningNotes.push("Violence");
      if (hasNudity) warningNotes.push("Nudity");
      if (hasBadLanguage) warningNotes.push("Bad Language");
      if (hasGunshots) warningNotes.push("Gunshots");
      if (hasRacialRemarks) warningNotes.push("Racial Remarks");
      
      // If has warnings, apply 16+ age restriction automatically
      const effectiveAgeRestriction = hasContentWarnings ? "16+" : "all";

      // Insert content asset with channel assignment if selected
      const { data: assetData, error: assetError } = await supabase
        .from("content_assets")
        .insert({
          title,
          description,
          content_type: contentType as any,
          thumbnail_url: thumbnailUrl || null,
          embed_urls: validUrls,
          // IMPORTANT: Elite Pro UI filters case-sensitively for "Adilo".
          // Keep other providers lowercased (youtube, vimeo, etc.).
          embed_provider: (embedProvider?.toLowerCase() === "adilo" ? "Adilo" : embedProvider.toLowerCase()) || null,
          source_platform: sourcePlatform || null,
          asset_id: assetId || `vod-${Date.now()}`,
          owner_id: profileId,
          sub_category: subCategory || null,
          channel_id: finalChannelId,
          is_ppv: isSinglePurchase,
          price: isSinglePurchase && price ? parseFloat(price) : 0,
          is_approved: autoApprove,
          qa_status: qaStatus,
          qa_notes: warningNotes.length > 0 ? `Content warnings: ${warningNotes.join(", ")}. Age restriction: ${effectiveAgeRestriction}` : null,
          duration_seconds: duration ? parseInt(duration) * 60 : null,
          is_made_for_kids: isMadeForKids,
          drm_enabled: drmEnabled,
          // New moderation fields
          moderation_flags: hasContentWarnings ? moderationFlags : null,
          creator_notes: creatorNotes.trim() || null,
          age_restriction: effectiveAgeRestriction,
          moderation_requested_at: hasContentWarnings ? new Date().toISOString() : null,
        } as any)
        .select()
        .single();

      if (assetError) throw assetError;

      // Insert metadata if any fields are filled
      if (director || cast || producer || studio || country || releaseYear || writer || language || runtime || contentRating || selectedGenres.length > 0 || musicComposer || cinematographer || editor || subtitles) {
        const { error: metadataError } = await supabase
          .from("content_metadata")
          .insert({
            asset_id: assetData.id,
            director: director || null,
            cast_members: cast ? cast.split(",").map((s) => s.trim()) : null,
            producer: producer || null,
            studio: studio || null,
            country: country || null,
            year_of_release: releaseYear ? parseInt(releaseYear) : null,
            writer: writer || null,
            language: language || null,
            runtime_minutes: runtime ? parseInt(runtime) : null,
            content_rating: contentRating || null,
            genres: selectedGenres.length > 0 ? selectedGenres : null,
            music_composer: musicComposer || null,
            cinematographer: cinematographer || null,
            editor: editor || null,
            subtitles: subtitles ? subtitles.split(",").map((s) => s.trim()) : null,
          });

        if (metadataError) {
          console.error("Metadata error:", metadataError);
        }
      }

      const channelMsg = finalChannelId 
        ? "Content saved and assigned to channel!" 
        : "Content added to library. Assign to channels in the Channels tab.";
      toast.success(channelMsg);
      resetForm();
      onSuccess();
    } catch (error) {
      console.error("Error creating content:", error);
      toast.error("Failed to create content. Please sign in first.");
    } finally {
      setSaving(false);
    }
  };

  const availableSubCategories = mainCategory ? SUB_CATEGORIES[mainCategory] || [] : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Video className="h-6 w-6 text-primary" />
            Add VOD Content
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Add video content to your library. Assign to channels later in the Channels tab.
          </p>
        </DialogHeader>

        {/* Library-First Notice */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-400">Library-First Workflow</p>
            <p className="text-xs text-muted-foreground">
              Content is added to your library first. Use the <strong>Channels tab</strong> to organize and assign content to your channels.
            </p>
          </div>
        </div>

        {/* Admin Approval Notice */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-400">Content Review Required</p>
            <p className="text-xs text-muted-foreground">
              All content is submitted for admin review before going live.
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "basic" | "media" | "categories")} className="mt-4">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="basic">Basic Info & Metadata</TabsTrigger>
            <TabsTrigger value="media">Media & Embed</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter content title"
                />
              </div>
              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select value={contentType} onValueChange={(v) => setContentType(v as ContentType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTENT_TYPES.map((type) => (
                      <SelectItem key={type} value={type} className="capitalize">
                        {type.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Playlist Mode Toggle */}
            <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ListVideo className="h-5 w-5 text-purple-400" />
                  <div>
                    <span className="font-medium">Playlist Mode</span>
                    <p className="text-xs text-muted-foreground">Enable to add multiple embed URLs for a playlist</p>
                  </div>
                </div>
                <Switch checked={playlistMode} onCheckedChange={setPlaylistMode} />
              </div>
            </div>

            {/* Made for Kids Toggle */}
            <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Baby className="h-5 w-5 text-cyan-400" />
                  <div>
                    <span className="font-medium">Made for Kids</span>
                    <p className="text-xs text-muted-foreground">This content is directed at children</p>
                  </div>
                </div>
                <Switch 
                  checked={isMadeForKids} 
                  onCheckedChange={(checked) => {
                    setIsMadeForKids(checked);
                    // Reset content warnings when switching to kids content
                    if (checked) {
                      setHasViolence(false);
                      setHasNudity(false);
                      setHasBadLanguage(false);
                      setHasGunshots(false);
                      setHasRacialRemarks(false);
                    }
                  }} 
                />
              </div>
            </div>

            {/* Content Warnings Section - Only shown when NOT made for kids */}
            {!isMadeForKids && (
              <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-orange-400" />
                  <div>
                    <span className="font-medium">Content Declaration</span>
                    <p className="text-xs text-muted-foreground">
                      Please indicate if your content contains any of the following:
                    </p>
                  </div>
                </div>
                
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center space-x-3 p-2 rounded-md bg-background/50">
                    <Checkbox 
                      id="violence" 
                      checked={hasViolence} 
                      onCheckedChange={(checked) => setHasViolence(checked as boolean)} 
                    />
                    <Label htmlFor="violence" className="cursor-pointer text-sm">
                      Violence Displayed
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-2 rounded-md bg-background/50">
                    <Checkbox 
                      id="nudity" 
                      checked={hasNudity} 
                      onCheckedChange={(checked) => setHasNudity(checked as boolean)} 
                    />
                    <Label htmlFor="nudity" className="cursor-pointer text-sm">
                      Nudity
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-2 rounded-md bg-background/50">
                    <Checkbox 
                      id="badLanguage" 
                      checked={hasBadLanguage} 
                      onCheckedChange={(checked) => setHasBadLanguage(checked as boolean)} 
                    />
                    <Label htmlFor="badLanguage" className="cursor-pointer text-sm">
                      Bad Language
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-2 rounded-md bg-background/50">
                    <Checkbox 
                      id="gunshots" 
                      checked={hasGunshots} 
                      onCheckedChange={(checked) => setHasGunshots(checked as boolean)} 
                    />
                    <Label htmlFor="gunshots" className="cursor-pointer text-sm">
                      Gunshots / Weapons
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-2 rounded-md bg-background/50 sm:col-span-2">
                    <Checkbox 
                      id="racialRemarks" 
                      checked={hasRacialRemarks} 
                      onCheckedChange={(checked) => setHasRacialRemarks(checked as boolean)} 
                    />
                    <Label htmlFor="racialRemarks" className="cursor-pointer text-sm">
                      Racial Remarks
                    </Label>
                  </div>
                </div>

                {/* Auto-moderation notice */}
                {(hasViolence || hasNudity || hasBadLanguage || hasGunshots || hasRacialRemarks) && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-400">Content Subject to Moderation</p>
                      <p className="text-xs text-muted-foreground">
                        This content will be reviewed by our moderation team and will automatically receive a <strong>16+ age restriction</strong>.
                      </p>
                    </div>
                  </div>
                )}

                {/* Creator Notes for Moderation */}
                {(hasViolence || hasNudity || hasBadLanguage || hasGunshots || hasRacialRemarks) && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Notes for Moderators <span className="text-muted-foreground font-normal">(Optional)</span>
                    </Label>
                    <Textarea
                      value={creatorNotes}
                      onChange={(e) => setCreatorNotes(e.target.value)}
                      placeholder="Explain the context for flagged content (e.g., 'Violence is depicted in a historical documentary context', 'Language warning at 12:45 for a single instance'). This helps moderators make informed decisions."
                      rows={3}
                      className="text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your notes will be visible to moderators reviewing your content.
                    </p>
                  </div>
                )}

                {/* Compliance Warning */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                  <Ban className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-400">⚠️ Compliance Notice</p>
                    <p className="text-xs text-muted-foreground">
                      Failure to accurately declare content warnings may result in your account being <strong>banned and locked</strong>. 
                      To restore your account, you will need to email <strong>banned@supaviewtv.co.za</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter content description"
                rows={3}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Source Platform</Label>
                <Input
                  value={sourcePlatform}
                  onChange={(e) => setSourcePlatform(e.target.value)}
                  placeholder="YouTube, Vimeo, Wistia..."
                />
              </div>
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 45"
                />
              </div>
            </div>

            {/* Production Metadata Section - Integrated into Basic Info */}
            <Card className="mt-4">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-amber-400" />
                  <h3 className="font-semibold">Production Details</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Optional metadata for movies, series, and documentaries.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Cast (comma separated)</Label>
                    <Input
                      value={cast}
                      onChange={(e) => setCast(e.target.value)}
                      placeholder="Actor 1, Actor 2, Actor 3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Director</Label>
                    <Input
                      value={director}
                      onChange={(e) => setDirector(e.target.value)}
                      placeholder="Director name"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Producer</Label>
                    <Input
                      value={producer}
                      onChange={(e) => setProducer(e.target.value)}
                      placeholder="Producer name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Studio</Label>
                    <Input
                      value={studio}
                      onChange={(e) => setStudio(e.target.value)}
                      placeholder="Production studio"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Writer</Label>
                    <Input
                      value={writer}
                      onChange={(e) => setWriter(e.target.value)}
                      placeholder="Writer name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Music Composer</Label>
                    <Input
                      value={musicComposer}
                      onChange={(e) => setMusicComposer(e.target.value)}
                      placeholder="Composer name"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Cinematographer</Label>
                    <Input
                      value={cinematographer}
                      onChange={(e) => setCinematographer(e.target.value)}
                      placeholder="Cinematographer name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Editor</Label>
                    <Input
                      value={editor}
                      onChange={(e) => setEditor(e.target.value)}
                      placeholder="Editor name"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Country of origin"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Release Year</Label>
                    <Input
                      type="number"
                      value={releaseYear}
                      onChange={(e) => setReleaseYear(e.target.value)}
                      placeholder="2024"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Input
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      placeholder="e.g. English"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Content Rating</Label>
                    <Select value={contentRating} onValueChange={setContentRating}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONTENT_RATINGS.map((rating) => (
                          <SelectItem key={rating} value={rating}>
                            {rating}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Subtitles (comma separated)</Label>
                  <Input
                    value={subtitles}
                    onChange={(e) => setSubtitles(e.target.value)}
                    placeholder="English, Spanish, French"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Thumbnail Section */}
            <div className="space-y-3">
              <Label>
                {isAudioContent ? "Cover Image" : "Thumbnail"}
              </Label>
              
              {/* Audio Cover Upload Section */}
              {isAudioContent && (
                <div className="rounded-lg border border-violet-500/30 bg-violet-500/5 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Music className="h-5 w-5 text-violet-400" />
                    <span className="font-medium">Audio Cover Image</span>
                  </div>
                  
                  {/* Cover Preview */}
                  {thumbnailUrl && (
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-border">
                      <img 
                        src={thumbnailUrl} 
                        alt="Cover" 
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => setThumbnailUrl("")}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  
                  {/* Upload Button */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingCover}
                    className="gap-2"
                  >
                    {uploadingCover ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Upload Cover Image
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Upload an album art or cover image for your audio. Max 5MB.
                  </p>
                </div>
              )}

              {/* Video Thumbnail Upload Section */}
              {!isAudioContent && (
                <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Image className="h-5 w-5 text-green-400" />
                    <span className="font-medium">Upload Thumbnail</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Direct Upload</Badge>
                  </div>
                  
                  {/* Thumbnail Preview */}
                  {thumbnailUrl && (
                    <div className="relative w-full max-w-xs aspect-video rounded-lg overflow-hidden border border-border">
                      <img 
                        src={thumbnailUrl} 
                        alt="Thumbnail" 
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7"
                        onClick={() => setThumbnailUrl("")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  {/* Upload Button */}
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => thumbnailInputRef.current?.click()}
                      disabled={uploadingThumbnail}
                      className="gap-2 flex-1"
                    >
                      {uploadingThumbnail ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          Upload Image
                        </>
                      )}
                    </Button>
                    {thumbnailUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleCopyThumbnail}
                        title="Copy URL"
                      >
                        {copiedThumb ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload your thumbnail image directly. Max 10MB. Once uploaded, use the URL below.
                  </p>
                </div>
              )}
              
              {/* Manual URL Input */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  {thumbnailUrl ? "Thumbnail URL (auto-filled)" : "Or paste thumbnail URL manually"}
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder={isAudioContent ? "Paste cover image URL..." : "https://example.com/thumbnail.jpg"}
                    className="flex-1"
                  />
                  {thumbnailUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleCopyThumbnail}
                      title="Copy URL"
                    >
                      {copiedThumb ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* AI Thumbnail Generator */}
            <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  <span className="font-medium">AI Thumbnail Generator</span>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">PRO Feature</Badge>
                </div>
                <span className="text-sm text-muted-foreground">
                  {aiGenerationsUsed}/{aiGenerationsLimit} Used
                </span>
              </div>
              <Input
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe your thumbnail (e.g., 'Modern tech background with circuits')"
                className="bg-background/50"
                disabled={generatingThumbnail}
              />
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Monthly Generations</div>
                <Progress value={(aiGenerationsUsed / aiGenerationsLimit) * 100} className="h-2" />
              </div>
              {thumbnailUrl && thumbnailUrl.startsWith("data:image") && (
                <div className="relative rounded-lg overflow-hidden border border-border">
                  <img 
                    src={thumbnailUrl} 
                    alt="Generated thumbnail" 
                    className="w-full h-32 object-cover"
                  />
                </div>
              )}
              <Button 
                className="w-full gap-2 bg-purple-500 hover:bg-purple-600"
                onClick={handleGenerateThumbnail}
                disabled={generatingThumbnail || !aiPrompt.trim() || aiGenerationsUsed >= aiGenerationsLimit}
              >
                {generatingThumbnail ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Media & Embed Tab */}
          <TabsContent value="media" className="space-y-4 mt-4">
            {/* Embed URL Section */}
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Link className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Embed URLs</h3>
                  <Badge variant="secondary">Required</Badge>
                </div>
                
                {embedUrls.map((url, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={url}
                        onChange={(e) => handleUrlChange(index, e.target.value)}
                        placeholder="Paste embed URL (YouTube, Vimeo, Gumlet, etc)..."
                        className="flex-1 font-mono text-sm"
                      />
                      {url && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={handleCopyEmbed}
                        >
                          {copiedEmbed ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      )}
                      {playlistMode && embedUrls.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeEmbedUrl(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {url && (
                      <p className="text-xs text-muted-foreground font-mono bg-muted/50 p-2 rounded truncate">
                        {url}
                      </p>
                    )}
                  </div>
                ))}
                
                {playlistMode && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addEmbedUrl}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Playlist Item
                  </Button>
                )}
                
                {embedUrls.filter(u => u.trim()).length > 1 && (
                  <Badge variant="secondary" className="gap-1">
                    <ListVideo className="h-3 w-3" />
                    Playlist: {embedUrls.filter(u => u.trim()).length} items
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Thumbnail Section */}
            <Card className="border-emerald-500/30 bg-emerald-500/5">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Image className="h-5 w-5 text-emerald-500" />
                  <h3 className="font-semibold">Thumbnail URL</h3>
                </div>
                
                <div className="flex gap-2">
                  <Input
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="Paste thumbnail URL..."
                    className="flex-1 font-mono text-sm"
                  />
                  {thumbnailUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleCopyThumbnail}
                    >
                      {copiedThumb ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
                
                {/* Upload Thumbnail from Device */}
                <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm font-medium">Upload Thumbnail from Device</span>
                  </div>
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => thumbnailInputRef.current?.click()}
                    disabled={uploadingThumbnail}
                    className="gap-2 w-full"
                  >
                    {uploadingThumbnail ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Choose Image File
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Recommended size: <span className="font-medium text-emerald-400">1280 × 720 px</span> (16:9 ratio). Max file size: 10MB.
                  </p>
                </div>
                
                {thumbnailUrl && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-mono bg-muted/50 p-2 rounded truncate">
                      {thumbnailUrl}
                    </p>
                    <div className="aspect-video max-w-xs rounded-lg overflow-hidden border">
                      <img 
                        src={thumbnailUrl} 
                        alt="Thumbnail preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Player Settings */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-amber-500" />
                  <h3 className="font-semibold">Player Settings</h3>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Autoplay</span>
                    <Switch checked={autoplay} onCheckedChange={setAutoplay} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Loop</span>
                    <Switch checked={loop} onCheckedChange={setLoop} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Show Controls</span>
                    <Switch checked={showControls} onCheckedChange={setShowControls} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Direct Video URL</span>
                    <Switch checked={directVideoUrl} onCheckedChange={setDirectVideoUrl} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Protection */}
            <Card className="border-emerald-500/30 bg-emerald-500/5">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-500" />
                  <h3 className="font-semibold">Content Protection</h3>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">PRO</Badge>
                </div>
                
                {/* Primary Protection - Right-Click */}
                <div className="p-3 rounded-lg bg-background border border-emerald-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">🛡️ Disable Right-Click</span>
                      <p className="text-xs text-muted-foreground">Prevents users from right-clicking to download or copy content</p>
                    </div>
                    <Switch checked={disableRightClick} onCheckedChange={setDisableRightClick} />
                  </div>
                  {disableRightClick && (
                    <p className="text-xs text-emerald-400 mt-2">✓ Content download protection is active</p>
                  )}
                </div>

                {/* Allow Download Toggle - Only shown when right-click is disabled */}
                {disableRightClick && (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">📥 Allow Download</span>
                        <p className="text-xs text-muted-foreground">Override: Allow specific users to download this content</p>
                      </div>
                      <Switch checked={allowDownload} onCheckedChange={setAllowDownload} />
                    </div>
                    {allowDownload && (
                      <p className="text-xs text-amber-400 mt-2">⚠️ Downloads enabled for purchased/subscribed users</p>
                    )}
                  </div>
                )}
                
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* DRM Protection */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background border">
                    <div>
                      <span className="text-sm font-medium">🔐 DRM Protection</span>
                      <p className="text-xs text-muted-foreground">Digital Rights Management</p>
                    </div>
                    <Switch checked={drmEnabled} onCheckedChange={setDrmEnabled} />
                  </div>
                  
                  {/* Password Protected */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background border">
                    <div>
                      <span className="text-sm font-medium">🔑 Password Protected</span>
                      <p className="text-xs text-muted-foreground">Require password to view</p>
                    </div>
                    <Switch checked={passwordProtected} onCheckedChange={setPasswordProtected} />
                  </div>
                  
                  {/* Watermark */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background border sm:col-span-2">
                    <div>
                      <span className="text-sm font-medium">💧 Watermark</span>
                      <p className="text-xs text-muted-foreground">Add watermark overlay on playback</p>
                    </div>
                    <Switch checked={watermark} onCheckedChange={setWatermark} />
                  </div>
                </div>

                {/* DRM Premium Notice */}
                {drmEnabled && (
                  <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-purple-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-purple-400">DRM is a Premium Add-on</p>
                        <p className="text-xs text-muted-foreground">
                          DRM protection requires additional setup and may incur extra costs. Contact support for details.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Trailer URL */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-pink-500" />
                  <h3 className="font-semibold">Trailer</h3>
                  <Badge variant="outline">Optional</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Add a trailer URL to give viewers a preview of your content before purchasing.
                </p>
                <Input
                  value={trailerUrl}
                  onChange={(e) => setTrailerUrl(e.target.value)}
                  placeholder="Paste trailer URL (YouTube, Vimeo, etc)..."
                  className="font-mono text-sm"
                />
                
                {/* Trailer Thumbnail Upload */}
                <div className="p-3 rounded-lg border border-pink-500/20 bg-pink-500/5 space-y-2">
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-pink-400" />
                    <span className="text-sm font-medium">Upload Trailer Thumbnail from Device</span>
                  </div>
                  <input
                    ref={trailerThumbnailInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleTrailerThumbnailUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => trailerThumbnailInputRef.current?.click()}
                    disabled={uploadingTrailerThumbnail}
                    className="gap-2 w-full"
                  >
                    {uploadingTrailerThumbnail ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Choose Trailer Thumbnail
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Recommended size: <span className="font-medium text-pink-400">1280 × 720 px</span> (16:9 ratio). Max file size: 10MB.
                  </p>
                  {trailerThumbnailUrl && (
                    <div className="space-y-2 mt-2">
                      <p className="text-xs text-muted-foreground font-mono bg-muted/50 p-2 rounded truncate">
                        {trailerThumbnailUrl}
                      </p>
                      <div className="aspect-video max-w-xs rounded-lg overflow-hidden border border-pink-500/30">
                        <img 
                          src={trailerThumbnailUrl} 
                          alt="Trailer thumbnail preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                {trailerUrl && (
                  <p className="text-xs text-green-400">✓ Trailer will be shown on content page</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories & Genres Tab */}
          <TabsContent value="categories" className="space-y-4 mt-4">
            {/* Channel & Pricing - FIRST - Most important setup */}
            <Card className="border-primary/30">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-400" />
                  <h3 className="font-semibold">Channel & Pricing</h3>
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Required</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Set up your channel structure. Parent channel = full package price. Sub-channels = individual categories viewers can subscribe to separately.
                </p>

                {/* PARENT CHANNEL SECTION */}
                <div className="p-4 border rounded-lg bg-secondary/20 space-y-3">
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4 text-amber-400" />
                    <Label className="font-semibold">Parent Channel (Main Package)</Label>
                  </div>
                  
                  <Select value={selectedParentChannel} onValueChange={(value) => {
                    setSelectedParentChannel(value);
                    setSelectedSubChannel("");
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Channel Assignment</SelectItem>
                      {parentChannels.map((ch) => {
                        const parentPrice = (ch.package_price ?? ch.subscription_price ?? 0) as number;
                        const isFree = !parentPrice || parentPrice === 0;
                        return (
                          <SelectItem key={ch.id} value={ch.id}>
                            {ch.name} {isFree ? "— Free" : `— R${parentPrice}/month (Full Package)`}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  
                  {/* Create New Parent */}
                  {!showCreateParent ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCreateParent(true)}
                      className="gap-2 w-full"
                    >
                      <Plus className="h-4 w-4" />
                      Create New Parent Channel
                    </Button>
                  ) : (
                    <div className="p-3 border rounded-lg bg-background space-y-3">
                      <Input
                        value={newParentName}
                        onChange={(e) => setNewParentName(e.target.value)}
                        placeholder="Parent channel name (e.g. Christian Channel, Sports Network)..."
                      />
                      <div>
                        <Label className="text-xs">Full Package Price (R/month)</Label>
                        <Input
                          type="number"
                          value={newParentPrice}
                          onChange={(e) => setNewParentPrice(e.target.value)}
                          placeholder="e.g. 99 (0 = Free)"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Viewers pay this for access to ALL sub-channels within this parent
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleCreateParentChannel} className="flex-1">Create Parent</Button>
                        <Button size="sm" variant="outline" onClick={() => setShowCreateParent(false)}>Cancel</Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* SUB-CHANNELS SECTION - Only show when parent is selected */}
                {selectedParentChannel && selectedParentChannel !== "none" && (
                  <div className="p-4 border-l-4 border-primary/50 bg-primary/5 rounded-r-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ListVideo className="h-4 w-4 text-primary" />
                        <Label className="font-semibold">Sub-Channels (Categories)</Label>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {subChannels.length} sub-channel{subChannels.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      Each sub-channel is a category viewers can subscribe to individually (e.g. Gospel Music, Sermons, Youth Content)
                    </p>

                    {/* List of existing sub-channels with prices */}
                    {subChannels.length > 0 && (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {subChannels.map((ch) => (
                          <div 
                            key={ch.id} 
                            className={`p-2 rounded border cursor-pointer transition-colors ${
                              selectedSubChannel === ch.id 
                                ? 'border-primary bg-primary/10' 
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => setSelectedSubChannel(ch.id)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">{ch.name}</span>
                              <Badge variant={ch.subscription_price ? "default" : "secondary"} className="text-xs">
                                {ch.subscription_price 
                                  ? `R${ch.subscription_price}/month` 
                                  : 'Package Only'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Assign to sub-channel dropdown */}
                    <div className="space-y-2">
                      <Label className="text-xs">Assign this content to:</Label>
                      <Select value={selectedSubChannel} onValueChange={setSelectedSubChannel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sub-channel for this content" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Direct to Parent (no specific sub-channel)</SelectItem>
                          {subChannels.map((ch) => (
                            <SelectItem key={ch.id} value={ch.id}>
                              {ch.name} {ch.sell_individually && ch.subscription_price ? `— R${ch.subscription_price}/month` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Add New Sub-channel */}
                    {!showCreateSub ? (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => setShowCreateSub(true)}
                        className="gap-2 w-full"
                      >
                        <Plus className="h-4 w-4" />
                        Add Sub-Channel with Pricing
                      </Button>
                    ) : (
                      <div className="p-3 border rounded-lg bg-background space-y-3">
                        <Input
                          value={newSubName}
                          onChange={(e) => setNewSubName(e.target.value)}
                          placeholder="Sub-channel name (e.g. Gospel Music, Sermons, Worship)..."
                        />
                        
                        {/* Price input is always visible - entering price auto-enables sell separately */}
                        <div>
                          <Label className="text-xs">Individual Price (R/month)</Label>
                          <Input
                            type="number"
                            value={newSubPrice}
                            onChange={(e) => {
                              setNewSubPrice(e.target.value);
                              // Auto-enable sell separately when price is entered
                              if (e.target.value && parseFloat(e.target.value) > 0) {
                                setNewSubSellSeparately(true);
                              }
                            }}
                            placeholder="e.g. 50 (leave empty for package-only)"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Enter price to allow viewers to subscribe to ONLY this sub-channel
                          </p>
                        </div>

                        {newSubPrice && parseFloat(newSubPrice) > 0 && (
                          <div className="p-2 rounded bg-green-500/10 border border-green-500/20">
                            <p className="text-xs text-green-400">
                              ✓ This sub-channel will be sold separately at R{newSubPrice}/month
                            </p>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleCreateSubChannel} className="flex-1">
                            Add Sub-Channel
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setShowCreateSub(false)}>Cancel</Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Pricing Summary */}
                {(selectedParentChannel && selectedParentChannel !== "none") && (
                  <div className="p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-primary/10 border border-amber-500/20">
                    <p className="text-xs font-medium text-amber-400 mb-2">💰 Pricing Structure</p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• <strong>Full Package:</strong> Viewers subscribe to parent for access to ALL sub-channels</p>
                      <p>• <strong>Individual:</strong> Viewers subscribe to specific sub-channels at their own price</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Main Category - After Channel Setup */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-cyan-400" />
                  <h3 className="font-semibold">Content Category</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Categories help viewers discover your content.
                </p>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Main Category</Label>
                    <Select value={mainCategory} onValueChange={(value) => {
                      setMainCategory(value);
                      setSubCategory("");
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {MAIN_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Sub-category</Label>
                    <Select 
                      value={subCategory} 
                      onValueChange={setSubCategory}
                      disabled={!mainCategory || availableSubCategories.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={mainCategory ? "Select sub-category" : "Select main category first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSubCategories.map((sub) => (
                          <SelectItem key={sub} value={sub}>
                            {sub}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Custom Category */}
                <div className="border-t pt-4">
                  {!showCustomCategory ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCustomCategory(true)}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Custom Category
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="Enter custom category..."
                        className="flex-1"
                      />
                      <Button onClick={handleAddCustomCategory}>Add</Button>
                      <Button variant="outline" onClick={() => setShowCustomCategory(false)}>Cancel</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Genres */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  <h3 className="font-semibold">Content Genres</h3>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {GENRES.map((genre) => (
                    <Badge
                      key={genre}
                      variant={selectedGenres.includes(genre) ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        selectedGenres.includes(genre) 
                          ? "bg-purple-500 hover:bg-purple-600" 
                          : "hover:bg-accent"
                      }`}
                      onClick={() => toggleGenre(genre)}
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>

                {selectedGenres.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    Selected: {selectedGenres.join(", ")}
                  </div>
                )}

                {/* Custom Genre */}
                <div className="border-t pt-4">
                  {!showCustomGenre ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCustomGenre(true)}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Custom Genre
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={customGenre}
                        onChange={(e) => setCustomGenre(e.target.value)}
                        placeholder="Enter custom genre..."
                        className="flex-1"
                      />
                      <Button onClick={handleAddCustomGenre}>Add</Button>
                      <Button variant="outline" onClick={() => setShowCustomGenre(false)}>Cancel</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>


        </Tabs>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2 text-blue-500">
            <Info className="h-4 w-4" />
            <span className="text-sm">Goes to library → Assign to channels later</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={saving}
              className="gap-2 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-600"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Video className="h-4 w-4" />
                  Add to Library
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
