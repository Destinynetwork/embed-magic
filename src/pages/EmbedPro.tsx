import { useState, useEffect, useRef, useMemo } from "react";
import { 
  Crown, 
  Play, 
  Sparkles, 
  Settings, 
  Shield, 
  Palette,
  Video,
  Music,
  FileText,
  Image,
  Layers,
  Plus,
  ExternalLink,
  Trash2,
  Edit,
  Upload,
  ChevronLeft,
  ChevronRight,
  ListVideo,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Save,
  BarChart3,
  Store,
  MessageCircle,
  Radio,
  Home,
  Calendar,
  Tv,
  Folder,
  X,
  Link2,
  RefreshCw,
  BookOpen,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import UniversalPlayer from "@/components/player/UniversalPlayer";
import CreateVODContentModal from "@/components/vod/CreateVODContentModal";
import EditContentModal from "@/components/embed/EditContentModal";

import EmbedProAnalytics from "@/components/embed/EmbedProAnalytics";
import CreatorHelpTicketModal from "@/components/embed/CreatorHelpTicketModal";
import { EmbedProStreamStudio } from "@/components/stream/EmbedProStreamStudio";
// Note: useAuth is not used here - EmbedPro handles its own auth checking
import { BackButton } from "@/components/layout/BackButton";
import { LoginModal } from "@/components/auth/LoginModal";
import { TierHelpSupport } from "@/components/subscription/TierHelpSupport";
import { 
  useDemoMode, 
  DEMO_CONTENT, 
  DEMO_PLAYER_SETTINGS, 
  DEMO_PROTECTION_SETTINGS, 
  DEMO_AI_USAGE 
} from "@/hooks/useDemoMode";
import { EmbedProQuickStartGuide } from "@/components/embed/EmbedProQuickStartGuide";
import { EmbedProEventsHub } from "@/components/embed/EmbedProEventsHub";
import { EmbedProChannelManager } from "@/components/channel/EmbedProChannelManager";
import { PlaylistManager } from "@/components/playlist/PlaylistManager";
import { EmbedProUserGuide } from "@/components/embed/EmbedProUserGuide";
import { EmbedProCategoryRow } from "@/components/embed/EmbedProCategoryRow";

// Feature images for landing page
import aiThumbnailsImg from "@/assets/embed-features/ai-thumbnails.jpg";
import contentProtectionImg from "@/assets/embed-features/content-protection.jpg";
import playerCustomizationImg from "@/assets/embed-features/player-customization.jpg";
import liveStreamingImg from "@/assets/embed-features/live-streaming.jpg";
import analyticsDashboardImg from "@/assets/embed-features/analytics-dashboard.jpg";
import multiPlatformImg from "@/assets/embed-features/multi-platform.jpg";

type FilterTab = "all" | "video" | "audio" | "document" | "image";

interface ContentItem {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  content_type: string;
  embed_urls: string[] | null;
  embed_provider: string | null;
  is_ppv?: boolean | null;
  price?: number | null;
  is_approved?: boolean;
  channel_id?: string | null;
  qa_status?: string | null;
  rejection_reason?: string | null;
  qa_notes?: string | null;
  creator_notes?: string | null;
  moderation_flags?: unknown;
  age_restriction?: string | null;
}

interface ChannelOption {
  id: string;
  name: string;
  parent_id: string | null;
  package_price: number | null;
  subscription_price: number | null;
  sell_individually: boolean | null;
}

const FILTER_TABS: { key: FilterTab; label: string; icon: React.ElementType }[] = [
  { key: "all", label: "All Content", icon: Layers },
  { key: "video", label: "Videos", icon: Video },
  { key: "audio", label: "Audio", icon: Music },
  { key: "document", label: "Documents", icon: FileText },
  { key: "image", label: "Images", icon: Image },
];

const PLATFORM_COLORS: Record<string, string> = {
  youtube: "bg-red-600",
  vimeo: "bg-blue-500",
  wistia: "bg-pink-500",
  dailymotion: "bg-blue-600",
  streamable: "bg-blue-400",
  cdn: "bg-amber-500",
  facebook: "bg-blue-700",
  spotify: "bg-green-500",
  mp3: "bg-violet-500",
  wav: "bg-violet-600",
  flac: "bg-violet-700",
  m4a: "bg-violet-500",
  ogg: "bg-violet-600",
  audio: "bg-violet-500",
  direct: "bg-emerald-500",
};

const SUPPORTED_PLATFORMS = [
  { id: "youtube", name: "YouTube", icon: "📺" },
  { id: "vimeo", name: "Vimeo", icon: "🎬" },
  { id: "wistia", name: "Wistia", icon: "🎥" },
  { id: "dailymotion", name: "Dailymotion", icon: "📹" },
  { id: "streamable", name: "Streamable", icon: "🎞️" },
  { id: "ted", name: "TED Talks", icon: "🎤" },
  { id: "facebook", name: "Facebook", icon: "📘" },
  { id: "spotify", name: "Spotify", icon: "🎵" },
  { id: "mp3", name: "MP3 Audio", icon: "🎧" },
  { id: "wav", name: "WAV Audio", icon: "🔊" },
  { id: "flac", name: "FLAC Audio", icon: "🎼" },
  { id: "m4a", name: "M4A Audio", icon: "🎹" },
  { id: "ogg", name: "OGG Audio", icon: "🎸" },
];

// Feature cards removed per user request

// AI Generator Tab Component with DB tracking (supports sandbox demo mode)
function AiGeneratorTab({ profileId, isSandboxDemo }: { profileId: string | null; isSandboxDemo: boolean }) {
  const { blockGenerate } = useDemoMode(isSandboxDemo);
  const [aiPrompt, setAiPrompt] = useState("");
  const [generatingThumbnail, setGeneratingThumbnail] = useState(false);
  const [generatedImage, setGeneratedImage] = useState("");
  const [aiGenerationsUsed, setAiGenerationsUsed] = useState(isSandboxDemo ? DEMO_AI_USAGE.ai_generations_used : 0);
  const [aiGenerationsLimit, setAiGenerationsLimit] = useState(isSandboxDemo ? DEMO_AI_USAGE.ai_generations_limit : 25);
  const [loading, setLoading] = useState(!isSandboxDemo);

  useEffect(() => {
    if (isSandboxDemo) {
      setLoading(false);
      return;
    }
    if (profileId) {
      fetchAiUsage();
    } else {
      setLoading(false);
    }
  }, [profileId, isSandboxDemo]);

  const fetchAiUsage = async () => {
    if (!profileId || isSandboxDemo) return;
    try {
      const { data } = await supabase
        .from("creator_cdn_usage")
        .select("ai_generations_used, ai_generations_limit")
        .eq("profile_id", profileId)
        .maybeSingle();
      
      if (data) {
        setAiGenerationsUsed(data.ai_generations_used || 0);
        setAiGenerationsLimit(data.ai_generations_limit || 25);
      }
    } catch (error) {
      console.error("Error fetching AI usage:", error);
    } finally {
      setLoading(false);
    }
  };

  const incrementAiUsage = async () => {
    if (!profileId || isSandboxDemo) return;
    try {
      await supabase
        .from("creator_cdn_usage")
        .update({ 
          ai_generations_used: aiGenerationsUsed + 1,
          updated_at: new Date().toISOString()
        })
        .eq("profile_id", profileId);
    } catch (error) {
      console.error("Error updating AI usage:", error);
    }
  };

  const handleGenerateThumbnail = async () => {
    // Block AI generation in demo mode
    if (blockGenerate()) return;

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

      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        return;
      }

      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
        setAiGenerationsUsed(prev => prev + 1);
        await incrementAiUsage();
        toast.success("Thumbnail generated successfully!");
      }
    } catch (error) {
      console.error("Error generating thumbnail:", error);
      toast.error("Failed to generate thumbnail. Please try again.");
    } finally {
      setGeneratingThumbnail(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      {isSandboxDemo && (
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-4 flex items-center gap-3">
            <Lock className="h-5 w-5 text-amber-400" />
            <div>
              <p className="font-medium text-amber-400">Demo Mode</p>
              <p className="text-sm text-muted-foreground">AI generation is disabled in demo. Sign up to generate thumbnails.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Thumbnail Generator */}
      <Card className="bg-gradient-to-br from-purple-900/20 to-slate-900 border-purple-500/30">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold">AI Thumbnail Generator</h3>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">PRO Feature</Badge>
            </div>
            <span className="text-sm text-muted-foreground">
              {aiGenerationsUsed}/{aiGenerationsLimit} Used
            </span>
          </div>
          
          <div className="space-y-2">
            <Label>Describe your thumbnail</Label>
            <Textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="E.g., 'Modern tech background with glowing circuits and a play button in the center'"
              rows={3}
              disabled={generatingThumbnail}
            />
          </div>

          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Monthly Generations</div>
            <Progress value={(aiGenerationsUsed / aiGenerationsLimit) * 100} className="h-2" />
          </div>

          {generatedImage && (
            <div className="relative rounded-lg overflow-hidden border border-border">
              <img 
                src={generatedImage} 
                alt="Generated thumbnail" 
                className="w-full h-48 object-cover"
              />
              <Button 
                size="sm" 
                className="absolute bottom-2 right-2 gap-2"
                onClick={() => {
                  navigator.clipboard.writeText(generatedImage);
                  toast.success("Image URL copied!");
                }}
              >
                Copy URL
              </Button>
            </div>
          )}

          <Button 
            className="w-full gap-2 bg-purple-500 hover:bg-purple-600"
            onClick={handleGenerateThumbnail}
            disabled={generatingThumbnail || !aiPrompt.trim()}
          >
            {generatingThumbnail ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating Thumbnail...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Thumbnail
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* AI Description Generator */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-400" />
            <h3 className="text-lg font-semibold">AI Description Generator</h3>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">PRO Feature</Badge>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Generate SEO-optimized descriptions for your content automatically.
          </p>

          <Button variant="outline" className="gap-2" disabled>
            <Sparkles className="h-4 w-4" />
            Coming Soon
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Player Settings Tab Component with DB persistence (supports sandbox demo mode)
function PlayerSettingsTab({ profileId, isSandboxDemo }: { profileId: string | null; isSandboxDemo: boolean }) {
  const { blockSave } = useDemoMode(isSandboxDemo);
  const [autoplay, setAutoplay] = useState(isSandboxDemo ? DEMO_PLAYER_SETTINGS.autoplay : false);
  const [loop, setLoop] = useState(isSandboxDemo ? DEMO_PLAYER_SETTINGS.loop : false);
  const [showControls, setShowControls] = useState(isSandboxDemo ? DEMO_PLAYER_SETTINGS.showControls : true);
  const [muted, setMuted] = useState(isSandboxDemo ? DEMO_PLAYER_SETTINGS.muted : false);
  const [startTime, setStartTime] = useState(isSandboxDemo ? DEMO_PLAYER_SETTINGS.startTime : "");
  const [endTime, setEndTime] = useState(isSandboxDemo ? DEMO_PLAYER_SETTINGS.endTime : "");
  const [playbackSpeed, setPlaybackSpeed] = useState(isSandboxDemo ? DEMO_PLAYER_SETTINGS.playbackSpeed : "1.0");
  const [volume, setVolume] = useState(isSandboxDemo ? DEMO_PLAYER_SETTINGS.volume : "80");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isSandboxDemo);

  useEffect(() => {
    if (isSandboxDemo) {
      setLoading(false);
      return;
    }
    if (profileId) {
      fetchSettings();
    } else {
      setLoading(false);
    }
  }, [profileId, isSandboxDemo]);

  const fetchSettings = async () => {
    if (!profileId || isSandboxDemo) return;
    try {
      const { data } = await supabase
        .from("profiles")
        .select("player_settings")
        .eq("id", profileId)
        .maybeSingle();
      
      if (data?.player_settings) {
        const settings = data.player_settings as any;
        setAutoplay(settings.autoplay || false);
        setLoop(settings.loop || false);
        setShowControls(settings.showControls !== false);
        setMuted(settings.muted || false);
        setStartTime(settings.startTime || "");
        setEndTime(settings.endTime || "");
        setPlaybackSpeed(settings.playbackSpeed || "1.0");
        setVolume(settings.volume || "80");
      }
    } catch (error) {
      console.error("Error fetching player settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Block save in demo mode
    if (blockSave()) return;

    if (!profileId) {
      toast.error("Please sign in to save settings");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          player_settings: {
            autoplay,
            loop,
            showControls,
            muted,
            startTime,
            endTime,
            playbackSpeed,
            volume,
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", profileId);

      if (error) throw error;
      toast.success("Player settings saved!");
    } catch (error) {
      console.error("Error saving player settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Playback Settings */}
      <Card className="bg-gradient-to-br from-amber-900/20 to-slate-900 border-amber-500/30">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-6 w-6 text-amber-500" />
            <h3 className="text-lg font-semibold">Playback Settings</h3>
          </div>
          
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Autoplay</span>
                <p className="text-xs text-muted-foreground">Start playing automatically when loaded</p>
              </div>
              <Switch checked={autoplay} onCheckedChange={setAutoplay} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Loop</span>
                <p className="text-xs text-muted-foreground">Restart video when it ends</p>
              </div>
              <Switch checked={loop} onCheckedChange={setLoop} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Show Controls</span>
                <p className="text-xs text-muted-foreground">Display player controls overlay</p>
              </div>
              <Switch checked={showControls} onCheckedChange={setShowControls} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Start Muted</span>
                <p className="text-xs text-muted-foreground">Begin playback with audio muted</p>
              </div>
              <Switch checked={muted} onCheckedChange={setMuted} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Advanced Settings</h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Start Time (seconds)</Label>
              <Input
                type="number"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>End Time (seconds)</Label>
              <Input
                type="number"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="Auto"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Default Playback Speed</Label>
              <Input
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(e.target.value)}
                placeholder="1.0"
              />
            </div>
            <div className="space-y-2">
              <Label>Default Volume (%)</Label>
              <Input
                type="number"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                placeholder="80"
                min="0"
                max="100"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button 
        className="w-full gap-2 bg-amber-500 hover:bg-amber-600"
        onClick={handleSave}
        disabled={saving || !profileId}
      >
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Save Player Settings
          </>
        )}
      </Button>
    </div>
  );
}

// Content Protection Tab Component with DB persistence (supports sandbox demo mode)
function ContentProtectionTab({ profileId, isSandboxDemo }: { profileId: string | null; isSandboxDemo: boolean }) {
  const { blockSave } = useDemoMode(isSandboxDemo);
  const [disableRightClick, setDisableRightClick] = useState(isSandboxDemo ? DEMO_PROTECTION_SETTINGS.disableRightClick : true);
  const [passwordProtected, setPasswordProtected] = useState(isSandboxDemo ? DEMO_PROTECTION_SETTINGS.passwordProtected : false);
  const [password, setPassword] = useState(isSandboxDemo ? DEMO_PROTECTION_SETTINGS.password : "");
  const [showPassword, setShowPassword] = useState(false);
  const [watermarkEnabled, setWatermarkEnabled] = useState(isSandboxDemo ? DEMO_PROTECTION_SETTINGS.watermarkEnabled : true);
  const [watermarkText, setWatermarkText] = useState(isSandboxDemo ? DEMO_PROTECTION_SETTINGS.watermarkText : "SUPAView ©");
  const [watermarkPosition, setWatermarkPosition] = useState(isSandboxDemo ? DEMO_PROTECTION_SETTINGS.watermarkPosition : "bottom-right");
  const [drmEnabled, setDrmEnabled] = useState(isSandboxDemo ? DEMO_PROTECTION_SETTINGS.drmEnabled : false);
  const [domainLock, setDomainLock] = useState(isSandboxDemo ? DEMO_PROTECTION_SETTINGS.domainLock : "");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isSandboxDemo);

  useEffect(() => {
    if (isSandboxDemo) {
      setLoading(false);
      return;
    }
    if (profileId) {
      fetchSettings();
    } else {
      setLoading(false);
    }
  }, [profileId, isSandboxDemo]);

  const fetchSettings = async () => {
    if (!profileId || isSandboxDemo) return;
    try {
      const { data } = await supabase
        .from("profiles")
        .select("protection_settings")
        .eq("id", profileId)
        .maybeSingle();
      
      if (data?.protection_settings) {
        const settings = data.protection_settings as any;
        setDisableRightClick(settings.disableRightClick !== false);
        setPasswordProtected(settings.passwordProtected || false);
        setPassword(settings.password || "");
        setWatermarkEnabled(settings.watermarkEnabled !== false);
        setWatermarkText(settings.watermarkText || "SUPAView ©");
        setWatermarkPosition(settings.watermarkPosition || "bottom-right");
        setDrmEnabled(settings.drmEnabled || false);
        setDomainLock(settings.domainLock || "");
      }
    } catch (error) {
      console.error("Error fetching protection settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Block save in demo mode
    if (blockSave()) return;

    if (!profileId) {
      toast.error("Please sign in to save settings");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          protection_settings: {
            disableRightClick,
            passwordProtected,
            password,
            watermarkEnabled,
            watermarkText,
            watermarkPosition,
            drmEnabled,
            domainLock,
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", profileId);

      if (error) throw error;
      toast.success("Protection settings saved!");
    } catch (error) {
      console.error("Error saving protection settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Basic Protection */}
      <Card className="bg-gradient-to-br from-emerald-900/20 to-slate-900 border-emerald-500/30">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-emerald-500" />
            <h3 className="text-lg font-semibold">Content Protection</h3>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">PRO Feature</Badge>
          </div>
          
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Disable Right-Click</span>
                <p className="text-xs text-muted-foreground">Prevent right-click context menu on content</p>
              </div>
              <Switch checked={disableRightClick} onCheckedChange={setDisableRightClick} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Password Protection</span>
                <p className="text-xs text-muted-foreground">Require password to view content</p>
              </div>
              <Switch checked={passwordProtected} onCheckedChange={setPasswordProtected} />
            </div>
            
            {passwordProtected && (
              <div className="space-y-2 pl-4 border-l-2 border-emerald-500/30">
                <Label>Access Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Watermark Settings */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Watermark</h3>
            <Switch checked={watermarkEnabled} onCheckedChange={setWatermarkEnabled} />
          </div>
          
          {watermarkEnabled && (
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Watermark Text</Label>
                <Input
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="Your watermark text"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Position</Label>
                <div className="grid grid-cols-3 gap-2">
                  {["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"].map((pos) => (
                    <Button
                      key={pos}
                      variant={watermarkPosition === pos ? "default" : "outline"}
                      size="sm"
                      onClick={() => setWatermarkPosition(pos)}
                      className="text-xs"
                    >
                      {pos.replace("-", " ")}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advanced Protection */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Advanced Protection</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">DRM Protection</span>
              <p className="text-xs text-muted-foreground">Enable digital rights management</p>
            </div>
            <Switch checked={drmEnabled} onCheckedChange={setDrmEnabled} />
          </div>
          
          <div className="space-y-2">
            <Label>Domain Lock</Label>
            <Input
              value={domainLock}
              onChange={(e) => setDomainLock(e.target.value)}
              placeholder="e.g., yourdomain.com"
            />
            <p className="text-xs text-muted-foreground">Only allow embedding on specified domains</p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button 
        className="w-full gap-2 bg-emerald-500 hover:bg-emerald-600"
        onClick={handleSave}
        disabled={saving || !profileId}
      >
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Save Protection Settings
          </>
        )}
      </Button>
    </div>
  );
}

export default function EmbedPro() {
  const navigate = useNavigate();
  // Check if demo mode is EXPLICITLY enabled (not default from AuthContext)
  const explicitDemoMode =
    typeof window !== "undefined" && storage.getItem("supaview_demo_mode") === "true";
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [activeMainTab, setActiveMainTab] = useState("player");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalInitialTab, setAddModalInitialTab] = useState<"basic" | "media" | "categories">("basic");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [showEventsHub, setShowEventsHub] = useState(false);
  
  // Player modal state - for previewing content in a modal (like VOD Pro)
  const [playerModalContent, setPlayerModalContent] = useState<ContentItem | null>(null);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  
  // Channel state for hierarchical dropdown (like Elite Pro)
  const [channels, setChannels] = useState<ChannelOption[]>([]);
  const [libraryChannelFilter, setLibraryChannelFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Sandbox demo mode: uses mock data, blocks all writes
  const [isSandboxDemo, setIsSandboxDemo] = useState(false);
  const { blockAdd, blockDelete, blockEdit, blockSubmit } = useDemoMode(isSandboxDemo);

  // Channel hierarchy helpers for content counts
  const channelIdToChildIds = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const c of channels) {
      if (!c.parent_id) continue;
      const arr = map.get(c.parent_id) ?? [];
      arr.push(c.id);
      map.set(c.parent_id, arr);
    }
    return map;
  }, [channels]);

  const channelDirectCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const asset of content) {
      const cid = asset.channel_id ?? null;
      if (!cid) continue;
      counts.set(cid, (counts.get(cid) ?? 0) + 1);
    }
    return counts;
  }, [content]);

  const getAggregateChannelCount = useMemo(() => {
    const memo = new Map<string, number>();
    const dfs = (id: string): number => {
      if (memo.has(id)) return memo.get(id)!;
      const selfCount = channelDirectCounts.get(id) ?? 0;
      const children = channelIdToChildIds.get(id) ?? [];
      const total = selfCount + children.reduce((sum, childId) => sum + dfs(childId), 0);
      memo.set(id, total);
      return total;
    };
    return (id: string) => dfs(id);
  }, [channelDirectCounts, channelIdToChildIds]);

  useEffect(() => {
    // Always check real auth first before considering demo mode
    checkAuthAndFetchContent();
  }, []);

  const checkAuthAndFetchContent = async () => {
    setLoading(true);
    
    try {
      // Check for real user session FIRST
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Real authenticated user - load their data
        setIsAuthenticated(true);
        setIsSandboxDemo(false);
        await loadUserContent(user.id);
        return;
      }
      
      // No real user - check if explicit demo mode is requested
      if (explicitDemoMode) {
        // Sandbox demo mode - use mock data, no database access
        setIsSandboxDemo(true);
        setProfileId(null);
        setIsAuthenticated(true);
        setContent(DEMO_CONTENT as ContentItem[]);
        setLoading(false);
        return;
      }
      
      // No user, no demo mode - show landing page
      setIsAuthenticated(false);
      setLoading(false);
    } catch (err) {
      console.error("Auth check error:", err);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const loadUserContent = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (profile) {
        setProfileId(profile.id);

        // Fetch embed pro content (external embeds only - separate from VOD Pro's content_assets)
        const { data, error } = await supabase
          .from("embed_pro_content")
          .select("id, title, description, thumbnail_url, content_type, embed_urls, embed_provider, is_ppv, price, is_approved, channel_id, qa_status, rejection_reason, qa_notes, creator_notes, moderation_flags, age_restriction")
          .eq("owner_id", profile.id)
          .eq("is_archived", false)
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const cleaned = filterBlockedEmbeds(data);
          setContent(cleaned);
        }
        
        // Fetch Embed Pro channels (separate from VOD Pro and Elite Pro)
        const { data: channelData } = await supabase
          .from("embed_pro_channels")
          .select("id, name, parent_id, package_price, subscription_price, sell_individually")
          .eq("owner_id", profile.id)
          .order("name", { ascending: true });

        if (channelData) {
          setChannels(channelData as ChannelOption[]);
        }
        
        setLoading(false);
        return;
      }
      
      // If no user content, fetch demo/public content
      const { data: demoContent, error: demoError } = await supabase
        .from("content_assets")
        .select("id, asset_id, title, description, thumbnail_url, content_type, embed_urls, embed_provider, is_ppv, price, is_approved, channel_id")
        .eq("is_approved", true)
        .like("asset_id", "DEMO-%")
        .order("created_at", { ascending: false })
        .limit(50);

      if (!demoError && demoContent) {
        const cleaned = sortDemoPriority(filterBlockedEmbeds(demoContent)).slice(0, 12);
        setContent(cleaned);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  };
  
  // Refresh data (content and channels)
  const refreshData = async () => {
    if (!profileId) return;
    
    setIsRefreshing(true);
    try {
      const { data: assetsData } = await supabase
        .from("embed_pro_content")
        .select("id, title, description, thumbnail_url, content_type, embed_urls, embed_provider, is_ppv, price, is_approved, channel_id, qa_status, rejection_reason, qa_notes, creator_notes, moderation_flags, age_restriction")
        .eq("owner_id", profileId)
        .eq("is_archived", false)
        .order("created_at", { ascending: false });

      if (assetsData) {
        const cleaned = filterBlockedEmbeds(assetsData);
        setContent(cleaned);
      }

      // Refresh Embed Pro channels
      const { data: channelData } = await supabase
        .from("embed_pro_channels")
        .select("id, name, parent_id, package_price, subscription_price, sell_individually")
        .eq("owner_id", profileId)
        .order("name", { ascending: true });

      if (channelData) {
        setChannels(channelData as ChannelOption[]);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const BLOCKED_EMBED_PROVIDERS = new Set(["instagram", "tiktok", "soundcloud"]);

  const filterBlockedEmbeds = (items: ContentItem[]) => {
    return items.filter((item) => {
      const provider = (item.embed_provider || "").toLowerCase();
      if (BLOCKED_EMBED_PROVIDERS.has(provider)) return false;

      const url0 = (item.embed_urls?.[0] || "").toLowerCase();
      if (url0.includes("instagram.com") || url0.includes("tiktok.com") || url0.includes("soundcloud.com")) {
        return false;
      }

      return true;
    });
  };

  const sortDemoPriority = (items: ContentItem[]) => {
    const weight = (provider?: string | null) => {
      switch ((provider || "").toLowerCase()) {
        case "vimeo":
          return 0;
        case "wistia":
          return 1;
        case "dailymotion":
          return 2;
        case "youtube":
          return 3;
        case "facebook":
          return 4;
        case "direct":
          return 5;
        case "spotify":
          return 6;
        default:
          return 10;
      }
    };

    return [...items].sort((a, b) => weight(a.embed_provider) - weight(b.embed_provider));
  };

  // Wrapper for refreshing content (called by buttons and after operations)
  const fetchContent = async () => {
    await checkAuthAndFetchContent();
  };

  const getFilteredContent = () => {
    // First, filter by channel (like Elite Pro)
    const selectedChannel = channels.find(c => c.id === libraryChannelFilter);
    const isParentChannel = selectedChannel && selectedChannel.parent_id === null;
    
    // Get all sub-channel IDs for parent channel filtering
    const getSubChannelIds = (parentId: string): string[] => {
      return channels
        .filter(c => c.parent_id === parentId)
        .map(c => c.id);
    };
    
    let channelFiltered = content;
    
    if (libraryChannelFilter !== "all") {
      channelFiltered = content.filter(asset => {
        if (libraryChannelFilter === "unassigned") return !asset.channel_id;
        
        if (isParentChannel) {
          const subChannelIds = getSubChannelIds(libraryChannelFilter);
          return asset.channel_id === libraryChannelFilter || subChannelIds.includes(asset.channel_id || '');
        }
        
        return asset.channel_id === libraryChannelFilter;
      });
    }
    
    // Then filter by content type
    if (activeFilter === "all") return channelFiltered;
    
    return channelFiltered.filter((item) => {
      const type = item.content_type.toLowerCase();
      switch (activeFilter) {
        case "video":
          return type.includes("video") || type === "movie" || type.includes("series") || type.includes("stream") || type.includes("documentary") || type.includes("webinar");
        case "audio":
          return type.includes("audio") || type.includes("podcast");
        case "document":
          return type.includes("document") || type.includes("pdf") || type.includes("e-book");
        case "image":
          return type.includes("image");
        default:
          return true;
      }
    });
  };

  const getContentCounts = () => {
    const counts: Record<FilterTab, number> = { all: content.length, video: 0, audio: 0, document: 0, image: 0 };
    content.forEach((item) => {
      const type = item.content_type.toLowerCase();
      if (type.includes("video") || type === "movie" || type.includes("series") || type.includes("stream") || type.includes("documentary") || type.includes("webinar")) {
        counts.video++;
      } else if (type.includes("audio") || type.includes("podcast")) {
        counts.audio++;
      } else if (type.includes("document") || type.includes("pdf") || type.includes("e-book")) {
        counts.document++;
      } else if (type.includes("image")) {
        counts.image++;
      }
    });
    return counts;
  };

  // Group content by sub-channel for Netflix-style category rows
  const contentByChannel = useMemo(() => {
    const groups = new Map<string, { channelName: string; channelPrice: number | null; items: ContentItem[] }>();
    
    // Get filtered content first
    const filtered = getFilteredContent();
    
    filtered.forEach((item) => {
      const channelId = item.channel_id || "unassigned";
      const channel = channels.find(c => c.id === channelId);
      const channelName = channel?.name || "Unassigned";
      // Use subscription_price or package_price for channel cost
      const channelPrice = channel?.subscription_price || channel?.package_price || null;
      
      if (!groups.has(channelId)) {
        groups.set(channelId, { channelName, channelPrice, items: [] });
      }
      groups.get(channelId)!.items.push(item);
    });
    
    // Sort channels: parent channels first, then sub-channels, then unassigned
    const sortedEntries = Array.from(groups.entries()).sort((a, b) => {
      if (a[0] === "unassigned") return 1;
      if (b[0] === "unassigned") return -1;
      
      // Sub-channels of the same parent should be grouped
      return a[1].channelName.localeCompare(b[1].channelName);
    });
    
    return sortedEntries;
  }, [content, channels, libraryChannelFilter, activeFilter]);

  const playerRef = useRef<HTMLDivElement>(null);

  const handlePlayContent = (item: ContentItem) => {
    // Open player modal to preview content (like VOD Pro)
    setPlayerModalContent(item);
    setCurrentPlaylistIndex(0);
    setShowPlayerModal(true);
  };

  const handleDelete = async (id: string) => {
    // Block delete in sandbox demo mode
    if (blockDelete()) return;
    
    if (!confirm("Are you sure you want to delete this content?")) {
      return;
    }
    
    try {
      // For Embed Pro, directly delete from embed_pro_content (no CDN)
      const { error } = await supabase
        .from("embed_pro_content")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Content deleted successfully");
      
      fetchContent();
      if (selectedContent?.id === id) {
        setShowPlayer(false);
        setSelectedContent(null);
      }
    } catch (error) {
      console.error("Error deleting content:", error);
      toast.error("Failed to delete content");
    }
  };

  const handleEditContent = (item: ContentItem) => {
    // Block edit in sandbox demo mode
    if (blockEdit()) return;
    
    setEditingContent(item);
    setShowEditModal(true);
  };
  
  const handleAddContent = (initialTab: "basic" | "media" | "categories" = "basic") => {
    // Block add in sandbox demo mode
    if (blockAdd()) return;
    
    if (!profileId) {
      toast.error("Please sign in to add content");
      return;
    }
    setAddModalInitialTab(initialTab);
    setShowAddModal(true);
  };
  
  // Handler specifically for Import URL tab - opens directly to Media & Embed
  const handleImportUrl = () => {
    handleAddContent("media");
  };
  
  const handleOpenHelp = () => {
    // Block help ticket in sandbox demo mode
    if (blockSubmit()) return;
    
    setShowHelpModal(true);
  };

  const counts = getContentCounts();
  const filteredContent = getFilteredContent();

  const currentPlaylist = selectedContent?.embed_urls || [];
  const hasMultipleItems = currentPlaylist.length > 1;

  const handlePrevious = () => {
    if (currentPlaylistIndex > 0) {
      setCurrentPlaylistIndex(currentPlaylistIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentPlaylistIndex < currentPlaylist.length - 1) {
      setCurrentPlaylistIndex(currentPlaylistIndex + 1);
    }
  };

  // Loading state
  if (loading || isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Landing page for unauthenticated users
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 via-background to-orange-600/10" />
          <div className="relative max-w-7xl mx-auto px-6 py-20">
            <div className="flex items-center gap-2 mb-6">
              <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Home
              </Button>
            </div>
            
            <div className="text-center max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
                <Badge className="bg-amber-600/20 text-amber-400 border-amber-500/30">
                  Universal Media Embedding
                </Badge>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 gap-1.5">
                  <Sparkles className="h-3 w-3" />
                  7-Day Free Trial
                </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                EMBED Pro
              </h1>
              <p className="text-lg text-muted-foreground mb-2">R299/month after trial • No card required</p>
              <p className="text-xl text-muted-foreground mb-8">
                Embed videos, audio, documents, and images from any platform. AI-powered thumbnails, 
                content protection, and professional player customization—all in one dashboard.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-8"
                  onClick={() => navigate("/pricing")}
                >
                  <Crown className="h-5 w-5" />
                  Buy Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="gap-2 border-muted-foreground/30"
                  onClick={() => navigate("/auth?redirect=/embed-pro")}
                >
                  Sign In
                </Button>
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="gap-2 text-amber-400 hover:text-amber-300"
                  onClick={() => {
                    localStorage.setItem("supaview_demo_mode", "true");
                    window.location.reload();
                  }}
                >
                  <Play className="h-5 w-5" />
                  Try Demo
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-center mb-12">Everything You Need for Professional Embedding</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Supported Platforms */}
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 overflow-hidden">
              <div className="aspect-[16/9] relative">
                <img 
                  src={multiPlatformImg} 
                  alt="Multi-Platform Support" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
              </div>
              <CardContent className="p-4 -mt-12 relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-amber-500/20 rounded-lg">
                    <Layers className="h-5 w-5 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Multi-Platform Support</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Embed from YouTube, Vimeo, Wistia, Dailymotion, Spotify, and more.
                </p>
              </CardContent>
            </Card>

            {/* AI Thumbnails */}
            <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900 border-purple-700/50 overflow-hidden">
              <div className="aspect-[16/9] relative">
                <img 
                  src={aiThumbnailsImg} 
                  alt="AI Thumbnail Generator" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
              </div>
              <CardContent className="p-4 -mt-12 relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold">AI Thumbnail Generator</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Create stunning thumbnails with AI—just describe what you want.
                </p>
              </CardContent>
            </Card>

            {/* Content Protection */}
            <Card className="bg-gradient-to-br from-emerald-900/50 to-slate-900 border-emerald-700/50 overflow-hidden">
              <div className="aspect-[16/9] relative">
                <img 
                  src={contentProtectionImg} 
                  alt="Content Protection" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
              </div>
              <CardContent className="p-4 -mt-12 relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <Shield className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Content Protection</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Watermarks, password protection, and domain locking.
                </p>
              </CardContent>
            </Card>

            {/* Player Settings */}
            <Card className="bg-gradient-to-br from-cyan-900/50 to-slate-900 border-cyan-700/50 overflow-hidden">
              <div className="aspect-[16/9] relative">
                <img 
                  src={playerCustomizationImg} 
                  alt="Player Customization" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
              </div>
              <CardContent className="p-4 -mt-12 relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <Settings className="h-5 w-5 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Player Customization</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Autoplay, loop, custom timing, and playback speed.
                </p>
              </CardContent>
            </Card>

            {/* Live Streaming */}
            <Card className="bg-gradient-to-br from-red-900/50 to-slate-900 border-red-700/50 overflow-hidden">
              <div className="aspect-[16/9] relative">
                <img 
                  src={liveStreamingImg} 
                  alt="Live Streaming" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
              </div>
              <CardContent className="p-4 -mt-12 relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <Radio className="h-5 w-5 text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Live Streaming</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Built-in studio for live broadcasts with multi-guest support.
                </p>
              </CardContent>
            </Card>

            {/* Analytics */}
            <Card className="bg-gradient-to-br from-blue-900/50 to-slate-900 border-blue-700/50 overflow-hidden">
              <div className="aspect-[16/9] relative">
                <img 
                  src={analyticsDashboardImg} 
                  alt="Analytics Dashboard" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
              </div>
              <CardContent className="p-4 -mt-12 relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Analytics Dashboard</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Track views, engagement, and performance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Mode Banner */}
      {isSandboxDemo && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-amber-400" />
              <div>
                <span className="font-medium text-amber-400">Demo Mode</span>
                <span className="text-sm text-muted-foreground ml-2">
                  Explore all features. Videos play, but changes are not saved.
                </span>
              </div>
            </div>
            <Button 
              size="sm" 
              className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              onClick={() => navigate("/auth?redirect=/embed-pro")}
            >
              <Crown className="h-4 w-4" />
              Sign Up to Save
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="h-8 w-8 text-amber-500" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">EMBED Pro</h1>
              <p className="text-sm text-muted-foreground">Advanced tools for professional content creators</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
              onClick={() => navigate("/")}
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
            <LoginModal size="sm" />
          </div>
        </div>
        
        {/* Pro Services Navigation */}
        <div className="max-w-7xl mx-auto px-6 pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground mr-2">Pro Services:</span>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
              onClick={() => navigate("/creator-dashboard?from=embed-pro")}
            >
              <BarChart3 className="h-4 w-4" />
              Creator Dashboard
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
              onClick={() => navigate("/business-hub?from=embed-pro")}
            >
              <Store className="h-4 w-4" />
              My Business Hub
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-violet-500/50 text-violet-400 hover:bg-violet-500/10 hover:text-violet-300"
              onClick={handleOpenHelp}
            >
              <MessageCircle className="h-4 w-4" />
              Support
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
              onClick={() => setShowHelpCenter(true)}
            >
              <MessageCircle className="h-4 w-4" />
              Open Help Center
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Main Tabs */}
        <Tabs value={activeMainTab} onValueChange={setActiveMainTab}>
          <TabsList className="bg-muted/50 flex-wrap h-auto gap-1">
            <TabsTrigger value="player" className="gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-background">
              <BarChart3 className="h-4 w-4" />
              Library
            </TabsTrigger>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 h-9 px-3 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-muted"
              onClick={() => handleAddContent("media")}
            >
              <Plus className="h-4 w-4" />
              Add PRO Content
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">1</span>
            </Button>
            <TabsTrigger value="channels" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-background">
              <Folder className="h-4 w-4" />
              Create Channel
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">2</span>
            </TabsTrigger>
            <TabsTrigger value="playlists" className="gap-2 data-[state=active]:bg-indigo-500 data-[state=active]:text-background">
              <ListVideo className="h-4 w-4" />
              Playlists
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">3</span>
            </TabsTrigger>
            <TabsTrigger value="livestudio" className="gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-background">
              <Radio className="h-4 w-4" />
              Live Stream
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-background">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI Generator
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Player Settings
            </TabsTrigger>
            <TabsTrigger value="protection" className="gap-2">
              <Shield className="h-4 w-4" />
              Protection
            </TabsTrigger>
            <TabsTrigger value="branding" className="gap-2">
              <Palette className="h-4 w-4" />
              Branding
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-2 border-pink-500/50 data-[state=active]:bg-pink-500 data-[state=active]:text-background">
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="userguide" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-background">
              <BookOpen className="h-4 w-4" />
              User Guide
            </TabsTrigger>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 ml-2"
              onClick={() => setShowQuickStart(true)}
            >
              <Play className="h-4 w-4" />
              Quick Start
            </Button>
          </TabsList>

          <TabsContent value="player" className="mt-6 space-y-6">
            {/* Usage Stats - Embed Pro Limits */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-card/50 rounded-lg p-4 border border-border/50">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Content Usage</span>
                  <span className="font-medium text-foreground">
                    {content.length} / 250
                  </span>
                </div>
                <Progress 
                  value={(content.length / 250) * 100} 
                  className="h-2" 
                />
              </div>
              <div className="bg-card/50 rounded-lg p-4 border border-border/50">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">AI Generations</span>
                  <span className="font-medium text-foreground">
                    0 / 25
                  </span>
                </div>
                <Progress 
                  value={0} 
                  className="h-2" 
                />
              </div>
            </div>


            {/* Your Content Library */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-xl font-bold">Your Content Library</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button variant="outline" size="sm" onClick={refreshData} disabled={isRefreshing}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} /> 
                    {isRefreshing ? "Refreshing..." : "Refresh"}
                  </Button>
                </div>
              </div>
              
              {/* Channel Filter Dropdown - Like Elite Pro */}
              <div className="flex items-center gap-3 flex-wrap">
                <Select value={libraryChannelFilter} onValueChange={setLibraryChannelFilter}>
                  <SelectTrigger className="w-[220px] border-cyan-500/50">
                    <Tv className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by channel" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="all">All Content</SelectItem>
                    <SelectItem value="unassigned">Unassigned Only</SelectItem>
                    {channels
                      .filter((c) => c.parent_id === null)
                      .flatMap((parent) => {
                        const parentCount = getAggregateChannelCount(parent.id);
                        const subChannels = channels
                          .filter((c) => c.parent_id === parent.id)
                          .sort((a, b) => a.name.localeCompare(b.name));

                        return [
                          <SelectItem key={parent.id} value={parent.id} className="font-semibold">
                            <span className="flex w-full items-center justify-between gap-3">
                              <span>📁 {parent.name}</span>
                              <span className="text-xs text-muted-foreground tabular-nums">{parentCount}</span>
                            </span>
                          </SelectItem>,
                          ...subChannels.map((sub) => {
                            const subCount = getAggregateChannelCount(sub.id);
                            return (
                              <SelectItem key={sub.id} value={sub.id} className="pl-6">
                                <span className="flex w-full items-center justify-between gap-3">
                                  <span>└ {sub.name}</span>
                                  <span className="text-xs text-muted-foreground tabular-nums">{subCount}</span>
                                </span>
                              </SelectItem>
                            );
                          }),
                        ];
                      })}
                  </SelectContent>
                </Select>
                
                {/* Filter indicator */}
                {libraryChannelFilter !== "all" && (
                  <>
                    <Badge variant="secondary" className="gap-1 bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
                      <Folder className="h-3 w-3" />
                      {libraryChannelFilter === "unassigned" 
                        ? "Showing unassigned content" 
                        : `Showing: ${channels.find(c => c.id === libraryChannelFilter)?.name || "Channel"}`
                      }
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => setLibraryChannelFilter("all")}
                    >
                      Clear filter
                    </Button>
                  </>
                )}
              </div>
              
              {/* Content Type Filter Tabs */}
              <div className="flex flex-wrap gap-2">
                {FILTER_TABS.map((tab) => (
                  <Button
                    key={tab.key}
                    variant={activeFilter === tab.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter(tab.key)}
                    className={`gap-2 ${activeFilter === tab.key ? "bg-amber-500 hover:bg-amber-600 text-background" : ""}`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {counts[tab.key]}
                    </Badge>
                  </Button>
                ))}
              </div>

              {/* Content Grid */}
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="bg-card/50 animate-pulse">
                      <div className="aspect-video bg-muted" />
                      <CardContent className="p-3 space-y-2">
                        <div className="h-4 bg-muted rounded" />
                        <div className="h-3 bg-muted rounded w-2/3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredContent.length === 0 ? (
                <Card className="bg-card/50 border-dashed">
                  <CardContent className="p-8 text-center">
                    <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No content yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">Add your first PRO content to get started</p>
                    <Button 
                      onClick={() => handleAddContent()} 
                      className="gap-2 bg-amber-500 hover:bg-amber-600"
                    >
                      <Plus className="h-4 w-4" />
                      Add PRO Content
                    </Button>
                  </CardContent>
                </Card>
              ) : contentByChannel.length === 0 ? (
                <Card className="bg-card/50 border-dashed">
                  <CardContent className="p-8 text-center">
                    <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No content matches your filter</h3>
                    <p className="text-sm text-muted-foreground mb-4">Try adjusting your channel or content type filter</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {contentByChannel.map(([channelId, { channelName, channelPrice, items }]) => (
                    <EmbedProCategoryRow
                      key={channelId}
                      title={channelName}
                      items={items}
                      channelPrice={channelPrice}
                      selectedId={selectedContent?.id}
                      onPlay={handlePlayContent}
                      onEdit={handleEditContent}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>

          </TabsContent>

          {/* Channels Tab */}
          <TabsContent value="channels" className="mt-6">
            {profileId ? (
              <EmbedProChannelManager profileId={profileId} />
            ) : (
              <Card className="bg-card/50">
                <CardContent className="p-8 text-center">
                  <Tv className="h-16 w-16 mx-auto text-purple-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Parent & Sub-Channels</h3>
                  <p className="text-muted-foreground mb-4">Sign in to create and manage your channel hierarchy</p>
                  <Button onClick={() => navigate("/auth?redirect=/embed-pro")} className="gap-2">
                    Sign In to Continue
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Playlists Tab */}
          <TabsContent value="playlists" className="mt-6">
            {profileId ? (
              <PlaylistManager profileId={profileId} />
            ) : (
              <Card className="bg-card/50">
                <CardContent className="p-8 text-center">
                  <ListVideo className="h-16 w-16 mx-auto text-indigo-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Playlist Organization</h3>
                  <p className="text-muted-foreground mb-4">Sign in to create and manage your playlists</p>
                  <Button onClick={() => navigate("/auth?redirect=/embed-pro")} className="gap-2">
                    Sign In to Continue
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Live Stream Tab */}
          <TabsContent value="livestudio" className="mt-6">
            <EmbedProStreamStudio profileId={profileId} />
          </TabsContent>


          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <EmbedProAnalytics />
          </TabsContent>

          <TabsContent value="ai" className="mt-6 space-y-6">
            <AiGeneratorTab profileId={profileId} isSandboxDemo={isSandboxDemo} />
          </TabsContent>

          <TabsContent value="settings" className="mt-6 space-y-6">
            <PlayerSettingsTab profileId={profileId} isSandboxDemo={isSandboxDemo} />
          </TabsContent>

          <TabsContent value="protection" className="mt-6 space-y-6">
            <ContentProtectionTab profileId={profileId} isSandboxDemo={isSandboxDemo} />
          </TabsContent>

          <TabsContent value="branding" className="mt-6">
            <Card className="bg-card/50">
              <CardContent className="p-8 text-center">
                <Palette className="h-16 w-16 mx-auto text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Custom Branding</h3>
                <p className="text-muted-foreground mb-4">Customize colors, logos, and player appearance</p>
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Coming Soon</Badge>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            {profileId ? (
              <EmbedProEventsHub 
                profileId={profileId} 
                onBack={() => setActiveMainTab("player")} 
              />
            ) : (
              <Card className="bg-card/50">
                <CardContent className="p-8 text-center">
                  <Calendar className="h-16 w-16 mx-auto text-pink-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Events Bookings</h3>
                  <p className="text-muted-foreground mb-4">Sign in to create and manage your events</p>
                  <Button onClick={() => navigate("/auth?redirect=/embed-pro")} className="gap-2">
                    Sign In to Continue
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="userguide" className="mt-6">
            <EmbedProUserGuide 
              profileId={profileId || undefined}
              onChannelCreated={() => setActiveMainTab("channels")}
            />
          </TabsContent>
        </Tabs>

      </div>
      {profileId && (
        <CreateVODContentModal
          open={showAddModal}
          onOpenChange={setShowAddModal}
          profileId={profileId}
          initialTab={addModalInitialTab}
          onSuccess={() => {
            setShowAddModal(false);
            fetchContent();
          }}
        />
      )}

      {editingContent && (
        <EditContentModal
          content={editingContent}
          open={showEditModal}
          onOpenChange={setShowEditModal}
          onSaved={() => {
            setShowEditModal(false);
            setEditingContent(null);
            fetchContent();
          }}
          onDelete={() => {
            setShowEditModal(false);
            setEditingContent(null);
            fetchContent();
          }}
        />
      )}

      <CreatorHelpTicketModal
        open={showHelpModal}
        onOpenChange={setShowHelpModal}
        profileId={profileId}
      />

      <TierHelpSupport 
        tierType="embed" 
        isOpen={showHelpCenter}
        onOpenChange={setShowHelpCenter}
        hideCard
      />

      <EmbedProQuickStartGuide 
        open={showQuickStart} 
        onOpenChange={setShowQuickStart} 
      />

      {/* Player Modal - Content Preview (like VOD Pro) */}
      <Dialog open={showPlayerModal} onOpenChange={(open) => {
        setShowPlayerModal(open);
        if (!open) setPlayerModalContent(null);
      }}>
        <DialogContent className="max-w-4xl h-[80vh] p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-4 pb-2 border-b bg-card">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg flex items-center gap-2">
                  <Play className="h-5 w-5 text-amber-500" />
                  Content Preview
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {playerModalContent?.title}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {playerModalContent?.is_approved ? (
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    Published
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-600/30">
                    Pending
                  </Badge>
                )}
                {playerModalContent?.is_ppv && playerModalContent?.price && (
                  <Badge className="bg-amber-500 text-white">
                    R{playerModalContent.price.toFixed(2)}
                  </Badge>
                )}
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 bg-black flex items-center justify-center overflow-hidden">
            <div className="w-full aspect-video">
              {playerModalContent?.embed_urls?.[0] ? (
                <UniversalPlayer 
                  url={playerModalContent.embed_urls[currentPlaylistIndex] || playerModalContent.embed_urls[0]} 
                  title={playerModalContent.title}
                  thumbnailUrl={playerModalContent.thumbnail_url || undefined}
                  autoPlay={false}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No content URL available</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Playlist navigation if multiple URLs */}
          {playerModalContent?.embed_urls && playerModalContent.embed_urls.length > 1 && (
            <div className="p-4 border-t bg-card flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPlaylistIndex(Math.max(0, currentPlaylistIndex - 1))}
                disabled={currentPlaylistIndex === 0}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-2">
                <ListVideo className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {currentPlaylistIndex + 1} / {playerModalContent.embed_urls.length}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPlaylistIndex(Math.min(playerModalContent.embed_urls!.length - 1, currentPlaylistIndex + 1))}
                disabled={currentPlaylistIndex === playerModalContent.embed_urls.length - 1}
                className="gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
