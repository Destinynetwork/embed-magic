import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Video, 
  Layers, 
  Radio, 
  Mic, 
  PlayCircle,
  Tv,
  Users,
  Store,
  Crown,
  Check,
  ChevronRight,
  Clock,
  Sparkles
} from "lucide-react";
import { EmbedProTemplateWizard } from "../EmbedProTemplateWizard";

interface QuickTemplatesGuideProps {
  profileId?: string;
  onChannelCreated?: () => void;
}

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  tier: "Beginner" | "Intermediate" | "Professional";
  setupTime: string;
  features: string[];
  steps: { title: string; description: string }[];
  color: string;
  category?: string;
}

const TEMPLATES: Template[] = [
  {
    id: "simple-embed",
    name: "Simple Embed",
    description: "Single video or audio embed for blogs and websites",
    icon: Video,
    tier: "Beginner",
    setupTime: "5 min",
    features: ["Single embed code", "Basic player controls", "Responsive design"],
    steps: [
      { title: "Add Content", description: "Paste your video or audio URL" },
      { title: "Customize Player", description: "Set autoplay, loop, controls" },
      { title: "Copy Embed", description: "Get the embed code for your site" },
    ],
    color: "emerald",
    category: "video",
  },
  {
    id: "video-gallery",
    name: "Video Gallery",
    description: "Showcase multiple videos in a beautiful grid layout",
    icon: Layers,
    tier: "Beginner",
    setupTime: "15 min",
    features: ["Grid layout", "Thumbnail previews", "Category filtering"],
    steps: [
      { title: "Create Channel", description: "Set up your gallery channel" },
      { title: "Add Videos", description: "Import from YouTube, Vimeo, etc." },
      { title: "Organize", description: "Arrange order and thumbnails" },
      { title: "Embed Gallery", description: "Get your gallery embed code" },
    ],
    color: "cyan",
    category: "video",
  },
  {
    id: "podcast-feed",
    name: "Podcast Feed",
    description: "Audio-first embed with episode listings",
    icon: Mic,
    tier: "Intermediate",
    setupTime: "20 min",
    features: ["Episode player", "Show notes", "RSS import", "Spotify integration"],
    steps: [
      { title: "Create Show", description: "Set up your podcast channel" },
      { title: "Import RSS", description: "Sync episodes from your feed" },
      { title: "Customize", description: "Add artwork and descriptions" },
      { title: "Embed Player", description: "Add to your website" },
    ],
    color: "amber",
    category: "audio",
  },
  {
    id: "multi-platform",
    name: "Multi-Platform Hub",
    description: "Aggregate content from YouTube, Vimeo, Spotify, and more",
    icon: Tv,
    tier: "Intermediate",
    setupTime: "30 min",
    features: ["13+ platforms", "Unified player", "Mixed content types"],
    steps: [
      { title: "Connect Platforms", description: "Add content from multiple sources" },
      { title: "Create Playlists", description: "Organize by theme or series" },
      { title: "Set Pricing", description: "Optional pay-per-view or subscription" },
      { title: "Launch Hub", description: "Share your content hub" },
    ],
    color: "purple",
    category: "video",
  },
  {
    id: "live-studio",
    name: "Live Studio",
    description: "Built-in streaming with multi-guest support",
    icon: Radio,
    tier: "Intermediate",
    setupTime: "10 min",
    features: ["Up to 12 guests", "Screen sharing", "Recording", "RTMP support"],
    steps: [
      { title: "Create Room", description: "Set up your live studio" },
      { title: "Invite Guests", description: "Share room link with guests" },
      { title: "Go Live", description: "Start broadcasting" },
      { title: "Save Recording", description: "Add to your library" },
    ],
    color: "red",
    category: "live",
  },
  {
    id: "course-platform",
    name: "Course Platform",
    description: "Educational content with progress tracking",
    icon: PlayCircle,
    tier: "Professional",
    setupTime: "45 min",
    features: ["Chapters", "Progress tracking", "Quizzes", "Certificates"],
    steps: [
      { title: "Create Course", description: "Set up parent channel for course" },
      { title: "Add Modules", description: "Create sub-channels for each module" },
      { title: "Upload Lessons", description: "Add video/audio content" },
      { title: "Set Pricing", description: "Configure subscription or one-time" },
      { title: "Launch", description: "Share with students" },
    ],
    color: "blue",
    category: "video",
  },
  {
    id: "vod-network",
    name: "VOD Network",
    description: "Full video-on-demand platform with monetization",
    icon: Crown,
    tier: "Professional",
    setupTime: "60 min",
    features: ["Channel hierarchy", "Subscriptions", "PPV", "Analytics"],
    steps: [
      { title: "Plan Structure", description: "Design your channel hierarchy" },
      { title: "Create Channels", description: "Parent and sub-channels" },
      { title: "Import Content", description: "Add all your videos" },
      { title: "Set Monetization", description: "Subscriptions, bundles, PPV" },
      { title: "Launch Network", description: "Go live with your VOD platform" },
    ],
    color: "amber",
    category: "video",
  },
  {
    id: "membership-site",
    name: "Membership Site",
    description: "Exclusive content for paying members",
    icon: Users,
    tier: "Professional",
    setupTime: "45 min",
    features: ["Member tiers", "Gated content", "Recurring billing"],
    steps: [
      { title: "Create Tiers", description: "Design membership levels" },
      { title: "Assign Content", description: "Gate content by tier" },
      { title: "Set Pricing", description: "Monthly/annual subscriptions" },
      { title: "Customize Portal", description: "Brand your member area" },
      { title: "Launch", description: "Start accepting members" },
    ],
    color: "violet",
    category: "video",
  },
  {
    id: "event-hub",
    name: "Event Hub",
    description: "Sell tickets and host virtual events",
    icon: Store,
    tier: "Professional",
    setupTime: "30 min",
    features: ["Ticket sales", "Live streaming", "VOD replay", "Attendee management"],
    steps: [
      { title: "Create Event", description: "Set date, time, and details" },
      { title: "Set Pricing", description: "Configure ticket tiers" },
      { title: "Promote", description: "Share event page" },
      { title: "Go Live", description: "Host your event" },
      { title: "Add Replay", description: "Make VOD available" },
    ],
    color: "pink",
    category: "live",
  },
];

const getTierColor = (tier: string) => {
  switch (tier) {
    case "Beginner": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
    case "Intermediate": return "bg-amber-500/20 text-amber-400 border-amber-500/50";
    case "Professional": return "bg-purple-500/20 text-purple-400 border-purple-500/50";
    default: return "";
  }
};

const getColorClasses = (color: string) => {
  const colors: Record<string, { border: string; bg: string; text: string; icon: string }> = {
    emerald: { border: "border-emerald-500/30", bg: "bg-emerald-500/10", text: "text-emerald-400", icon: "text-emerald-400" },
    cyan: { border: "border-cyan-500/30", bg: "bg-cyan-500/10", text: "text-cyan-400", icon: "text-cyan-400" },
    amber: { border: "border-amber-500/30", bg: "bg-amber-500/10", text: "text-amber-400", icon: "text-amber-400" },
    purple: { border: "border-purple-500/30", bg: "bg-purple-500/10", text: "text-purple-400", icon: "text-purple-400" },
    red: { border: "border-red-500/30", bg: "bg-red-500/10", text: "text-red-400", icon: "text-red-400" },
    blue: { border: "border-blue-500/30", bg: "bg-blue-500/10", text: "text-blue-400", icon: "text-blue-400" },
    violet: { border: "border-violet-500/30", bg: "bg-violet-500/10", text: "text-violet-400", icon: "text-violet-400" },
    pink: { border: "border-pink-500/30", bg: "bg-pink-500/10", text: "text-pink-400", icon: "text-pink-400" },
  };
  return colors[color] || colors.amber;
};

export function QuickTemplatesGuide({ profileId, onChannelCreated }: QuickTemplatesGuideProps) {
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, number[]>>({});
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const toggleStep = (templateId: string, stepIndex: number) => {
    setCompletedSteps(prev => {
      const current = prev[templateId] || [];
      if (current.includes(stepIndex)) {
        return { ...prev, [templateId]: current.filter(i => i !== stepIndex) };
      }
      return { ...prev, [templateId]: [...current, stepIndex] };
    });
  };

  const getProgress = (templateId: string, totalSteps: number) => {
    const completed = completedSteps[templateId]?.length || 0;
    return (completed / totalSteps) * 100;
  };

  const handleUseTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setWizardOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-amber-900/30 to-cyan-900/30 border border-amber-500/30">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-cyan-500/20 border border-amber-500/30">
            <Sparkles className="h-8 w-8 text-amber-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Quick Start Templates</h3>
            <p className="text-muted-foreground">
              Choose a template that matches your goal. Each template includes step-by-step 
              instructions to get you up and running quickly.
            </p>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEMPLATES.map((template) => {
          const colors = getColorClasses(template.color);
          const isExpanded = expandedTemplate === template.id;
          const progress = getProgress(template.id, template.steps.length);
          
          return (
            <Card 
              key={template.id}
              className={`${colors.border} ${isExpanded ? colors.bg : 'bg-card/50'} transition-all cursor-pointer hover:border-opacity-75`}
              onClick={() => setExpandedTemplate(isExpanded ? null : template.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${colors.bg}`}>
                      <template.icon className={`h-5 w-5 ${colors.icon}`} />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">{template.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={`text-[10px] ${getTierColor(template.tier)}`}>
                          {template.tier}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {template.setupTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">{template.description}</p>
              </CardHeader>
              
              {isExpanded && (
                <CardContent className="pt-0" onClick={(e) => e.stopPropagation()}>
                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Setup Progress</span>
                      <span className={colors.text}>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <p className="text-xs font-medium mb-2">Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-[10px]">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="space-y-2 mb-4">
                    <p className="text-xs font-medium">Steps:</p>
                    {template.steps.map((step, idx) => {
                      const isCompleted = completedSteps[template.id]?.includes(idx);
                      return (
                        <div 
                          key={idx}
                          className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                            isCompleted ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-muted/30 hover:bg-muted/50'
                          }`}
                          onClick={() => toggleStep(template.id, idx)}
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isCompleted ? 'bg-emerald-500 text-white' : 'bg-muted-foreground/30 text-foreground'
                          }`}>
                            {isCompleted ? <Check className="h-3 w-3" /> : idx + 1}
                          </div>
                          <div>
                            <p className={`text-xs font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                              {step.title}
                            </p>
                            <p className="text-[10px] text-muted-foreground">{step.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Action Button */}
                  <Button 
                    className={`w-full gap-2 ${colors.bg} ${colors.text} hover:opacity-80 border ${colors.border}`}
                    variant="outline"
                    size="sm"
                    onClick={() => handleUseTemplate(template)}
                  >
                    <Sparkles className="h-4 w-4" />
                    Use This Template
                  </Button>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Template Wizard */}
      {selectedTemplate && (
        <EmbedProTemplateWizard
          open={wizardOpen}
          onOpenChange={setWizardOpen}
          profileId={profileId}
          template={{
            name: selectedTemplate.name,
            category: selectedTemplate.category || "video",
            tier: selectedTemplate.tier,
          }}
          onChannelCreated={() => {
            setWizardOpen(false);
            onChannelCreated?.();
          }}
        />
      )}
    </div>
  );
}
