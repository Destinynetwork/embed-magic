import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  FolderPlus,
  ListVideo,
  Play,
  Shield,
  Sparkles,
  Upload,
  Link,
  Palette,
  Settings,
  Tv,
  Wallet,
  Eye,
  BarChart3,
} from "lucide-react";
import { QuickStartDialog, type GuideStep } from "@/components/quickstart/QuickStartDialog";

interface EmbedProQuickStartGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmbedProQuickStartGuide({ open, onOpenChange }: EmbedProQuickStartGuideProps) {
  const steps: GuideStep[] = [
    {
      id: 1,
      title: "Welcome to Embed Pro",
      subtitle: "Your complete creator workflow",
      icon: <Play className="h-8 w-8 text-primary" />,
      content: (
        <div className="space-y-4">
          <div className="rounded-xl p-6 text-center bg-card border border-border">
            <Sparkles className="h-12 w-12 text-amber-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">Production-Ready Workflow</h3>
            <p className="text-muted-foreground">
              Create → Organize → Monetize → Publish
            </p>
          </div>

          <div className="rounded-xl p-4 bg-muted/30 border border-border">
            <h4 className="font-semibold text-center mb-4">Your Creator Journey</h4>
            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-amber-950 flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold">Add PRO Content</p>
                    <p className="text-xs text-muted-foreground">Embed from YouTube, Vimeo, Spotify, etc.</p>
                  </div>
                </div>
                <Link className="h-5 w-5 text-amber-500" />
              </div>

              <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500 text-purple-950 flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold">Create Channels</p>
                    <p className="text-xs text-muted-foreground">Parent channels & sub-channels</p>
                  </div>
                </div>
                <Tv className="h-5 w-5 text-purple-500" />
              </div>

              <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500 text-indigo-950 flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold">Build Playlists</p>
                    <p className="text-xs text-muted-foreground">Curate collections & series</p>
                  </div>
                </div>
                <ListVideo className="h-5 w-5 text-indigo-500" />
              </div>

              <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-emerald-950 flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <p className="font-semibold">Set Pricing</p>
                    <p className="text-xs text-muted-foreground">Package, channel, or single purchase</p>
                  </div>
                </div>
                <Wallet className="h-5 w-5 text-emerald-500" />
              </div>

              <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 text-green-950 flex items-center justify-center font-bold">
                    5
                  </div>
                  <div>
                    <p className="font-semibold">Go Live</p>
                    <p className="text-xs text-muted-foreground">Publish & track analytics</p>
                  </div>
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      ),
      tip: "Follow the numbered workflow tabs in order for the smoothest setup experience.",
    },
    {
      id: 2,
      title: "Step 1: Add PRO Content",
      subtitle: "Embed from any supported platform",
      icon: <Link className="h-8 w-8 text-amber-500" />,
      content: (
        <div className="space-y-4">
          <Card className="bg-amber-500/10 border-amber-500/30">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Link className="h-5 w-5 text-amber-500" />
                Supported Platforms
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">📺 YouTube</div>
                <div className="flex items-center gap-2">🎬 Vimeo</div>
                <div className="flex items-center gap-2">🎥 Wistia</div>
                <div className="flex items-center gap-2">📹 Dailymotion</div>
                <div className="flex items-center gap-2">🎵 Spotify</div>
                <div className="flex items-center gap-2">🎧 SoundCloud</div>
                <div className="flex items-center gap-2">📘 Facebook</div>
                <div className="flex items-center gap-2">🎞️ Streamable</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">How to Add Content</h4>
              <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
                <li>Click <strong className="text-foreground">"Add PRO Content ❶"</strong> in the Workflow tab</li>
                <li>Paste your video/audio URL or embed code</li>
                <li>Fill in metadata (title, description, category)</li>
                <li>Set pricing if selling individually</li>
                <li>Submit for review</li>
              </ol>
            </CardContent>
          </Card>

          <Card className="bg-amber-500/10 border-amber-500/30">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Palette className="h-5 w-5 text-amber-500" />
                Creating Thumbnails
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                Use <strong className="text-foreground">Canva.com</strong> to create professional thumbnails (recommended size: <strong>640×360</strong> or <strong>1280×720</strong> for 16:9 aspect ratio).
              </p>
              <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                <li>Go to <strong className="text-foreground">canva.com</strong> and create a design</li>
                <li>Use "YouTube Thumbnail" template (1280×720)</li>
                <li>Design your thumbnail with text and images</li>
                <li>Click <strong className="text-foreground">Share → More → Embed</strong></li>
                <li>Copy the image URL and paste it in the thumbnail field</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      ),
      tip: "Use Canva.com for professional thumbnails. Check your Library tab for status badges (Live, Pending, Rejected).",
    },
    {
      id: 3,
      title: "Step 2: Create Channels",
      subtitle: "Organize with parent & sub-channels",
      icon: <Tv className="h-8 w-8 text-purple-500" />,
      content: (
        <div className="space-y-4">
          <Card className="bg-purple-500/10 border-purple-500/30">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3">Channel Hierarchy</h4>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <p className="font-semibold">📁 Parent Channel (Package)</p>
                  <p className="text-xs text-muted-foreground">E.g., "SA Movie Hub" - R299/month</p>
                  <p className="text-xs text-muted-foreground mt-1">Subscribers get access to ALL sub-channels</p>
                </div>
                <div className="pl-4 space-y-2">
                  <div className="p-2 bg-muted/50 rounded-lg">
                    <p className="font-medium">└ Action Movies - R79</p>
                  </div>
                  <div className="p-2 bg-muted/50 rounded-lg">
                    <p className="font-medium">└ Comedy Films - R59</p>
                  </div>
                  <div className="p-2 bg-muted/50 rounded-lg">
                    <p className="font-medium">└ Drama Collection - R69</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-card/50">
              <CardContent className="p-3 text-center">
                <Wallet className="h-6 w-6 text-emerald-500 mx-auto mb-1" />
                <p className="text-xs font-medium">Package Price</p>
                <p className="text-xs text-muted-foreground">Full channel access</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardContent className="p-3 text-center">
                <FolderPlus className="h-6 w-6 text-purple-500 mx-auto mb-1" />
                <p className="text-xs font-medium">Sub-Channel Price</p>
                <p className="text-xs text-muted-foreground">Individual category</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
      tip: "Parent channel subscribers automatically get access to all sub-channels - great for bundle deals!",
    },
    {
      id: 4,
      title: "Step 3: Build Playlists",
      subtitle: "Curate series and collections",
      icon: <ListVideo className="h-8 w-8 text-indigo-500" />,
      content: (
        <div className="space-y-4">
          <Card className="bg-indigo-500/10 border-indigo-500/30">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Playlist Types</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                  <strong>Series:</strong> Episodes in order (e.g., "Cooking Masterclass")
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                  <strong>Collections:</strong> Themed content (e.g., "Best of 2024")
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                  <strong>Courses:</strong> Educational modules
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Creating a Playlist</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                <li>Go to the <strong className="text-foreground">Playlists</strong> tab</li>
                <li>Click "Create Playlist"</li>
                <li>Add content from your library</li>
                <li>Drag to reorder</li>
                <li>Set playlist price (optional)</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      id: 5,
      title: "Monetization Options",
      subtitle: "Flexible pricing for your content",
      icon: <Wallet className="h-8 w-8 text-emerald-500" />,
      content: (
        <div className="space-y-4">
          <Card className="bg-emerald-500/10 border-emerald-500/30">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3">Pricing Levels</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-2 bg-emerald-500/20 rounded-lg">
                  <span className="font-medium">Package (Parent Channel)</span>
                  <Badge className="bg-emerald-500/30 text-emerald-400">All-Access</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                  <span>Sub-Channel Subscription</span>
                  <Badge variant="outline">Category Access</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                  <span>Single Purchase</span>
                  <Badge variant="outline">30-Day Rental</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-amber-500" />
              Revenue Split
            </h4>
            <div className="flex items-center justify-between">
              <span className="text-sm">You receive:</span>
              <Badge className="bg-emerald-500/20 text-emerald-400 text-lg">94%</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">6% platform fee on all sales</p>
          </div>
        </div>
      ),
      tip: "All pricing is in South African Rand (ZAR). Payments processed via PayFast.",
    },
    {
      id: 6,
      title: "Content Moderation",
      subtitle: "Quality assurance workflow",
      icon: <Eye className="h-8 w-8 text-cyan-500" />,
      content: (
        <div className="space-y-4">
          <Card className="bg-cyan-500/10 border-cyan-500/30">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3">Status Badges</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">Live</Badge>
                  <span className="text-muted-foreground">Approved and visible to viewers</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">Pending</Badge>
                  <span className="text-muted-foreground">Awaiting admin review</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/50">Rejected</Badge>
                  <span className="text-muted-foreground">Click to see rejection reason</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">Review</Badge>
                  <span className="text-muted-foreground">Additional review needed</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">View Status Details</h4>
              <p className="text-sm text-muted-foreground">
                Click any status badge or the <Eye className="h-4 w-4 inline" /> icon in your Library to see:
              </p>
              <ul className="text-sm mt-2 space-y-1 text-muted-foreground list-disc list-inside">
                <li>Rejection reasons</li>
                <li>Admin QA notes</li>
                <li>Age restriction requirements</li>
                <li>Content declarations</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      id: 7,
      title: "Analytics & Earnings",
      subtitle: "Track your performance",
      icon: <BarChart3 className="h-8 w-8 text-orange-500" />,
      content: (
        <div className="space-y-4">
          <Card className="bg-orange-500/10 border-orange-500/30">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">What You Can Track</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-orange-500" />
                  Total views per content
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-orange-500" />
                  Watch time & completion rates
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-orange-500" />
                  Revenue by channel/content
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-orange-500" />
                  Subscriber growth
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-orange-500" />
                  Geographic audience data
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/50">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Accessing Analytics</h4>
              <p className="text-sm text-muted-foreground">
                Navigate to the <strong className="text-foreground">Analytics</strong> tab to view detailed reports on your content performance and earnings.
              </p>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      id: 8,
      title: "You're Ready!",
      subtitle: "Start building your media business",
      icon: <CheckCircle2 className="h-8 w-8 text-green-500" />,
      content: (
        <div className="space-y-4">
          <div className="rounded-xl p-6 text-center bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">You're All Set!</h3>
            <p className="text-muted-foreground">
              Follow the workflow tabs to build your professional media library.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-card/50 border-border">
              <CardContent className="p-3 text-center">
                <Link className="h-6 w-6 text-amber-500 mx-auto mb-1" />
                <p className="text-xs font-medium">❶ Add Content</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border">
              <CardContent className="p-3 text-center">
                <Tv className="h-6 w-6 text-purple-500 mx-auto mb-1" />
                <p className="text-xs font-medium">❷ Create Channels</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border">
              <CardContent className="p-3 text-center">
                <ListVideo className="h-6 w-6 text-indigo-500 mx-auto mb-1" />
                <p className="text-xs font-medium">❸ Build Playlists</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border">
              <CardContent className="p-3 text-center">
                <BarChart3 className="h-6 w-6 text-orange-500 mx-auto mb-1" />
                <p className="text-xs font-medium">Track Analytics</p>
              </CardContent>
            </Card>
          </div>

          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-center">
            <Wallet className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold">Earn 94% on Every Sale</p>
            <p className="text-xs text-muted-foreground">Payments via PayFast in ZAR</p>
          </div>
        </div>
      ),
    },
  ];

  return <QuickStartDialog open={open} onOpenChange={onOpenChange} steps={steps} />;
}
