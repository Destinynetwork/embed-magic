// Embed Pro PDF Guide Section Data with page mappings
export interface GuideChapter {
  page: string;
  title: string;
  tier: "Beginner" | "Intermediate" | "Professional" | "All";
  route?: string;
  description?: string;
}

export interface GuideSection {
  part: number;
  title: string;
  pages: string;
  tier: string;
  chapters: GuideChapter[];
}

export const GUIDE_SECTIONS: GuideSection[] = [
  {
    part: 1,
    title: "Getting Started",
    pages: "1-16",
    tier: "All",
    chapters: [
      { page: "1", title: "Cover", tier: "All" },
      { page: "2", title: "Welcome to Embed Pro", tier: "All" },
      { page: "3-4", title: "Dashboard Overview", tier: "All", route: "player", description: "Your Embed command center" },
      { page: "5-6", title: "Quick Templates Overview", tier: "All", description: "Choose your embed format" },
      { page: "7-8", title: "Beginner Templates", tier: "Beginner", description: "Simple Embed, Video Gallery" },
      { page: "9-10", title: "Intermediate Templates", tier: "Intermediate", description: "Multi-Platform Hub, Podcast Feed" },
      { page: "11-12", title: "Professional Templates", tier: "Professional", description: "VOD Network, Live Studio" },
      { page: "13-14", title: "Gateway Features", tier: "All", description: "Level up from one tier to the next" },
      { page: "15-16", title: "Account & Settings", tier: "All", route: "settings", description: "Configure your profile and preferences" },
    ]
  },
  {
    part: 2,
    title: "Content Library",
    pages: "17-28",
    tier: "Beginner+",
    chapters: [
      { page: "17-18", title: "Library Overview", tier: "Beginner", route: "player", description: "Your content collection hub" },
      { page: "19-20", title: "Adding Content", tier: "Beginner", description: "Link, upload, or import content" },
      { page: "21-22", title: "Platform Support", tier: "Beginner", description: "YouTube, Vimeo, Spotify, and more" },
      { page: "23-24", title: "Metadata Management", tier: "Intermediate", description: "Edit titles, descriptions, and tags" },
      { page: "25-26", title: "Thumbnails & Artwork", tier: "Beginner", description: "Create eye-catching visuals" },
      { page: "27-28", title: "Content Limits (250 items)", tier: "Intermediate", description: "Monitor your content usage" },
    ]
  },
  {
    part: 3,
    title: "Channels & Organization",
    pages: "29-40",
    tier: "Beginner+",
    chapters: [
      { page: "29-30", title: "Channel Overview", tier: "Beginner", route: "channels", description: "Organize content into channels" },
      { page: "31-32", title: "Parent Channels", tier: "Intermediate", description: "Create package deals" },
      { page: "33-34", title: "Sub-channels", tier: "Intermediate", description: "Individual content pricing" },
      { page: "35-36", title: "Channel Hierarchy", tier: "Intermediate", description: "Parent to Sub-channel structure" },
      { page: "37-38", title: "Channel Pricing (ZAR)", tier: "Intermediate", description: "Package vs individual pricing" },
      { page: "39-40", title: "Content Assignment", tier: "Beginner", description: "Assign content to channels" },
    ]
  },
  {
    part: 4,
    title: "Playlists & Series",
    pages: "41-52",
    tier: "Beginner+",
    chapters: [
      { page: "41-42", title: "Playlist Overview", tier: "Beginner", route: "playlists", description: "Create content collections" },
      { page: "43-44", title: "Series Creation", tier: "Beginner", description: "Episodes and seasons" },
      { page: "45-46", title: "Playlist Pricing", tier: "Intermediate", description: "Sell playlists separately" },
      { page: "47-48", title: "Ordering Content", tier: "Beginner", description: "Arrange viewing order" },
      { page: "49-50", title: "Featured Playlists", tier: "Intermediate", description: "Highlight your best content" },
      { page: "51-52", title: "Playlist Analytics", tier: "Professional", description: "Track engagement" },
    ]
  },
  {
    part: 5,
    title: "AI Tools & Generation",
    pages: "53-64",
    tier: "Beginner+",
    chapters: [
      { page: "53-54", title: "AI Tools Overview", tier: "Beginner", route: "ai", description: "AI-powered content creation" },
      { page: "55-56", title: "Thumbnail Generator", tier: "Beginner", description: "AI-generated thumbnails (25/month)" },
      { page: "57-58", title: "Description Generator", tier: "Intermediate", description: "SEO-optimized descriptions" },
      { page: "59-60", title: "Tag Suggestions", tier: "Beginner", description: "Smart tagging recommendations" },
      { page: "61-62", title: "Content Insights", tier: "Professional", description: "AI-powered analytics" },
      { page: "63-64", title: "Usage Tracking", tier: "Beginner", description: "Monitor AI generation limits" },
    ]
  },
  {
    part: 6,
    title: "Player & Protection",
    pages: "65-80",
    tier: "Intermediate+",
    chapters: [
      { page: "65-66", title: "Player Settings", tier: "Intermediate", route: "settings", description: "Autoplay, loop, speed controls" },
      { page: "67-68", title: "Custom Timing", tier: "Intermediate", description: "Start and end time controls" },
      { page: "69-70", title: "Protection Overview", tier: "Intermediate", route: "protection", description: "Content security options" },
      { page: "71-72", title: "Password Protection", tier: "Intermediate", description: "Secure your content" },
      { page: "73-74", title: "Watermarking", tier: "Intermediate", description: "Dynamic watermarks" },
      { page: "75-76", title: "Domain Locking", tier: "Professional", description: "Restrict embed domains" },
      { page: "77-78", title: "DRM Protection", tier: "Professional", description: "Digital rights management" },
      { page: "79-80", title: "Right-Click Disable", tier: "Intermediate", description: "Prevent downloads" },
    ]
  },
  {
    part: 7,
    title: "Live Streaming & Events",
    pages: "81-92",
    tier: "Intermediate+",
    chapters: [
      { page: "81-82", title: "Live Studio", tier: "Intermediate", route: "livestudio", description: "Built-in streaming studio" },
      { page: "83-84", title: "Multi-Guest Support", tier: "Professional", description: "Up to 12 guests" },
      { page: "85-86", title: "Stream Recording", tier: "Intermediate", description: "Save your broadcasts" },
      { page: "87-88", title: "Events Hub", tier: "Intermediate", route: "events", description: "Create and manage events" },
      { page: "89-90", title: "Ticket Sales", tier: "Professional", description: "Sell event tickets" },
      { page: "91-92", title: "Event Analytics", tier: "Professional", description: "Track attendance" },
    ]
  },
  {
    part: 8,
    title: "Reference",
    pages: "93-108",
    tier: "All",
    chapters: [
      { page: "93-94", title: "Feature Inventory", tier: "All", description: "Complete feature list" },
      { page: "95-96", title: "Supported Platforms", tier: "All", description: "YouTube, Vimeo, Spotify, etc." },
      { page: "97-98", title: "Content Types", tier: "All", description: "Video, Audio, Document, Image" },
      { page: "99-100", title: "Embed Codes", tier: "All", description: "Copy and customize embeds" },
      { page: "101-102", title: "Troubleshooting", tier: "All", description: "Common issues" },
      { page: "103-104", title: "FAQ", tier: "All", description: "Frequently asked questions" },
      { page: "105-106", title: "Keyboard Shortcuts", tier: "All", description: "Quick actions" },
      { page: "107-108", title: "Support & Contact", tier: "All", description: "Get help" },
    ]
  },
];

export const getTierColor = (tier: string): string => {
  switch (tier) {
    case "Beginner": return "border-emerald-500/50 text-emerald-400 bg-emerald-500/10";
    case "Intermediate": return "border-amber-500/50 text-amber-400 bg-amber-500/10";
    case "Professional": return "border-purple-500/50 text-purple-400 bg-purple-500/10";
    default: return "border-foreground/30 text-foreground bg-foreground/5";
  }
};

export const getTierBgColor = (tier: string): string => {
  switch (tier) {
    case "Beginner": return "#10b981";
    case "Intermediate": return "#f59e0b";
    case "Professional": return "#a855f7";
    default: return "#888888";
  }
};
