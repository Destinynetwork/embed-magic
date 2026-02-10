import { jsPDF } from "jspdf";
import {
  drawHeader,
  drawFooter,
  drawTierBadge,
  drawDivider,
  drawProTip,
  writeBody,
  writeSubheading,
  writeBulletList,
  writeNumberedStep,
  stripEmojis,
  PAGE_MARGIN,
  getPageWidth,
  getContentWidth,
} from "./pdfHelpers";
import {
  drawVideoPlayerMockup,
  drawContentGridMockup,
  drawPlatformIconsMockup,
  drawAIGeneratorMockup,
  drawProtectionMockup,
  drawAnalyticsChartMockup,
  drawLiveStudioMockup,
  drawChannelHierarchyMockup,
} from "./pdfMockups";

// Detailed content data for each chapter
interface ChapterContent {
  bodyText: string;
  bullets?: string[];
  steps?: { title: string; desc: string }[];
  proTip?: string;
  mockup?: string;
}

const CHAPTER_CONTENT: Record<string, ChapterContent> = {
  // Part 1: Getting Started
  "Dashboard Overview": {
    bodyText:
      "The Embed Pro dashboard is your command centre for managing all embedded content. It features a numbered workflow: Library, Add PRO Content, Create Channel, and Playlists. The dashboard provides quick access to analytics, live studio, and monetisation settings.",
    bullets: [
      "Library tab shows all your imported content with search and filter",
      "Add PRO Content button opens the content modal directly to Media & Embed",
      "Channels section displays your hierarchy of parent and sub-channels",
      "Playlists tab lets you create ordered collections for series or courses",
      "Analytics overview shows views, engagement, and revenue at a glance",
    ],
    proTip:
      "Pin your most-used features to the quick-access bar at the top of the dashboard for faster navigation.",
    mockup: "player",
  },
  "Quick Templates Overview": {
    bodyText:
      "Quick Templates let you start with a pre-configured setup tailored to your goal. Whether you are embedding a single video, building a course platform, or launching a VOD network, templates provide step-by-step guidance with progress tracking.",
    bullets: [
      "9 templates across Beginner, Intermediate, and Professional tiers",
      "Each template includes a setup-time estimate and feature checklist",
      "Step-by-step progress tracking with checkboxes",
      "One-click 'Use This Template' launches the channel creation wizard",
    ],
    proTip:
      "Start with a Beginner template even if you plan to scale up. You can always upgrade your channel structure later.",
    mockup: "grid",
  },
  "Beginner Templates": {
    bodyText:
      "Beginner templates are designed for creators who need a fast, simple embedding solution with minimal configuration.",
    steps: [
      { title: "Simple Embed", desc: "Single video or audio embed for blogs and websites. Paste a URL, customise the player, and copy the embed code. Setup takes about 5 minutes." },
      { title: "Video Gallery", desc: "A beautiful grid layout showcasing multiple videos. Create a channel, import content from YouTube or Vimeo, arrange thumbnails, and embed the gallery. Takes about 15 minutes." },
    ],
    proTip:
      "The Simple Embed template supports responsive design by default — your embed will look great on mobile, tablet, and desktop.",
  },
  "Intermediate Templates": {
    bodyText:
      "Intermediate templates add multi-platform aggregation, podcast feeds, and live streaming capabilities to your embedding toolkit.",
    steps: [
      { title: "Multi-Platform Hub", desc: "Aggregate content from 13+ platforms into a unified player. Connect YouTube, Vimeo, Spotify, and more. Create playlists and optionally enable pay-per-view. Setup takes about 30 minutes." },
      { title: "Podcast Feed", desc: "Audio-first embed with episode listings and RSS import. Set up your show channel, sync episodes, add artwork, and embed the player. Takes about 20 minutes." },
      { title: "Live Studio", desc: "Built-in streaming with up to 12 guests. Create a room, invite guests via link, go live, and save recordings to your library. Setup in 10 minutes." },
    ],
    proTip:
      "Use the Multi-Platform Hub template if your content is spread across multiple platforms. The unified player gives your audience a seamless viewing experience.",
  },
  "Professional Templates": {
    bodyText:
      "Professional templates provide enterprise-grade features for VOD networks, course platforms, membership sites, and event hubs with full monetisation.",
    steps: [
      { title: "Course Platform", desc: "Educational content with chapters, progress tracking, and certificates. Create a parent channel for the course, add sub-channels for modules, upload lessons, and configure pricing." },
      { title: "VOD Network", desc: "Full video-on-demand platform with channel hierarchy, subscriptions, pay-per-view, and deep analytics. Design your network structure first, then build out channels and content." },
      { title: "Membership Site", desc: "Exclusive gated content for paying members with tiered access levels and recurring billing via PayFast." },
      { title: "Event Hub", desc: "Sell tickets, host virtual events with live streaming, and offer VOD replays afterwards. Manage attendees and track ticket sales." },
    ],
    proTip:
      "The VOD Network template is ideal for creators with 50+ videos who want to build a Netflix-style content platform with subscription revenue.",
  },
  "Gateway Features": {
    bodyText:
      "Gateway Features are milestone unlocks that let you level up from one tier to the next. As you use Embed Pro, you will naturally progress through the tiers by enabling more advanced features.",
    bullets: [
      "Beginner to Intermediate: Enable channel pricing or create your first playlist with 5+ items",
      "Intermediate to Professional: Enable DRM protection, set up live studio, or create a channel bundle",
      "Each gateway provides a guided walkthrough to help you set up the new features",
      "Your content and settings carry over when you upgrade — nothing is lost",
    ],
    proTip:
      "You do not need to wait for a gateway unlock. You can enable any Professional feature at any time from Settings > Feature Access.",
  },
  "Account & Settings": {
    bodyText:
      "Configure your Embed Pro profile, branding, and preferences from the Settings page. This includes your creator profile, embed defaults, notification preferences, and API access.",
    bullets: [
      "Profile: Display name, avatar, bio, and social links",
      "Branding: Custom colours, logo overlay, and player skin",
      "Defaults: Default autoplay, loop, and quality settings for all embeds",
      "Notifications: Email alerts for new subscribers, purchases, and milestones",
      "API: Access keys for programmatic content management",
    ],
    proTip:
      "Set your default player settings once in Settings to save time. Every new embed will inherit these settings automatically.",
  },

  // Part 2: Content Library
  "Library Overview": {
    bodyText:
      "Your Content Library is the central hub for all imported, uploaded, and linked content. It supports up to 250 items across video, audio, documents, and images. Use the search bar, filters, and sort options to find content quickly.",
    bullets: [
      "Grid and list view toggle for different browsing styles",
      "Filter by content type: Video, Audio, Document, Image",
      "Filter by platform source: YouTube, Vimeo, Spotify, etc.",
      "Sort by date added, title, views, or revenue",
      "Bulk select for batch operations (move, delete, assign)",
    ],
    proTip:
      "Use list view when managing large libraries — it shows more metadata at a glance including view counts and revenue.",
    mockup: "grid",
  },
  "Adding Content": {
    bodyText:
      "Embed Pro uses a pass-through model: your content stays on the original platform (YouTube, Vimeo, Spotify, etc.) while Embed Pro provides the professional wrapper, organisation, and monetisation layer.",
    steps: [
      { title: "Paste URL", desc: "Copy any supported URL and paste it into the Add Content modal. Embed Pro auto-detects the platform and fetches metadata." },
      { title: "Import RSS", desc: "For podcasts, paste your RSS feed URL to automatically import all episodes with artwork and descriptions." },
      { title: "Upload Direct", desc: "Upload MP3, WAV, FLAC, M4A, or OGG audio files directly. Video files are supported via direct URL." },
      { title: "Bulk Import", desc: "Import entire YouTube playlists or channels by pasting the playlist/channel URL." },
    ],
    proTip:
      "When pasting a YouTube playlist URL, all videos are imported with their original titles, descriptions, and thumbnails. You can edit these afterwards.",
  },
  "Platform Support": {
    bodyText:
      "Embed Pro supports 13+ content platforms and direct file formats. Each platform integration auto-detects metadata including title, description, thumbnail, and duration.",
    bullets: [
      "YouTube — Videos, playlists, channels, and live streams",
      "Vimeo — Standard and Pro-hosted videos",
      "Spotify — Tracks, albums, playlists, and podcasts",
      "Wistia — Business-grade hosted videos",
      "Dailymotion — Videos and playlists",
      "TED — TED Talks and TEDx presentations",
      "Facebook — Public video posts",
      "Direct Audio — MP3, WAV, FLAC, M4A, OGG file formats",
      "Direct URL — Any publicly accessible media URL",
    ],
    proTip:
      "Spotify embeds are perfect for podcast episodes. The Spotify player renders natively within your Embed Pro channel.",
    mockup: "platforms",
  },
  "Metadata Management": {
    bodyText:
      "Edit titles, descriptions, tags, and categories for any content item. Metadata drives discoverability, SEO, and the viewer experience.",
    bullets: [
      "Title: Keep under 60 characters for optimal display",
      "Description: SEO-friendly descriptions with keywords",
      "Tags: Add up to 10 tags for filtering and search",
      "Category: Assign main and sub-categories",
      "Custom Fields: Add creator notes visible only to you",
    ],
    proTip:
      "Use the AI Description Generator (Part 5) to auto-create SEO-optimised descriptions from your content title and tags.",
  },
  "Thumbnails & Artwork": {
    bodyText:
      "Eye-catching thumbnails dramatically increase click-through rates. Embed Pro provides multiple ways to create and manage thumbnails.",
    bullets: [
      "Auto-fetch: Thumbnails are pulled automatically from the source platform",
      "AI Generation: Use your 25 monthly AI generations to create custom thumbnails",
      "Upload Custom: Upload your own PNG or JPG artwork",
      "Aspect Ratio: Thumbnails display at 16:9 in grid view and 4:3 in list view",
    ],
    proTip:
      "AI-generated thumbnails with bold text overlays and high-contrast colours get 40% more clicks than plain video screenshots.",
    mockup: "ai",
  },
  "Content Limits (250 items)": {
    bodyText:
      "Embed Pro supports up to 250 content items per account. Monitor your usage from the Library dashboard header which shows your current count and remaining capacity.",
    bullets: [
      "Usage bar shows current count vs. 250 limit",
      "Archived items still count towards your limit",
      "Delete or permanently remove items to free up slots",
      "Content across all channels and playlists shares the same 250-item pool",
    ],
    proTip:
      "Archive old content instead of deleting it. You can restore archived items later if needed, and they remain accessible via direct links.",
  },

  // Part 3: Channels & Organisation
  "Channel Overview": {
    bodyText:
      "Channels are the primary way to organise and present content in Embed Pro. Each channel can hold videos, audio, documents, and images. Channels can be free or paid, public or private.",
    bullets: [
      "Create unlimited channels (subject to your tier)",
      "Each channel gets its own embeddable player and landing page",
      "Assign content to channels using drag-and-drop or the content picker",
      "Channels display content count, subscriber count, and revenue",
    ],
    proTip:
      "Give each channel a clear, descriptive name and a custom thumbnail. Channels with branded thumbnails attract 3x more subscribers.",
    mockup: "hierarchy",
  },
  "Parent Channels": {
    bodyText:
      "Parent Channels serve as top-level containers that group related sub-channels together. They are ideal for creating package deals where viewers subscribe to access all sub-channel content.",
    steps: [
      { title: "Create Parent", desc: "Click 'Create Channel' and select 'Parent Channel'. Give it a name, description, and thumbnail." },
      { title: "Set Package Price", desc: "Configure the package price in ZAR. Subscribers get access to all sub-channels within this parent." },
      { title: "Add Sub-channels", desc: "Create or move existing channels under this parent to build your hierarchy." },
    ],
    proTip:
      "Package pricing offers better value than individual sub-channel pricing. Promote the bundle discount to increase conversions.",
  },
  "Sub-channels": {
    bodyText:
      "Sub-channels sit under a Parent Channel and can be sold individually or as part of the parent package. They are perfect for organising content by topic, series, or difficulty level.",
    bullets: [
      "Each sub-channel can have its own individual price",
      "Sub-channels inherit the parent's branding by default",
      "Content in sub-channels is accessible to parent package subscribers",
      "Re-order sub-channels with drag-and-drop",
    ],
    proTip:
      "Use sub-channels for course modules: 'Module 1: Introduction', 'Module 2: Advanced Topics', etc. Each can be purchased separately or as a course bundle.",
  },
  "Channel Hierarchy": {
    bodyText:
      "The Channel Hierarchy view shows the complete tree structure of your channels. Parent Channels at the top, Sub-channels branching below, and Playlists at the leaf level.",
    mockup: "hierarchy",
    bullets: [
      "Parent Channel > Sub-channel > Playlist (3-level hierarchy)",
      "Drag channels to re-order or re-parent them",
      "Collapse and expand sections for easier navigation",
      "The hierarchy view mirrors your public-facing channel structure",
    ],
    proTip:
      "Plan your hierarchy on paper before building it in Embed Pro. A well-structured hierarchy makes it easier for viewers to find and purchase content.",
  },
  "Channel Pricing (ZAR)": {
    bodyText:
      "All pricing in Embed Pro is in South African Rand (ZAR) processed via PayFast. You can set pricing at the parent (package) or sub-channel (individual) level.",
    bullets: [
      "Package Price: One price for all content in a parent channel",
      "Individual Price: Price each sub-channel separately",
      "Subscription: Monthly or annual recurring payments",
      "Pay-Per-View: One-time access to a single piece of content",
      "Platform Fee: 6% + VAT per transaction",
      "Bundle Discounts: Offer percentage discounts on channel bundles",
    ],
    proTip:
      "Offer both individual and package pricing. Many viewers will choose the package once they see the per-item savings.",
  },
  "Content Assignment": {
    bodyText:
      "Assign content from your library to channels using the Content Picker. You can assign the same content to multiple channels — it will not be duplicated.",
    steps: [
      { title: "Open Channel", desc: "Navigate to the channel you want to add content to." },
      { title: "Click Add Content", desc: "Opens the Content Picker showing all library items." },
      { title: "Select Items", desc: "Check the items you want to assign. Use search and filters to find content." },
      { title: "Confirm", desc: "Click 'Add Selected' to assign content to the channel." },
    ],
    proTip:
      "Content can belong to multiple channels simultaneously. This is useful for cross-promoting content across different topic channels.",
  },

  // Part 4: Playlists & Series
  "Playlist Overview": {
    bodyText:
      "Playlists let you create ordered collections of content for specific viewing experiences. They are ideal for course modules, event recordings, or curated collections.",
    bullets: [
      "Create playlists within any channel",
      "Drag-and-drop to reorder items",
      "Autoplay: Automatically advance to the next item",
      "Loop: Repeat the playlist when it reaches the end",
      "Embed entire playlists with a single embed code",
    ],
    proTip:
      "Name your playlists descriptively — 'Season 1' is better than 'Playlist 1'. Good names improve viewer navigation.",
  },
  "Series Creation": {
    bodyText:
      "Series are specialised playlists designed for episodic content. Each series supports seasons and episodes with automatic numbering and ordering.",
    steps: [
      { title: "Create Series", desc: "Click 'New Series' and enter the series name and description." },
      { title: "Add Seasons", desc: "Create Season 1, Season 2, etc. Each season acts as a sub-playlist." },
      { title: "Add Episodes", desc: "Import or assign content items as episodes. They auto-number sequentially." },
      { title: "Set Order", desc: "Drag episodes to set the correct viewing order within each season." },
    ],
    proTip:
      "Use the Series format for any content that should be watched in order: tutorials, documentaries, or ongoing shows.",
  },
  "Playlist Pricing": {
    bodyText:
      "Playlists can be sold separately from their parent channel. This gives you flexible monetisation options for curated content collections.",
    bullets: [
      "Set a one-time purchase price for the entire playlist",
      "Playlists within a paid channel are included in the channel subscription",
      "Individually priced playlists can be offered as upsells",
      "Bundle multiple playlists for a discounted price",
    ],
    proTip:
      "Create a 'Best Of' playlist with your top-performing content and price it as a standalone purchase for new visitors.",
  },
  "Ordering Content": {
    bodyText:
      "Content order within playlists and channels determines the viewer experience. Use drag-and-drop to arrange items in the optimal viewing sequence.",
    bullets: [
      "Drag-and-drop reordering in both grid and list views",
      "Auto-number episodes in series playlists",
      "Pin featured content to the top of any channel",
      "Sort options: Manual, Date Added, Title, Views, Revenue",
    ],
    proTip:
      "Put your highest-performing content first. Viewers who engage with the first item are 60% more likely to continue watching.",
  },
  "Featured Playlists": {
    bodyText:
      "Mark playlists as 'Featured' to highlight them on your channel landing page. Featured playlists appear in a prominent carousel at the top of the channel.",
    bullets: [
      "Up to 5 featured playlists per channel",
      "Featured playlists display with larger thumbnails and descriptions",
      "Use featured playlists to promote new content or seasonal collections",
      "Featured status can be toggled on and off at any time",
    ],
    proTip:
      "Rotate your featured playlists monthly to keep your channel page fresh and engaging for returning viewers.",
  },
  "Playlist Analytics": {
    bodyText:
      "Track playlist-level performance to understand which collections resonate with your audience.",
    bullets: [
      "Total views and watch time per playlist",
      "Completion rate: Percentage of viewers who watch the entire playlist",
      "Drop-off points: Where viewers stop watching",
      "Revenue generated per playlist",
      "Geographic distribution of viewers",
    ],
    proTip:
      "If a playlist has a high drop-off rate at a specific episode, consider improving that content or reordering the playlist.",
    mockup: "analytics",
  },

  // Part 5: AI Tools & Generation
  "AI Tools Overview": {
    bodyText:
      "Embed Pro includes AI-powered tools to help you create professional content faster. The AI suite includes thumbnail generation, description writing, tag suggestions, and content insights — all without requiring external API keys.",
    bullets: [
      "25 AI thumbnail generations per month (resets monthly)",
      "Unlimited AI description and tag suggestions",
      "Content performance insights powered by analytics",
      "Usage tracking in the dashboard header",
    ],
    proTip:
      "Save your AI generations for your most important content. Use auto-fetched thumbnails from YouTube/Vimeo for less critical items.",
    mockup: "ai",
  },
  "Thumbnail Generator": {
    bodyText:
      "The AI Thumbnail Generator creates eye-catching thumbnails from text descriptions. Simply describe what you want and the AI generates a professional thumbnail.",
    steps: [
      { title: "Open Generator", desc: "Click the AI icon on any content item or navigate to the AI Tools section." },
      { title: "Describe Thumbnail", desc: "Enter a description like 'Bold red background with white text showing EPISODE 5 and a film camera icon'." },
      { title: "Generate", desc: "Click Generate. The AI creates a 16:9 thumbnail in seconds." },
      { title: "Apply or Regenerate", desc: "Apply the thumbnail to your content or generate a new variation." },
    ],
    proTip:
      "Be specific in your descriptions. 'Modern gradient background, bold white serif text, warm lighting' produces better results than 'nice thumbnail'.",
    mockup: "ai",
  },
  "Description Generator": {
    bodyText:
      "Auto-generate SEO-optimised descriptions for your content. The AI uses your title, tags, and category to write compelling descriptions that improve discoverability.",
    bullets: [
      "Generates descriptions in 2-3 sentences optimised for search",
      "Includes relevant keywords based on your tags and category",
      "Tone options: Professional, Casual, Educational, Entertaining",
      "Edit and refine the generated text before applying",
    ],
    proTip:
      "Always add 2-3 tags before generating a description. Tags give the AI context to write more relevant, targeted descriptions.",
  },
  "Tag Suggestions": {
    bodyText:
      "AI Tag Suggestions analyse your content title and description to recommend relevant tags. Tags improve searchability within your channels and help viewers discover related content.",
    bullets: [
      "Suggests 5-10 relevant tags per content item",
      "Tags are based on title, description, and category context",
      "One-click to apply all suggestions or select individually",
      "Custom tags can be added alongside AI suggestions",
    ],
    proTip:
      "Use a mix of broad tags ('tutorial', 'music') and specific tags ('react-hooks', 'guitar-solo') for maximum discoverability.",
  },
  "Content Insights": {
    bodyText:
      "AI Content Insights analyses your library performance data to provide actionable recommendations for improving engagement and revenue.",
    bullets: [
      "Identifies your top-performing content by views and revenue",
      "Suggests optimal posting times based on audience activity",
      "Highlights underperforming content with improvement suggestions",
      "Revenue optimisation tips based on pricing patterns",
    ],
    proTip:
      "Review Content Insights weekly. Small adjustments to thumbnails, titles, and pricing based on AI recommendations can significantly boost engagement.",
    mockup: "analytics",
  },
  "Usage Tracking": {
    bodyText:
      "Monitor your AI generation usage from the dashboard. The usage tracker shows how many of your 25 monthly generations remain and when they reset.",
    bullets: [
      "Usage counter in the dashboard header shows remaining generations",
      "Monthly reset date displayed next to the counter",
      "Generation history log showing what was generated and when",
      "Unused generations do not roll over to the next month",
    ],
    proTip:
      "Plan your thumbnail generation schedule at the start of each month. Prioritise new releases and high-traffic content for AI thumbnails.",
  },

  // Part 6: Player & Protection
  "Player Settings": {
    bodyText:
      "Customise the Embed Pro player behaviour for each content item or set defaults that apply to all embeds.",
    bullets: [
      "Autoplay: Start playing when the embed loads (muted for browser compliance)",
      "Loop: Replay the content when it ends",
      "Speed Controls: Allow viewers to adjust playback speed (0.5x to 2x)",
      "Quality Selector: Let viewers choose resolution (auto, 360p, 720p, 1080p)",
      "Picture-in-Picture: Allow floating player on supported browsers",
      "Responsive: Automatically adjusts to container width",
    ],
    proTip:
      "Enable autoplay with mute for landing page hero videos. Viewers can click to unmute once they are engaged.",
    mockup: "player",
  },
  "Custom Timing": {
    bodyText:
      "Set custom start and end times for any embedded content. This is useful for highlighting specific sections or creating clips from longer videos.",
    bullets: [
      "Start Time: Jump to a specific timestamp when the embed loads",
      "End Time: Stop playback at a specific point",
      "Perfect for sharing specific moments or creating teasers",
      "Timing parameters are embedded in the embed code",
    ],
    proTip:
      "Use custom timing to create 30-second teasers of premium content. Link the teaser to the full paid version for conversions.",
  },
  "Protection Overview": {
    bodyText:
      "Embed Pro provides multiple layers of content protection, from basic right-click disabling to enterprise-grade DRM. Choose the level of protection that matches your content value.",
    bullets: [
      "Right-Click Disable: Prevent casual downloading",
      "Password Gates: Require a password to view content",
      "Dynamic Watermarks: Viewer-specific watermarks overlaid on content",
      "Domain Locking: Restrict embeds to specific domains",
      "DRM (Digital Rights Management): Enterprise encryption",
    ],
    mockup: "protection",
    proTip:
      "Layer multiple protection methods for maximum security. For example, combine domain locking + watermarks + DRM for premium content.",
  },
  "Password Protection": {
    bodyText:
      "Add a password gate to any content item or channel. Viewers must enter the correct password before the content loads. This is the simplest form of access control.",
    steps: [
      { title: "Select Content", desc: "Open the content item or channel settings." },
      { title: "Enable Password", desc: "Toggle 'Password Protection' on." },
      { title: "Set Password", desc: "Enter a strong password. Share it only with authorised viewers." },
      { title: "Customise Gate", desc: "Optionally customise the password prompt message and branding." },
    ],
    proTip:
      "Change passwords periodically for ongoing access control. Notify authorised viewers via email when passwords change.",
  },
  "Watermarking": {
    bodyText:
      "Dynamic watermarks overlay viewer-specific information on your content, making it easy to trace unauthorised redistribution.",
    bullets: [
      "Viewer Email: Display the logged-in viewer's email address",
      "Viewer ID: Show a unique viewer identifier",
      "Custom Text: Add your own watermark text",
      "Position: Top-left, top-right, bottom-left, bottom-right, or centre",
      "Opacity: Adjustable from subtle (10%) to prominent (80%)",
      "Moving Watermark: Watermark changes position periodically to prevent cropping",
    ],
    proTip:
      "Use a moving watermark with low opacity (15-20%) for the best balance between viewer experience and content protection.",
  },
  "Domain Locking": {
    bodyText:
      "Domain locking restricts where your embeds can be displayed. Only whitelisted domains can load your embedded content — attempts from other domains show an error message.",
    bullets: [
      "Add up to 10 whitelisted domains",
      "Supports wildcard subdomains (*.example.com)",
      "Error message is customisable",
      "Domain lock applies to all content within a channel",
    ],
    proTip:
      "Always whitelist both www.yourdomain.com and yourdomain.com. Missing one will cause embed failures for some visitors.",
  },
  "DRM Protection": {
    bodyText:
      "Enterprise-grade Digital Rights Management (DRM) uses industry-standard encryption to prevent unauthorised copying and redistribution of your content.",
    bullets: [
      "Widevine DRM: For Chrome, Firefox, Edge, and Android",
      "FairPlay DRM: For Safari and iOS devices",
      "PlayReady DRM: For Windows and Xbox",
      "Hardware-level encryption prevents screen recording",
      "Per-viewer licence keys for tracking and revocation",
    ],
    proTip:
      "DRM is recommended for premium courses, exclusive events, and any content where piracy would directly impact revenue.",
    mockup: "protection",
  },
  "Right-Click Disable": {
    bodyText:
      "The simplest form of content protection. Disabling right-click prevents casual viewers from using the browser context menu to download or inspect your embedded content.",
    bullets: [
      "One-click toggle in player settings",
      "Prevents 'Save Video As' from context menu",
      "Disables 'Inspect Element' shortcut on the embed",
      "Works across all modern browsers",
      "Not effective against technical users — combine with stronger protections",
    ],
    proTip:
      "Right-click disable is a deterrent, not a security measure. Use it alongside watermarks or DRM for content that has real value.",
  },

  // Part 7: Live Streaming & Events
  "Live Studio": {
    bodyText:
      "The built-in Live Studio lets you stream directly from your browser without any external software. It supports up to 12 guests and includes screen sharing, virtual backgrounds, and live chat.",
    steps: [
      { title: "Create Room", desc: "Click 'Go Live' to create a new studio room. Choose your camera, microphone, and audio settings." },
      { title: "Invite Guests", desc: "Copy the room link and share it with up to 12 guests. Guests join from their browser — no software needed." },
      { title: "Go Live", desc: "Click 'Start Broadcasting' to go live. Your stream appears in the Embed Pro player on your website." },
      { title: "Save Recording", desc: "After the stream, the recording is automatically saved to your content library." },
    ],
    proTip:
      "Test your setup with a private stream before going live. Check audio levels, lighting, and internet speed (minimum 5 Mbps upload).",
    mockup: "live",
  },
  "Multi-Guest Support": {
    bodyText:
      "Host panel discussions, interviews, and collaborative streams with up to 12 simultaneous guests. Each guest appears in a dynamic grid layout.",
    bullets: [
      "12 guest maximum with dynamic grid layout",
      "Individual audio controls per guest (mute/unmute)",
      "Screen sharing: Host or any guest can share their screen",
      "Virtual Backgrounds: Built-in backgrounds or upload custom images",
      "Guest Spotlight: Highlight a specific guest in a larger view",
      "Chat: Live text chat for host, guests, and audience",
    ],
    proTip:
      "Assign a co-host who can manage guest audio and chat while you focus on presenting. The co-host role has moderator permissions.",
    mockup: "live",
  },
  "Stream Recording": {
    bodyText:
      "All live streams can be recorded and saved to your content library for VOD replay. Recordings capture the full stream including screen shares and guest video.",
    bullets: [
      "One-click recording start/stop during any live stream",
      "Recordings are saved in your library with the stream title and date",
      "Edit recording metadata (title, description, thumbnail) after saving",
      "Assign recordings to channels and playlists",
      "Recordings count towards your 250-item content limit",
    ],
    proTip:
      "Always record your live streams. VOD replays can generate revenue long after the live event ends.",
  },
  "Events Hub": {
    bodyText:
      "Create and manage virtual or hybrid events with the Events Hub. Set dates, sell tickets, and host events with integrated live streaming.",
    steps: [
      { title: "Create Event", desc: "Set the event title, date, time, description, and thumbnail." },
      { title: "Configure Tickets", desc: "Set ticket types (adult, child, senior) with pricing in ZAR." },
      { title: "Promote", desc: "Share the event page link via social media and email." },
      { title: "Host Event", desc: "Go live at the scheduled time using the Live Studio." },
      { title: "Add Replay", desc: "After the event, make the recording available as VOD." },
    ],
    proTip:
      "Offer early-bird pricing by creating a time-limited discount coupon for your event tickets.",
  },
  "Ticket Sales": {
    bodyText:
      "Sell event tickets directly through Embed Pro. Payments are processed via PayFast in ZAR with automatic ticket generation and email delivery.",
    bullets: [
      "Multiple ticket tiers: Standard, VIP, VVIP",
      "Adult, child, and senior pricing options",
      "Discount percentages for children and seniors",
      "QR code tickets generated automatically",
      "Email delivery with ticket PDF attachment",
      "Check-in tracking for event attendance",
      "Platform fee: 6% + VAT per ticket sale",
    ],
    proTip:
      "Create a VVIP tier with exclusive backstage or meet-and-greet access. Premium tiers can command 3-5x the standard ticket price.",
  },
  "Event Analytics": {
    bodyText:
      "Track event performance from ticket sales through to attendance and engagement metrics.",
    bullets: [
      "Ticket sales: Total sold, revenue, and sales velocity",
      "Attendance: Check-in rate vs. tickets sold",
      "Live viewers: Peak concurrent viewers during the stream",
      "VOD replay: Views and watch time for the event recording",
      "Geographic data: Where your attendees are located",
    ],
    proTip:
      "Use event analytics to plan future events. If a specific time slot or topic drove higher attendance, replicate that formula.",
    mockup: "analytics",
  },

  // Part 8: Reference
  "Feature Inventory": {
    bodyText:
      "A complete inventory of every Embed Pro feature organised by tier. Use this reference to understand what is available at each level.",
    bullets: [
      "Beginner: Content library, basic player, thumbnails, simple embeds",
      "Intermediate: Channels, playlists, pricing, watermarks, password protection, live studio",
      "Professional: DRM, domain locking, advanced analytics, subscriptions, bundles, events",
      "All Tiers: AI tools, multi-platform support, responsive embeds",
    ],
  },
  "Supported Platforms": {
    bodyText:
      "Full list of supported platforms and file formats in Embed Pro.",
    bullets: [
      "Video Platforms: YouTube, Vimeo, Wistia, Dailymotion, TED, Facebook",
      "Audio Platforms: Spotify (tracks, albums, playlists, podcasts)",
      "Direct Audio: MP3, WAV, FLAC, M4A, OGG",
      "Direct URL: Any publicly accessible media file",
      "RSS Feeds: Podcast RSS for automatic episode import",
    ],
    mockup: "platforms",
  },
  "Content Types": {
    bodyText:
      "Embed Pro handles four primary content types, each with specific display and player options.",
    bullets: [
      "Video: Full player controls, quality selection, picture-in-picture",
      "Audio: Waveform player, album art display, playlist queue",
      "Document: PDF viewer with page navigation and zoom",
      "Image: Lightbox display with zoom and gallery navigation",
    ],
  },
  "Embed Codes": {
    bodyText:
      "Generate and customise embed codes for any content item, playlist, or channel. Embed codes are responsive iframe snippets that work on any website.",
    bullets: [
      "Single Item Embed: Embed one content item with full player",
      "Playlist Embed: Embed an entire playlist with navigation",
      "Channel Embed: Embed a channel landing page with all content",
      "Customisation: Width, height, autoplay, theme colour options",
      "Copy to Clipboard: One-click copy for easy pasting",
    ],
    proTip:
      "Use the responsive embed option (width: 100%) for mobile-friendly sites. Fixed-width embeds can break on smaller screens.",
  },
  "Troubleshooting": {
    bodyText:
      "Common issues and their solutions for Embed Pro users.",
    bullets: [
      "Embed not loading: Check that the source URL is publicly accessible",
      "Autoplay not working: Browsers require muted autoplay — enable mute option",
      "Password gate not appearing: Clear browser cache and check protection settings",
      "Live stream lag: Ensure minimum 5 Mbps upload speed and close other bandwidth-heavy applications",
      "Payment not processing: Verify your PayFast merchant details in Settings",
      "Content limit reached: Archive or delete unused items to free up slots",
    ],
  },
  "FAQ": {
    bodyText:
      "Answers to the most frequently asked questions about Embed Pro.",
    bullets: [
      "How many items can I embed? Up to 250 content items across all channels and playlists.",
      "Which platforms are supported? 13+ platforms including YouTube, Vimeo, Spotify, Wistia, Dailymotion, TED, and Facebook.",
      "How do AI generations work? 25 per month for thumbnails. Descriptions and tags are unlimited. Unused generations do not roll over.",
      "Can I monetise content? Yes — subscriptions, pay-per-view, bundles, and ticket sales via PayFast (ZAR). Platform fee is 6% + VAT.",
      "How many live stream guests? Up to 12 simultaneous guests in the built-in studio.",
      "What protection options exist? Password gates, watermarks, domain locking, and enterprise DRM (Widevine, FairPlay, PlayReady).",
    ],
  },
  "Keyboard Shortcuts": {
    bodyText:
      "Speed up your workflow with keyboard shortcuts available throughout the Embed Pro dashboard.",
    bullets: [
      "Ctrl/Cmd + N: Add new content",
      "Ctrl/Cmd + S: Save current changes",
      "Ctrl/Cmd + F: Search library",
      "Ctrl/Cmd + E: Copy embed code for selected item",
      "Ctrl/Cmd + P: Preview selected content",
      "Space: Play/pause in player view",
      "Arrow Left/Right: Previous/next in playlist",
      "Escape: Close modal or panel",
    ],
  },
  "Support & Contact": {
    bodyText:
      "Get help with Embed Pro through our support channels.",
    bullets: [
      "In-App Help: Click the Help icon in the dashboard header",
      "Email Support: support@supaview.co.za",
      "Website: www.supaview.co.za",
      "Response Time: Within 24 hours on business days",
      "Knowledge Base: Searchable articles and video tutorials",
      "Community: Join the creator community for tips and best practices",
    ],
    proTip:
      "Include your account email and a screenshot when contacting support. This helps us resolve your issue faster.",
  },
};

// Render a single chapter page
export function renderChapterPage(
  doc: jsPDF,
  sectionTitle: string,
  sectionPart: number,
  chapterTitle: string,
  chapterTier: string,
  chapterDescription: string | undefined,
  pageNum: number,
  isSecondPage: boolean
) {
  const pageWidth = getPageWidth(doc);
  const contentWidth = getContentWidth(doc);

  drawHeader(doc, `Part ${sectionPart}: ${sectionTitle}`, pageNum);

  // Chapter title
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(stripEmojis(chapterTitle), PAGE_MARGIN, 40);

  // Tier badge
  drawTierBadge(doc, chapterTier, pageWidth - PAGE_MARGIN - 25, 35);

  // Description
  if (chapterDescription) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(stripEmojis(chapterDescription), PAGE_MARGIN, 50);
  }

  const content = CHAPTER_CONTENT[stripEmojis(chapterTitle)];
  let y = 58;

  if (content) {
    if (!isSecondPage) {
      // First page: mockup + body text + bullets or steps
      // Draw mockup if defined
      if (content.mockup) {
        const mockupHeight = 45;
        switch (content.mockup) {
          case "player":
            drawVideoPlayerMockup(doc, PAGE_MARGIN, y, contentWidth, mockupHeight);
            break;
          case "grid":
            drawContentGridMockup(doc, PAGE_MARGIN, y, contentWidth, mockupHeight);
            break;
          case "platforms":
            drawPlatformIconsMockup(doc, PAGE_MARGIN, y + 15, contentWidth);
            y -= 10;
            break;
          case "ai":
            drawAIGeneratorMockup(doc, PAGE_MARGIN, y, contentWidth, mockupHeight * 0.6);
            break;
          case "protection":
            drawProtectionMockup(doc, PAGE_MARGIN, y, contentWidth, mockupHeight);
            break;
          case "analytics":
            drawAnalyticsChartMockup(doc, PAGE_MARGIN, y, contentWidth, mockupHeight);
            break;
          case "live":
            drawLiveStudioMockup(doc, PAGE_MARGIN, y, contentWidth, mockupHeight);
            break;
          case "hierarchy":
            drawChannelHierarchyMockup(doc, PAGE_MARGIN, y, contentWidth, mockupHeight);
            break;
        }
        y += 50;
      }

      // Body text
      y = writeBody(doc, content.bodyText, y, { fontSize: 9 });
      y += 4;

      // Numbered steps
      if (content.steps) {
        drawDivider(doc, y);
        y += 6;
        y = writeSubheading(doc, "Step-by-Step", y);
        y += 2;
        for (let i = 0; i < content.steps.length; i++) {
          y = writeNumberedStep(doc, i + 1, content.steps[i].title, content.steps[i].desc, y);
          y += 2;
          if (y > 260) break;
        }
      }

      // Bullets
      if (content.bullets && !content.steps) {
        y = writeBulletList(doc, content.bullets, y);
      }
    } else {
      // Second page: remaining bullets (if steps were on page 1) + pro tip
      if (content.steps && content.bullets) {
        y = writeSubheading(doc, "Key Features", y);
        y += 2;
        y = writeBulletList(doc, content.bullets, y);
        y += 4;
      } else if (content.steps) {
        // Show any remaining steps if they couldn't fit
        y = writeBody(
          doc,
          "Continue following the steps above to complete the setup. Each step builds on the previous one to create a fully configured feature.",
          y
        );
        y += 4;
      } else if (content.bullets) {
        // Second page additional context
        y = writeBody(
          doc,
          "Review the feature details above and refer to the dashboard for hands-on practice with each capability.",
          y
        );
        y += 4;
      }

      // Pro tip on second page
      if (content.proTip) {
        y = drawProTip(doc, content.proTip, y);
      }

      // Additional reference note
      y += 6;
      drawDivider(doc, y);
      y += 6;
      writeBody(
        doc,
        "For the latest updates and detailed walkthroughs, visit the Embed Pro dashboard and check the in-app help section.",
        y,
        { fontSize: 8, color: [128, 128, 128] }
      );
    }
  } else {
    // Fallback for chapters without detailed content
    y = writeBody(
      doc,
      "Detailed instructions for this feature are provided in the interactive dashboard. Navigate to the relevant section to access step-by-step tutorials and live examples.",
      y
    );
  }

  drawFooter(doc);
}
