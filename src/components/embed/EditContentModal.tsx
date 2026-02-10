import { useEffect, useRef, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save, Plus, Trash2, Copy, Check, Upload, Wand2, Youtube } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PricingOptions from "@/components/embed/PricingOptions";
import { extractYouTubeThumbnailFromUrls, hasYouTubeUrl } from "@/lib/youtube-utils";

interface ContentItem {
  id: string;
  asset_id?: string; // Optional - used by VOD Pro (content_assets), not used by Embed Pro (embed_pro_content)
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  content_type: string;
  embed_urls: string[] | null;
  embed_provider: string | null;
  is_ppv?: boolean | null;
  price?: number | null;
}

interface EditContentModalProps {
  content: ContentItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
  onDelete: () => void;
}

const CONTENT_RATINGS = ["All Ages", "General", "Parental Guidance", "Teen 14+", "Mature"];

const isAudioContent = (contentType: string, embedUrls: string[] | null) => {
  const type = contentType.toLowerCase();
  if (type.includes("audio") || type.includes("podcast")) return true;
  
  const audioExtensions = /\.(mp3|wav|m4a|aac|flac|ogg|wma|opus)(\?|$)/i;
  return embedUrls?.some(url => audioExtensions.test(url)) || false;
};

export default function EditContentModal({
  content,
  open,
  onOpenChange,
  onSaved,
  onDelete,
}: EditContentModalProps) {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [generatingAiThumbnail, setGeneratingAiThumbnail] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Basic fields
  const [title, setTitle] = useState(content.title);
  const [description, setDescription] = useState(content.description || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(content.thumbnail_url || "");
  const [embedUrls, setEmbedUrls] = useState<string[]>(content.embed_urls || []);
  const [isPPV, setIsPPV] = useState(!!content.is_ppv);
  const [price, setPrice] = useState(
    content.is_ppv && typeof content.price === "number" && content.price > 0
      ? content.price.toFixed(2)
      : ""
  );

  // Metadata fields
  const [cast, setCast] = useState("");
  const [director, setDirector] = useState("");
  const [producer, setProducer] = useState("");
  const [studio, setStudio] = useState("");
  const [country, setCountry] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [genres, setGenres] = useState("");
  const [musicComposer, setMusicComposer] = useState("");
  const [cinematographer, setCinematographer] = useState("");
  const [editor, setEditor] = useState("");
  const [writer, setWriter] = useState("");
  const [contentRating, setContentRating] = useState("");
  const [language, setLanguage] = useState("");
  const [subtitles, setSubtitles] = useState("");
  const [metadataId, setMetadataId] = useState<string | null>(null);

  const isAudio = isAudioContent(content.content_type, content.embed_urls);

  // Fetch existing metadata when modal opens or content changes
  useEffect(() => {
    const fetchMetadata = async () => {
      const { data, error } = await supabase
        .from("content_metadata")
        .select("*")
        .eq("asset_id", content.id)
        .maybeSingle();

      if (data) {
        setMetadataId(data.id);
        setCast(data.cast_members?.join(", ") || "");
        setDirector(data.director || "");
        setProducer(data.producer || "");
        setStudio(data.studio || "");
        setCountry(data.country || "");
        setReleaseYear(data.year_of_release?.toString() || "");
        setGenres((data as any).genres?.join(", ") || "");
        setMusicComposer((data as any).music_composer || "");
        setCinematographer((data as any).cinematographer || "");
        setEditor((data as any).editor || "");
        setWriter(data.writer || "");
        setContentRating(data.content_rating || "");
        setLanguage(data.language || "");
        setSubtitles((data as any).subtitles?.join(", ") || "");
      } else {
        // Reset metadata fields if no data
        setMetadataId(null);
        setCast("");
        setDirector("");
        setProducer("");
        setStudio("");
        setCountry("");
        setReleaseYear("");
        setGenres("");
        setMusicComposer("");
        setCinematographer("");
        setEditor("");
        setWriter("");
        setContentRating("");
        setLanguage("");
        setSubtitles("");
      }
    };

    if (open && content.id) {
      fetchMetadata();
    }
  }, [content.id, open]);

  // Prevent stale selection: when the parent swaps `content`, sync local form state.
  useEffect(() => {
    setTitle(content.title);
    setDescription(content.description || "");
    setThumbnailUrl(content.thumbnail_url || "");
    setEmbedUrls(content.embed_urls || []);
    setIsPPV(!!content.is_ppv);
    setPrice(
      content.is_ppv && typeof content.price === "number" && content.price > 0
        ? content.price.toFixed(2)
        : ""
    );
    setCopied(false);
    setActiveTab("basic");
  }, [content.id]);

  const handleAddUrl = () => {
    setEmbedUrls([...embedUrls, ""]);
  };

  const handleRemoveUrl = (index: number) => {
    setEmbedUrls(embedUrls.filter((_, i) => i !== index));
  };

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...embedUrls];
    newUrls[index] = value;
    setEmbedUrls(newUrls);
  };

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
      const fileName = `${content.asset_id || content.id}-${Date.now()}.${fileExt}`;
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

  const handleAutoDetectYouTubeThumbnail = () => {
    const ytThumbnail = extractYouTubeThumbnailFromUrls(embedUrls);
    if (ytThumbnail) {
      setThumbnailUrl(ytThumbnail);
      toast.success("YouTube thumbnail detected and applied!");
    } else {
      toast.error("No YouTube video found in embed URLs");
    }
  };

  const handleGenerateAiThumbnail = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title first");
      return;
    }

    setGeneratingAiThumbnail(true);
    try {
      const prompt = `${title}${description ? `. ${description}` : ""}`;
      const { data, error } = await supabase.functions.invoke("generate-thumbnail", {
        body: { prompt }
      });

      if (error) throw error;
      if (data?.error) {
        if (data.error.includes("Rate limit")) {
          toast.error("Rate limit exceeded. Please try again later.");
        } else if (data.error.includes("credits")) {
          toast.error("AI credits exhausted. Please add credits to continue.");
        } else {
          throw new Error(data.error);
        }
        return;
      }

      if (data?.imageUrl) {
        setThumbnailUrl(data.imageUrl);
        toast.success("AI thumbnail generated!");
      } else {
        throw new Error("No image generated");
      }
    } catch (error) {
      console.error("Error generating AI thumbnail:", error);
      toast.error("Failed to generate AI thumbnail");
    } finally {
      setGeneratingAiThumbnail(false);
    }
  };

  const handleCopyProductId = () => {
    navigator.clipboard.writeText(content.asset_id || content.id);
    setCopied(true);
    toast.success("Content ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (embedUrls.filter((u) => u.trim()).length === 0) {
      toast.error("At least one embed URL is required");
      return;
    }

    const parsedPrice = isPPV ? Number.parseFloat(price) : 0;
    if (isPPV) {
      if (!Number.isFinite(parsedPrice)) {
        toast.error("Please enter a valid price");
        return;
      }
      if (parsedPrice < 9.99) {
        toast.error("Minimum price is R9.99");
        return;
      }
    }

    setSaving(true);
    try {
      const validUrls = embedUrls.filter((u) => u.trim());

      // Determine which table to update based on whether asset_id exists
      // VOD Pro uses content_assets (has asset_id), Embed Pro uses embed_pro_content (no asset_id)
      const tableName = content.asset_id ? "content_assets" : "embed_pro_content";
      
      const updatePayload: Record<string, unknown> = {
        title: title.trim(),
        description: description.trim() || null,
        thumbnail_url: thumbnailUrl.trim() || null,
        embed_urls: validUrls,
        is_ppv: isPPV,
        price: isPPV ? parsedPrice : 0,
      };
      
      // Only add updated_at for content_assets table
      if (content.asset_id) {
        updatePayload.updated_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from(tableName)
        .update(updatePayload)
        .eq("id", content.id);

      if (error) throw error;

      // Save metadata
      const metadataPayload = {
        asset_id: content.id,
        director: director || null,
        cast_members: cast ? cast.split(",").map((s) => s.trim()) : null,
        producer: producer || null,
        studio: studio || null,
        country: country || null,
        year_of_release: releaseYear ? parseInt(releaseYear) : null,
        writer: writer || null,
        language: language || null,
        content_rating: contentRating || null,
        genres: genres ? genres.split(",").map((s) => s.trim()) : null,
        music_composer: musicComposer || null,
        cinematographer: cinematographer || null,
        editor: editor || null,
        subtitles: subtitles ? subtitles.split(",").map((s) => s.trim()) : null,
      };

      if (metadataId) {
        // Update existing metadata
        const { error: metaError } = await supabase
          .from("content_metadata")
          .update(metadataPayload)
          .eq("id", metadataId);
        
        if (metaError) console.error("Metadata update error:", metaError);
      } else {
        // Insert new metadata if any field is filled
        const hasMetadata = director || cast || producer || studio || country || 
          releaseYear || writer || language || contentRating || genres || 
          musicComposer || cinematographer || editor || subtitles;
        
        if (hasMetadata) {
          const { error: metaError } = await supabase
            .from("content_metadata")
            .insert(metadataPayload);
          
          if (metaError) console.error("Metadata insert error:", metaError);
        }
      }

      toast.success("Content updated successfully!");
      onSaved();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating content:", error);
      toast.error("Failed to update content");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this content? This will also remove it from the CDN if applicable.")) {
      return;
    }

    setDeleting(true);
    try {
      // Get current user for profile_id
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Authentication required");
        return;
      }

      // Determine which table based on asset_id presence
      // VOD Pro content has asset_id and may use CDN, Embed Pro does not
      if (content.asset_id) {
        // Use edge function to delete from both Gumlet CDN and database
        const { data, error } = await supabase.functions.invoke("gumlet-delete-video", {
          body: {
            content_id: content.id,
            asset_id: content.asset_id,
            profile_id: user.id,
          },
        });

        if (error) throw error;

        if (data?.gumlet_deleted) {
          toast.success("Content deleted from library and CDN!");
        } else {
          toast.success("Content deleted successfully!");
        }
      } else {
        // For Embed Pro, directly delete from embed_pro_content (no CDN)
        const { error } = await supabase
          .from("embed_pro_content")
          .delete()
          .eq("id", content.id);

        if (error) throw error;

        toast.success("Content deleted successfully!");
      }
      
      onDelete();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting content:", error);
      toast.error("Failed to delete content");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Content</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="media">Media & Pricing</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-4 mt-4">
            {/* Product ID */}
            <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs text-muted-foreground">{content.asset_id ? "Product ID" : "Content ID"}</Label>
                  <p className="font-mono text-sm text-foreground">{content.asset_id || content.id}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyProductId}
                  className="gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Content title"
                className="mt-1"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your content..."
                rows={3}
                className="mt-1"
              />
            </div>

            {/* Content Type Badge */}
            <div className="flex items-center gap-2">
              <Label className="text-muted-foreground">Type:</Label>
              <Badge variant="outline">{content.content_type}</Badge>
              {content.embed_provider && (
                <Badge variant="secondary">{content.embed_provider}</Badge>
              )}
            </div>
          </TabsContent>

          {/* Media & Pricing Tab */}
          <TabsContent value="media" className="space-y-4 mt-4">
            {/* Thumbnail URL */}
            <div>
              <Label htmlFor="thumbnail">
                {isAudio ? "Cover Image" : "Thumbnail URL"}
              </Label>
              
              {isAudio && (
                <div className="mt-2 mb-3">
                  {thumbnailUrl && (
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-border mb-3">
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
                </div>
              )}
              
              <div className="flex gap-2 mt-1">
                <Input
                  id="thumbnail"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://example.com/thumbnail.jpg"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingCover}
                  className="gap-2 shrink-0"
                >
                  {uploadingCover ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Upload
                </Button>
              </div>
              
              {/* Hidden file input for thumbnail upload */}
              {!isAudio && (
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
              )}

              {/* Thumbnail Generation Buttons */}
              <div className="flex flex-wrap gap-2 mt-3">
                {hasYouTubeUrl(embedUrls) && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAutoDetectYouTubeThumbnail}
                    className="gap-2"
                  >
                    <Youtube className="h-4 w-4 text-red-500" />
                    Auto-detect YouTube Thumbnail
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateAiThumbnail}
                  disabled={generatingAiThumbnail || !title.trim()}
                  className="gap-2"
                >
                  {generatingAiThumbnail ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 text-purple-500" />
                      Generate AI Thumbnail
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {hasYouTubeUrl(embedUrls) 
                  ? "Auto-detect fetches the thumbnail from YouTube, or generate one using AI based on your title."
                  : "Generate a professional thumbnail using AI based on your content title."
                }
              </p>
            </div>

            {/* Embed URLs */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Embed Codes / URLs</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddUrl}
                  className="gap-1"
                >
                  <Plus className="h-3 w-3" />
                  Add URL
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Paste embed codes: HLS, Direct URL, iFrame, MP3, WAV, MP4
              </p>
              <div className="space-y-2">
                {embedUrls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={url}
                      onChange={(e) => handleUrlChange(index, e.target.value)}
                      placeholder={`HLS, iframe, MP4, MP3...`}
                    />
                    {embedUrls.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveUrl(index)}
                        className="text-destructive hover:bg-destructive/10 shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <PricingOptions
              isPPV={isPPV}
              price={price}
              assetId={content.id}
              assetTitle={title}
              onPPVChange={(value) => {
                setIsPPV(value);
                if (!value) setPrice("");
              }}
              onPriceChange={setPrice}
            />
          </TabsContent>

          {/* Metadata Tab */}
          <TabsContent value="metadata" className="space-y-4 mt-4">
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
                <Label>Genres (comma separated)</Label>
                <Input
                  value={genres}
                  onChange={(e) => setGenres(e.target.value)}
                  placeholder="Drama, Action, Comedy"
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
                <Label>Writer</Label>
                <Input
                  value={writer}
                  onChange={(e) => setWriter(e.target.value)}
                  placeholder="Writer name"
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
              <Label>Language</Label>
              <Input
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="English, Spanish, etc."
              />
            </div>

            <div className="space-y-2">
              <Label>Subtitles (comma separated)</Label>
              <Input
                value={subtitles}
                onChange={(e) => setSubtitles(e.target.value)}
                placeholder="English, Spanish, French"
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex justify-between gap-3 pt-4 border-t">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting || saving}
            className="gap-2"
          >
            {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || deleting} className="gap-2">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}