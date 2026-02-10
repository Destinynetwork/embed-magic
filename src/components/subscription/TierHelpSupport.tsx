import { useState } from "react";
import { HelpCircle, Mail, Monitor, Smartphone, Users, Share2, MessageCircle, FileText, ExternalLink, Tv, Radio, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type TierType = "free" | "embed" | "vod" | "elite";

interface TierHelpSupportProps {
  tierType: TierType;
  className?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideCard?: boolean;
}

interface HelpItem {
  title: string;
  content: string;
}

interface HelpContent {
  embedding: HelpItem[];
  streaming: HelpItem[];
  monetization: HelpItem[];
  extra: HelpItem[];
}

const tierConfig = {
  free: {
    title: "Free Tier",
    color: "cyan",
    description: "Help & resources for Free Tier users",
    bgGradient: "from-cyan-900/30 to-slate-900",
    borderColor: "border-cyan-500/30",
    buttonColor: "bg-cyan-500 hover:bg-cyan-600",
    extraLabel: "Limits",
  },
  embed: {
    title: "Embed Pro",
    color: "purple",
    description: "Help & resources for Embed Pro users",
    bgGradient: "from-purple-900/30 to-slate-900",
    borderColor: "border-purple-500/30",
    buttonColor: "bg-purple-500 hover:bg-purple-600",
    extraLabel: "Features",
  },
  vod: {
    title: "VOD Pro",
    color: "orange",
    description: "Help & resources for VOD Pro users",
    bgGradient: "from-orange-900/30 to-slate-900",
    borderColor: "border-orange-500/30",
    buttonColor: "bg-orange-500 hover:bg-orange-600",
    extraLabel: "Hosting",
  },
  elite: {
    title: "Elite Pro",
    color: "amber",
    description: "Help & resources for Elite Pro Standard users",
    bgGradient: "from-amber-900/30 to-slate-900",
    borderColor: "border-amber-500/30",
    buttonColor: "bg-amber-500 hover:bg-amber-600",
    extraLabel: "CDN",
  },
};

const getHelpContent = (tierType: TierType): HelpContent => {
  const commonEmbedding: HelpItem[] = [
    {
      title: "Supported Video Platforms",
      content: "YouTube, Vimeo, Dailymotion, Wistia, Streamable, TED Talks, Facebook Video, and direct MP4/WebM URLs.",
    },
    {
      title: "Supported Audio Formats",
      content: "MP3, WAV, FLAC, M4A, OGG files via direct URL, plus Spotify and SoundCloud embeds.",
    },
    {
      title: "How to Add Content",
      content: "1. Click 'Add Content'\n2. Paste your video/audio URL\n3. Add title and description\n4. Choose category and thumbnail\n5. Save to your library",
    },
    {
      title: "iFrame Embed Support",
      content: "Copy any iFrame embed code from platforms like YouTube, Vimeo, or Wistia. We'll extract the video URL automatically.",
    },
  ];

  const commonStreaming: HelpItem[] = [
    {
      title: "OBS Studio Setup",
      content: "1. Download OBS Studio from obsproject.com\n2. Go to Settings → Stream\n3. Select 'Custom' as service\n4. Enter your RTMP URL and Stream Key\n5. Start streaming!",
    },
    {
      title: "Guest Invitations",
      content: "Each room supports up to 10 guests. Share your room link with guests - they can join via browser without any software installation.",
    },
    {
      title: "Mobile Streaming",
      content: "Use apps like Streamlabs, Prism Live, or Larix Broadcaster to stream from your mobile device using your RTMP credentials.",
    },
    {
      title: "Multi-Platform Streaming",
      content: "Stream simultaneously to YouTube, Twitch, Facebook, and TikTok by adding multiple destinations in your streaming software.",
    },
  ];

  const commonMonetization: HelpItem[] = [
    {
      title: "Pay-Per-View (PPV)",
      content: "Set a price for individual content pieces. Viewers pay once to access the content permanently.",
    },
    {
      title: "Ticket Sales",
      content: "Sell tickets for live events and premieres. Track sales and check-ins from your Creator Dashboard.",
    },
    {
      title: "Earnings & Payouts",
      content: "Track all earnings in your Creator Dashboard. Request payouts via the Wallet section once you reach the minimum threshold.",
    },
    {
      title: "CRM & Clients",
      content: "Manage your audience, view subscriber history, and communicate with your fans through the CRM tab.",
    },
  ];

  // Tier-specific extra content
  const extraContent: Record<TierType, HelpItem[]> = {
    vod: [
      {
        title: "Cloud Storage (25GB)",
        content: "VOD Pro includes 25GB of cloud storage for your video files. Upload directly to our CDN for fast, reliable playback worldwide.",
      },
      {
        title: "Unlimited Streaming",
        content: "Stream to unlimited audiences without additional bandwidth costs. Your content is delivered via our global CDN.",
      },
      {
        title: "Video Upload",
        content: "Upload videos up to 4GB each. Supported formats: MP4, MOV, AVI, MKV, WebM. We automatically transcode for optimal playback.",
      },
      {
        title: "Channel & Playlist Management",
        content: "Organize content into channels and playlists. Create a branded viewing experience for your audience.",
      },
    ],
    embed: [
      {
        title: "AI Thumbnail Generator",
        content: "Generate professional thumbnails using AI. Describe your ideal thumbnail and we'll create it for you. 25 generations per month included.",
      },
      {
        title: "Content Protection",
        content: "Protect your content with watermarks, domain restrictions, and access controls. Prevent unauthorized embedding.",
      },
      {
        title: "Player Customization",
        content: "Customize player colors, controls, autoplay settings, and more to match your brand.",
      },
      {
        title: "Analytics Dashboard",
        content: "Track views, watch time, and audience engagement. Export reports and gain insights into your content performance.",
      },
    ],
    free: [
      {
        title: "Content Limit (100 Assets)",
        content: "Free Tier allows up to 100 video assets. Upgrade to Embed Pro for unlimited content management.",
      },
      {
        title: "Ticket Sales (100/month)",
        content: "Sell up to 100 tickets per month for events and PPV content. Includes earnings tracking and CRM access.",
      },
      {
        title: "AI Generations (10/month)",
        content: "Generate up to 10 AI thumbnails per month. Upgrade for higher limits.",
      },
      {
        title: "Upgrade Options",
        content: "Embed Pro: R199/month for unlimited embeds and AI features\nVOD Pro: R599/month for cloud hosting with 40GB storage",
      },
    ],
    elite: [
      {
        title: "CDN Storage (100GB)",
        content: "Elite Pro Standard includes 100GB of dedicated CDN storage. Upload directly for fast, DRM-protected global delivery.",
      },
      {
        title: "Studio Mix (300 Assets)",
        content: "Access Podcast, DJ, and Radio studios with 300 assets per studio type. Professional audio hosting with M3U8 adaptive streaming.",
      },
      {
        title: "Channel Display Templates",
        content: "Choose from Netflix Grid, YouTube Cards, Spotify List, Gallery Masonry, and Channel TV templates to showcase your content.",
      },
      {
        title: "Advanced Analytics",
        content: "Track detailed viewer analytics including device breakdown, geographic distribution, watch time, and completion rates.",
      },
      {
        title: "Library Sync",
        content: "Sync your content library with the CDN. Manage uploads, organize channels, and create playlists all from one dashboard.",
      },
    ],
  };

  return {
    embedding: commonEmbedding,
    streaming: commonStreaming,
    monetization: commonMonetization,
    extra: extraContent[tierType],
  };
};

export function TierHelpSupport({ tierType, className = "", isOpen, onOpenChange, hideCard = false }: TierHelpSupportProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const config = tierConfig[tierType];
  const helpContent = getHelpContent(tierType);

  // Support both controlled and uncontrolled modes
  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  return (
    <>
      {!hideCard && (
        <Card className={`bg-gradient-to-br ${config.bgGradient} ${config.borderColor} border ${className}`}>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-${config.color}-500/20 flex items-center justify-center`}>
                  <HelpCircle className={`h-6 w-6 text-${config.color}-400`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Need Help with {config.title}?</h3>
                  <p className="text-sm text-muted-foreground">
                    Guides for embedding, streaming, monetization & more
                  </p>
                </div>
              </div>
              <Button onClick={() => setOpen(true)} className={config.buttonColor}>
                <HelpCircle className="h-4 w-4 mr-2" />
                Open Help Center
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <HelpCircle className={`h-6 w-6 text-${config.color}-500`} />
              {config.title} Help Center
            </DialogTitle>
            <DialogDescription>
              {config.description}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="embedding" className="mt-4">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="embedding" className="gap-2">
                <Tv className="h-4 w-4" />
                <span className="hidden sm:inline">Embedding</span>
              </TabsTrigger>
              <TabsTrigger value="streaming" className="gap-2">
                <Radio className="h-4 w-4" />
                <span className="hidden sm:inline">Streaming</span>
              </TabsTrigger>
              <TabsTrigger value="monetization" className="gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Monetization</span>
              </TabsTrigger>
              <TabsTrigger value="extra" className="gap-2">
                {tierType === "vod" ? <Monitor className="h-4 w-4" /> : tierType === "embed" ? <Mic className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                <span className="hidden sm:inline">{config.extraLabel}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="embedding">
              <Card className="bg-card/50">
                <CardContent className="p-4">
                  <Accordion type="single" collapsible className="w-full">
                    {helpContent.embedding.map((item, index) => (
                      <AccordionItem key={index} value={`embedding-${index}`}>
                        <AccordionTrigger className="text-left">{item.title}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground whitespace-pre-line">
                          {item.content}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="streaming">
              <Card className="bg-card/50">
                <CardContent className="p-4">
                  <Accordion type="single" collapsible className="w-full">
                    {helpContent.streaming.map((item, index) => (
                      <AccordionItem key={index} value={`streaming-${index}`}>
                        <AccordionTrigger className="text-left">{item.title}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground whitespace-pre-line">
                          {item.content}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="monetization">
              <Card className="bg-card/50">
                <CardContent className="p-4">
                  <Accordion type="single" collapsible className="w-full">
                    {helpContent.monetization.map((item, index) => (
                      <AccordionItem key={index} value={`monetization-${index}`}>
                        <AccordionTrigger className="text-left">{item.title}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground whitespace-pre-line">
                          {item.content}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="extra">
              <Card className="bg-card/50">
                <CardContent className="p-4">
                  <Accordion type="single" collapsible className="w-full">
                    {helpContent.extra.map((item, index) => (
                      <AccordionItem key={index} value={`extra-${index}`}>
                        <AccordionTrigger className="text-left">{item.title}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground whitespace-pre-line">
                          {item.content}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-4 border-t border-border">
            <Button 
              variant="outline" 
              className="w-full gap-2"
              onClick={() => window.location.href = "mailto:support@supaview.com?subject=Help Request - " + config.title}
            >
              <Mail className="h-4 w-4" />
              Contact Support
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
