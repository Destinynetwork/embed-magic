import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Video, 
  Users, 
  Copy, 
  ExternalLink, 
  Radio,
  Check,
  Share2,
  ArrowLeft,
  Monitor,
  Settings,
  Globe,
  Youtube,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import youtubeStreamKeyImage from "@/assets/stream-guide/youtube-stream-key.jpg";

// TikTok icon component
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// Twitch icon
const TwitchIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
  </svg>
);

// Facebook icon
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

interface EmbedProStreamStudioProps {
  profileId: string | null;
}

const platforms = [
  {
    id: "youtube",
    name: "YouTube Live",
    icon: Youtube,
    color: "text-red-500",
    rtmpServer: "rtmp://a.rtmp.youtube.com/live2",
    keyLocation: "YouTube Studio → Go Live → Stream Key",
    howToGet: [
      "1. Go to studio.youtube.com and sign in",
      "2. Click 'Create' → 'Go live' in the top right",
      "3. Select 'Stream' → 'Streaming software'",
      "4. Copy the 'Stream key' shown under Stream settings",
      "5. The RTMP URL is pre-filled above for you"
    ],
    helpUrl: "https://support.google.com/youtube/answer/2907883",
  },
  {
    id: "twitch",
    name: "Twitch",
    icon: TwitchIcon,
    color: "text-purple-500",
    rtmpServer: "rtmp://live.twitch.tv/app",
    keyLocation: "Twitch Dashboard → Settings → Stream Key",
    howToGet: [
      "1. Go to dashboard.twitch.tv and sign in",
      "2. Click Settings → Stream in the left sidebar",
      "3. Click 'Show' next to Primary Stream Key",
      "4. Copy the stream key (keep it secret!)",
      "5. The RTMP URL is pre-filled above for you"
    ],
    helpUrl: "https://help.twitch.tv/s/article/twitch-stream-key-faq",
  },
  {
    id: "facebook",
    name: "Facebook Live",
    icon: FacebookIcon,
    color: "text-blue-500",
    rtmpServer: "rtmps://live-api-s.facebook.com:443/rtmp/",
    keyLocation: "Facebook → Live Video → Use Stream Key",
    howToGet: [
      "1. Go to facebook.com/live/producer",
      "2. Click 'Create Live Video'",
      "3. Select 'Use Stream Key' in the left panel",
      "4. Copy both the 'Server URL' and 'Stream Key'",
      "5. Note: Facebook uses RTMPS (secure) by default"
    ],
    helpUrl: "https://www.facebook.com/help/587160588142067",
  },
  {
    id: "tiktok",
    name: "TikTok Live",
    icon: TikTokIcon,
    color: "text-pink-500",
    rtmpServer: "rtmp://push.tiktokcdn.com/rtmppush/",
    keyLocation: "TikTok Live Studio → Stream Key",
    howToGet: [
      "1. You need 1,000+ followers to go live on TikTok",
      "2. Go to tiktok.com/studio and sign in",
      "3. Click 'Go LIVE' in the sidebar",
      "4. Copy the 'Server URL' and 'Stream Key'",
      "5. Your region determines the RTMP server URL"
    ],
    helpUrl: "https://support.tiktok.com/en/live",
  },
  {
    id: "custom",
    name: "Custom RTMP",
    icon: Globe,
    color: "text-green-500",
    rtmpServer: "",
    keyLocation: "Your streaming provider",
    howToGet: [
      "1. Log into your streaming platform dashboard",
      "2. Find the 'Stream' or 'Broadcasting' settings",
      "3. Look for RTMP URL and Stream Key fields",
      "4. Enter both values in the fields above",
      "5. Common providers: Restream, Castr, Vimeo"
    ],
    helpUrl: "",
  },
];

export function EmbedProStreamStudio({ profileId }: EmbedProStreamStudioProps) {
  const [roomName, setRoomName] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [isRoomCreated, setIsRoomCreated] = useState(false);
  const [showDirectorView, setShowDirectorView] = useState(false);
  const [generatedLinks, setGeneratedLinks] = useState<{
    director: string;
    guest: string;
    audience: string;
  } | null>(null);
  
  // OBS Setup state
  const [selectedPlatform, setSelectedPlatform] = useState("youtube");
  const [streamKey, setStreamKey] = useState("");
  const [customServer, setCustomServer] = useState("");
  const [vdoNinjaRoom, setVdoNinjaRoom] = useState("");

  const activePlatform = platforms.find(p => p.id === selectedPlatform)!;

  const generateRandomId = () => {
    return Math.random().toString(36).substring(2, 10);
  };

  const createRoom = () => {
    if (!roomName.trim()) {
      toast.error("Please enter a room name");
      return;
    }

    const roomId = generateRandomId();
    const password = roomPassword || generateRandomId();
    
    const baseUrl = "https://vdo.ninja";
    const directorLink = `${baseUrl}/?director=${roomId}&password=${password}`;
    const guestLink = `${baseUrl}/?room=${roomId}&password=${password}&push`;
    const audienceLink = `${baseUrl}/?view=${roomId}&password=${password}`;

    setGeneratedLinks({
      director: directorLink,
      guest: guestLink,
      audience: audienceLink,
    });
    setIsRoomCreated(true);
    toast.success("Live room created! Share the links with your guests.");
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} link copied!`);
  };

  const openInNewTab = (url: string) => {
    window.open(url, "_blank");
  };

  const resetRoom = () => {
    setRoomName("");
    setRoomPassword("");
    setIsRoomCreated(false);
    setGeneratedLinks(null);
    setShowDirectorView(false);
  };

  const openDirectorView = () => {
    setShowDirectorView(true);
    window.open(generatedLinks!.director, "_blank");
  };

  const generateVdoNinjaLinks = () => {
    if (!vdoNinjaRoom.trim()) return null;
    
    const roomId = vdoNinjaRoom.toLowerCase().replace(/[^a-z0-9]/g, '');
    const password = Math.random().toString(36).substring(2, 10);
    
    return {
      director: `https://vdo.ninja/?director=${roomId}&password=${password}`,
      obsSource: `https://vdo.ninja/?view=${roomId}&password=${password}&scene=1`,
      guestLink: `https://vdo.ninja/?room=${roomId}&password=${password}&push`,
    };
  };

  const obsLinks = vdoNinjaRoom ? generateVdoNinjaLinks() : null;

  // Director View with back navigation
  if (showDirectorView && generatedLinks) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowDirectorView(false)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Links
          </Button>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Quick Access Links</CardTitle>
            <CardDescription>Share these links with your participants</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  Guest Link
                </p>
                <p className="text-xs text-muted-foreground">Share with participants to join</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => copyToClipboard(generatedLinks.guest, "Guest")}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => openInNewTab(generatedLinks.guest)}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium text-sm flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-green-500" />
                  Audience Link
                </p>
                <p className="text-xs text-muted-foreground">Share with viewers to watch</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => copyToClipboard(generatedLinks.audience, "Audience")}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => openInNewTab(generatedLinks.audience)}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button variant="outline" onClick={resetRoom}>
            Create New Room
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      <Alert className="border-amber-500/50 bg-amber-500/10">
        <Info className="h-4 w-4 text-amber-500" />
        <AlertDescription className="text-amber-200">
          <strong>Live Streaming:</strong> Stream to YouTube, Twitch, Facebook, TikTok and more using OBS + Ninja.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="quick-studio" className="w-full">
        <TabsList className="bg-secondary">
          <TabsTrigger value="quick-studio" className="gap-2">
            <Radio className="w-4 h-4" />
            Quick Studio
          </TabsTrigger>
          <TabsTrigger value="obs-setup" className="gap-2">
            <Monitor className="w-4 h-4" />
            OBS + Social Media
          </TabsTrigger>
          <TabsTrigger value="guide" className="gap-2">
            <Settings className="w-4 h-4" />
            Setup Guide
          </TabsTrigger>
        </TabsList>

        {/* Quick Studio Tab */}
        <TabsContent value="quick-studio" className="space-y-6">
          {isRoomCreated && (
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetRoom}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Create Room
              </Button>
            </div>
          )}

          {!isRoomCreated ? (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-amber-500" />
                  Create Live Room
                </CardTitle>
                <CardDescription>
                  Set up a room for your live stream with up to 10 guests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Room Name *</Label>
                  <Input
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="e.g., Weekly Podcast, Live Q&A"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password (optional)</Label>
                  <Input
                    value={roomPassword}
                    onChange={(e) => setRoomPassword(e.target.value)}
                    placeholder="Leave blank to auto-generate"
                  />
                </div>
                <Button onClick={createRoom} className="w-full bg-amber-500 hover:bg-amber-600">
                  <Video className="w-4 h-4 mr-2" />
                  Create Room
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-400">
                    <Check className="w-5 h-5" />
                    Room Created: {roomName}
                  </CardTitle>
                  <CardDescription>
                    Share the guest link with your participants and open the director link to manage the stream
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-card border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Video className="w-4 h-4 text-purple-500" />
                      Director (You)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Open this to control the stream and see all guests
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => copyToClipboard(generatedLinks!.director, "Director")}
                        className="flex-1"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                      <Button 
                        size="sm"
                        onClick={openDirectorView}
                        className="bg-purple-500 hover:bg-purple-600"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Open
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      Guest Link
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Share with participants to join and broadcast
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => copyToClipboard(generatedLinks!.guest, "Guest")}
                        className="flex-1"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => openInNewTab(generatedLinks!.guest)}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-green-500" />
                      Audience Link
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Share with viewers to watch the stream
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => copyToClipboard(generatedLinks!.audience, "Audience")}
                        className="flex-1"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => openInNewTab(generatedLinks!.audience)}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-card/50 border-border">
                <CardContent className="p-4">
                  <div className="grid md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-amber-400">10</p>
                      <p className="text-xs text-muted-foreground">Max Guests</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-amber-400">WebRTC</p>
                      <p className="text-xs text-muted-foreground">Protocol</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="border-amber-500/50 text-amber-400">Free with Embed Pro</Badge>
                      <p className="text-xs text-muted-foreground mt-1">Included</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="border-green-500/50 text-green-400">OBS Compatible</Badge>
                      <p className="text-xs text-muted-foreground mt-1">Stream Anywhere</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <Button variant="outline" onClick={resetRoom}>
                  Create New Room
                </Button>
              </div>
            </>
          )}
        </TabsContent>

        {/* OBS + Social Media Tab */}
        <TabsContent value="obs-setup" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Choose Your Streaming Platform</CardTitle>
              <CardDescription>
                Select where you want to broadcast and enter your stream key
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {platforms.map((platform) => {
                  const Icon = platform.icon;
                  const isSelected = selectedPlatform === platform.id;
                  return (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isSelected 
                          ? "border-amber-500 bg-amber-500/10" 
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <div className={`w-6 h-6 mx-auto mb-2 ${platform.color}`}>
                        <Icon />
                      </div>
                      <p className="text-xs font-medium text-center">{platform.name}</p>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-5 h-5 ${activePlatform.color}`}>
                    <activePlatform.icon />
                  </div>
                  <h3 className="font-semibold">{activePlatform.name} Settings</h3>
                </div>

                <div className="space-y-2">
                  <Label>RTMP Server URL</Label>
                  {selectedPlatform === "custom" ? (
                    <Input
                      value={customServer}
                      onChange={(e) => setCustomServer(e.target.value)}
                      placeholder="rtmp://your-server.com/live"
                    />
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={activePlatform.rtmpServer}
                        readOnly
                        className="bg-muted"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(activePlatform.rtmpServer, "Server URL")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Stream Key</Label>
                  <Input
                    type="password"
                    value={streamKey}
                    onChange={(e) => setStreamKey(e.target.value)}
                    placeholder="Paste your stream key here"
                  />
                  <p className="text-xs text-muted-foreground">
                    Find it at: {activePlatform.keyLocation}
                  </p>
                </div>

                {/* How to Get Stream Key Instructions */}
                <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <h4 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    How to Get Your {activePlatform.name} Stream Key
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {activePlatform.howToGet.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-400 font-mono text-xs mt-0.5">{idx + 1}.</span>
                        <span>{step.replace(/^\d+\.\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                  {activePlatform.helpUrl && (
                    <a
                      href={activePlatform.helpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-amber-400 hover:underline mt-3"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View official help documentation
                    </a>
                  )}
                </div>
              </div>

              {/* VDO.Ninja Room for OBS */}
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                <h3 className="font-semibold">Create VDO.Ninja Room for OBS</h3>
                <div className="space-y-2">
                  <Label>Room Name</Label>
                  <Input
                    value={vdoNinjaRoom}
                    onChange={(e) => setVdoNinjaRoom(e.target.value)}
                    placeholder="e.g., mystream"
                  />
                </div>

                {obsLinks && (
                  <div className="space-y-3 mt-4">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <Monitor className="w-4 h-4 text-purple-500" />
                          OBS Browser Source URL
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(obsLinks.obsSource, "OBS Source URL")}
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <code className="text-xs text-muted-foreground break-all block">
                        {obsLinks.obsSource}
                      </code>
                    </div>

                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <Video className="w-4 h-4 text-green-500" />
                          Guest/Camera Link
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(obsLinks.guestLink, "Guest Link")}
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <code className="text-xs text-muted-foreground break-all block">
                        {obsLinks.guestLink}
                      </code>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Setup Guide Tab */}
        <TabsContent value="guide" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>OBS + Ninja Setup Guide</CardTitle>
              <CardDescription>
                Visual step-by-step guide to start streaming
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Step 1 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-amber-500 text-background px-3 py-1">Step 1</Badge>
                  <h4 className="font-semibold text-lg">Download OBS Studio</h4>
                </div>
                <div className="ml-0 md:ml-14 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Download and install OBS Studio (free, open-source) from{" "}
                    <a 
                      href="https://obsproject.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline font-medium"
                    >
                      obsproject.com
                    </a>
                  </p>
                  <div className="bg-muted/30 border border-border rounded-lg p-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-[#302E31] rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-xs">OBS</span>
                        </div>
                        <span>Windows / Mac / Linux</span>
                      </div>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-green-400">Free Download</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 - Visual Guide */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-amber-500 text-background px-3 py-1">Step 2</Badge>
                  <h4 className="font-semibold text-lg">Create Room & Get OBS Source URL</h4>
                </div>
                <div className="ml-0 md:ml-14 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Go to the "OBS + Social Media" tab above and create a room. You'll get a special URL.
                  </p>
                  {/* Visual Diagram */}
                  <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-4">
                    <div className="text-xs text-muted-foreground mb-2">📍 Your "OBS + Social Media" tab will show:</div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">Enter a Room Name</div>
                          <div className="bg-background border rounded px-3 py-2 mt-1 text-xs text-muted-foreground">
                            e.g., "mystream" or "podcast2024"
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">OBS Browser Source URL (copy this!)</div>
                          <div className="bg-background border border-purple-500/50 rounded px-3 py-2 mt-1 font-mono text-xs text-purple-400 break-all">
                            https://vdo.ninja/?view=yourroom&password=xxx&scene=1
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">← This URL goes into OBS</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold shrink-0">3</div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">Guest/Camera Link (open on phone)</div>
                          <div className="bg-background border border-green-500/50 rounded px-3 py-2 mt-1 font-mono text-xs text-green-400 break-all">
                            https://vdo.ninja/?room=yourroom&password=xxx&push
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">← Open this on your phone/camera to send video</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 - OBS Browser Source Visual */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-amber-500 text-background px-3 py-1">Step 3</Badge>
                  <h4 className="font-semibold text-lg">Add Browser Source in OBS</h4>
                </div>
                <div className="ml-0 md:ml-14 space-y-4">
                  {/* OBS Interface Mock */}
                  <div className="bg-[#1E1E1E] border border-[#3E3E3E] rounded-lg overflow-hidden">
                    <div className="bg-[#2D2D2D] px-3 py-2 border-b border-[#3E3E3E] flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <span className="text-xs text-[#888]">OBS Studio</span>
                    </div>
                    <div className="p-4 grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-xs text-[#888] mb-2">Sources Panel:</div>
                        <div className="bg-[#2D2D2D] rounded border border-[#3E3E3E] p-2 text-xs text-[#CCC]">
                          <div className="flex items-center justify-between border-b border-[#3E3E3E] pb-1 mb-1">
                            <span>Sources</span>
                            <span className="text-amber-400 font-bold">+ Click Here</span>
                          </div>
                          <div className="py-1 flex items-center gap-2">
                            <span className="text-green-400">📹</span> Browser ← Select this
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs text-[#888] mb-2">Browser Source Settings:</div>
                        <div className="bg-[#2D2D2D] rounded border border-[#3E3E3E] p-2 text-xs">
                          <div className="mb-2">
                            <span className="text-[#888]">URL:</span>
                            <div className="bg-[#1E1E1E] rounded px-2 py-1 mt-1 text-purple-400 text-[10px] break-all">
                              Paste your OBS Source URL here
                            </div>
                          </div>
                          <div className="mb-2">
                            <span className="text-[#888]">Width:</span>
                            <span className="text-[#CCC] ml-2">1920</span>
                            <span className="text-[#888] ml-4">Height:</span>
                            <span className="text-[#CCC] ml-2">1080</span>
                          </div>
                          <div className="text-green-400">
                            ☑️ Control audio via OBS
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 - Find YouTube RTMP & Stream Key */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-amber-500 text-background px-3 py-1">Step 4</Badge>
                  <h4 className="font-semibold text-lg">Find Your YouTube RTMP & Stream Key</h4>
                </div>
                <div className="ml-0 md:ml-14 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Go to <a href="https://studio.youtube.com" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline font-medium">YouTube Studio</a> → Click "Go Live" → Select "Stream" to find your credentials.
                  </p>
                  {/* YouTube Screenshot */}
                  <div className="rounded-lg overflow-hidden border border-red-500/30">
                    <img 
                      src={youtubeStreamKeyImage} 
                      alt="YouTube Studio showing Stream Key location" 
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-red-400">
                      <Youtube className="w-4 h-4" />
                      YouTube Stream Settings Location
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1 ml-6 list-disc">
                      <li>Click <strong>"Stream"</strong> in the left sidebar</li>
                      <li>Look for <strong>"Stream Key"</strong> with a Copy button</li>
                      <li>The <strong>RTMP URL</strong> is: rtmp://a.rtmp.youtube.com/live2</li>
                      <li>Keep your stream key private - never share it publicly!</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 5 - Stream Settings Visual */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-amber-500 text-background px-3 py-1">Step 5</Badge>
                  <h4 className="font-semibold text-lg">Configure Stream Output</h4>
                </div>
                <div className="ml-0 md:ml-14 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    In OBS, go to <span className="text-foreground font-medium">Settings → Stream</span> and enter your platform details.
                  </p>
                  {/* Settings Mock */}
                  <div className="bg-[#1E1E1E] border border-[#3E3E3E] rounded-lg p-4 space-y-3">
                    <div className="grid md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[#888]">Service:</span>
                        <div className="bg-[#2D2D2D] rounded px-2 py-1 mt-1 text-[#CCC]">
                          YouTube / Twitch / Facebook / Custom
                        </div>
                      </div>
                      <div>
                        <span className="text-[#888]">Server:</span>
                        <div className="bg-[#2D2D2D] rounded px-2 py-1 mt-1 text-amber-400 break-all">
                          rtmp://a.rtmp.youtube.com/live2
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="text-[#888] text-xs">Stream Key:</span>
                      <div className="bg-[#2D2D2D] rounded px-2 py-1 mt-1 text-xs text-[#CCC]">
                        ••••••••••••••••••••••••
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">
                        Paste the Stream Key you copied from YouTube Studio
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 6 - Go Live! */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-500 text-background px-3 py-1">Step 6</Badge>
                  <h4 className="font-semibold text-lg">Go Live! 🎉</h4>
                </div>
                <div className="ml-0 md:ml-14 space-y-4">
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-4">
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                          <span className="text-green-400 text-lg">📱</span>
                        </div>
                        <div>
                          <div className="font-medium">Open Guest Link</div>
                          <div className="text-xs text-muted-foreground">On your phone or camera device</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                          <span className="text-green-400 text-lg">👀</span>
                        </div>
                        <div>
                          <div className="font-medium">Check OBS Preview</div>
                          <div className="text-xs text-muted-foreground">Your video should appear</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                          <span className="text-green-400 text-lg">🔴</span>
                        </div>
                        <div>
                          <div className="font-medium">Start Streaming</div>
                          <div className="text-xs text-muted-foreground">Click the button in OBS!</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-lg">💡 Pro Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Use the Director view to manage multiple camera sources</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Add overlays and graphics directly in OBS</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Use OBS Virtual Camera to bring guests into Zoom/Meet</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Stream to multiple platforms with services like Restream.io</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
