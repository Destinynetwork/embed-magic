import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Download, 
  Sparkles, 
  Video,
  Shield,
  Radio,
  HelpCircle,
  Loader2,
  FileText,
  BarChart3,
} from "lucide-react";
import { QuickTemplatesGuide } from "./userguide/QuickTemplatesGuide";
import { GuideOverview } from "./userguide/GuideOverview";
import { usePdfGenerator } from "./userguide/usePdfGenerator";

interface EmbedProUserGuideProps {
  profileId?: string;
  onChannelCreated?: () => void;
}

export function EmbedProUserGuide({ profileId, onChannelCreated }: EmbedProUserGuideProps) {
  const [activeTab, setActiveTab] = useState("templates");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const { generatePdf } = usePdfGenerator();

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await generatePdf();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-cyan-500/20 border border-amber-500/30">
            <BookOpen className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Embed Pro User Guide</h2>
            <p className="text-sm text-muted-foreground">108-page comprehensive guide with step-by-step tutorials</p>
          </div>
        </div>
        
        <Button 
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className="gap-2 bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-600 hover:to-cyan-600"
        >
          {isGeneratingPdf ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Download PDF Guide
            </>
          )}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 flex-wrap h-auto gap-1">
          <TabsTrigger value="templates" className="gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white">
            <Sparkles className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="library" className="gap-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
            <Video className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="protection" className="gap-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
            <Shield className="h-4 w-4" />
            Protection
          </TabsTrigger>
          <TabsTrigger value="live" className="gap-2 data-[state=active]:bg-red-500 data-[state=active]:text-white">
            <Radio className="h-4 w-4" />
            Live Studio
          </TabsTrigger>
          <TabsTrigger value="guide" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            <FileText className="h-4 w-4" />
            Full Guide
          </TabsTrigger>
          <TabsTrigger value="faq" className="gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          <QuickTemplatesGuide profileId={profileId} onChannelCreated={onChannelCreated} />
        </TabsContent>

        <TabsContent value="library" className="mt-6">
          <div className="space-y-6">
            <Card className="border-cyan-500/30 bg-cyan-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-400">
                  <Video className="h-5 w-5" />
                  Content Library Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Learn how to manage your content library effectively with Embed Pro.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30">
                    <h4 className="font-semibold mb-2">Adding Content</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Paste URLs from 13+ platforms</li>
                      <li>• Import RSS feeds for podcasts</li>
                      <li>• Upload direct audio/video files</li>
                      <li>• Bulk import from YouTube playlists</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-muted/30">
                    <h4 className="font-semibold mb-2">Organizing Content</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Create channels and sub-channels</li>
                      <li>• Build playlists and series</li>
                      <li>• Tag and categorize content</li>
                      <li>• Set featured content</li>
                    </ul>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                  <h4 className="font-semibold text-cyan-400 mb-2">Supported Platforms</h4>
                  <div className="flex flex-wrap gap-2">
                    {["YouTube", "Vimeo", "Spotify", "Wistia", "Dailymotion", "TED", "Facebook", "MP3", "WAV", "FLAC", "M4A", "OGG", "Direct URL"].map(platform => (
                      <Badge key={platform} variant="secondary">{platform}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="protection" className="mt-6">
          <div className="space-y-6">
            <Card className="border-emerald-500/30 bg-emerald-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-400">
                  <Shield className="h-5 w-5" />
                  Content Protection Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Protect your valuable content with enterprise-grade security features.
                </p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30">
                    <h4 className="font-semibold mb-2">Basic Protection</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Disable right-click</li>
                      <li>• Hide controls</li>
                      <li>• Password gates</li>
                    </ul>
                    <Badge className="mt-2 bg-emerald-500/20 text-emerald-400">Beginner</Badge>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-muted/30">
                    <h4 className="font-semibold mb-2">Advanced Protection</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Dynamic watermarks</li>
                      <li>• Domain locking</li>
                      <li>• Viewer-specific IDs</li>
                    </ul>
                    <Badge className="mt-2 bg-amber-500/20 text-amber-400">Intermediate</Badge>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-muted/30">
                    <h4 className="font-semibold mb-2">Enterprise DRM</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Widevine DRM</li>
                      <li>• FairPlay DRM</li>
                      <li>• PlayReady DRM</li>
                    </ul>
                    <Badge className="mt-2 bg-purple-500/20 text-purple-400">Professional</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="live" className="mt-6">
          <div className="space-y-6">
            <Card className="border-red-500/30 bg-red-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <Radio className="h-5 w-5" />
                  Live Studio Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Go live with the built-in streaming studio supporting up to 12 guests.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30">
                    <h4 className="font-semibold mb-2">Studio Features</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Up to 12 guests</li>
                      <li>• Screen sharing</li>
                      <li>• Virtual backgrounds</li>
                      <li>• Live chat integration</li>
                      <li>• Recording to library</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-muted/30">
                    <h4 className="font-semibold mb-2">Streaming Options</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Embed directly on website</li>
                      <li>• RTMP to YouTube/Facebook</li>
                      <li>• Multi-destination streaming</li>
                      <li>• Schedule broadcasts</li>
                      <li>• Auto-save VOD replays</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="guide" className="mt-6">
          <GuideOverview />
        </TabsContent>

        <TabsContent value="faq" className="mt-6">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-blue-400" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    q: "How many content items can I embed?",
                    a: "Embed Pro supports up to 250 content items. This includes videos, audio, documents, and images from any supported platform."
                  },
                  {
                    q: "Which platforms are supported?",
                    a: "We support 13+ platforms including YouTube, Vimeo, Spotify, Wistia, Dailymotion, TED Talks, Facebook, and direct file uploads (MP3, WAV, FLAC, M4A, OGG)."
                  },
                  {
                    q: "How do AI thumbnail generations work?",
                    a: "You get 25 AI thumbnail generations per month. Simply describe your desired thumbnail and our AI will create it. Unused generations do not roll over."
                  },
                  {
                    q: "Can I monetize my content?",
                    a: "Yes! You can set up subscriptions, pay-per-view, and channel bundles. Payments are processed via PayFast (ZAR). Platform fee is 6% + VAT per transaction."
                  },
                  {
                    q: "How many guests can join a live stream?",
                    a: "The built-in live studio supports up to 12 guests simultaneously. You can also stream to external platforms via RTMP."
                  },
                  {
                    q: "What content protection options are available?",
                    a: "Options include password protection, right-click disable, dynamic watermarks, domain locking, and enterprise DRM (Widevine, FairPlay, PlayReady)."
                  },
                ].map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-muted/30">
                    <h4 className="font-semibold mb-2">{faq.q}</h4>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
