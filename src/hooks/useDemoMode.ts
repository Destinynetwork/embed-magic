import { useCallback } from "react";
import { toast } from "sonner";

// Demo mode constants
export const DEMO_PROFILE_ID = "demo-sandbox-profile";

// Mock demo content for display purposes only
export const DEMO_CONTENT = [
  {
    id: "demo-1",
    asset_id: "DEMO-VIMEO-001",
    title: "Welcome to EMBED Pro Demo",
    description: "Experience the power of professional content embedding",
    thumbnail_url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
    content_type: "video",
    embed_urls: ["https://vimeo.com/347119375"],
    embed_provider: "vimeo",
    is_ppv: false,
    price: null,
    is_approved: true,
  },
  {
    id: "demo-2",
    asset_id: "DEMO-YOUTUBE-001",
    title: "Creative Content Showcase",
    description: "Watch how creators use EMBED Pro",
    thumbnail_url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80",
    content_type: "video",
    embed_urls: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
    embed_provider: "youtube",
    is_ppv: false,
    price: null,
    is_approved: true,
  },
  {
    id: "demo-3",
    asset_id: "DEMO-WISTIA-001",
    title: "Business Training Video",
    description: "Professional training content example",
    thumbnail_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
    content_type: "video",
    embed_urls: ["https://home.wistia.com/medias/e4a27b971d"],
    embed_provider: "wistia",
    is_ppv: false,
    price: null,
    is_approved: true,
  },
  {
    id: "demo-4",
    asset_id: "DEMO-DAILYMOTION-001",
    title: "Documentary Sample",
    description: "Explore documentary content embedding",
    thumbnail_url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80",
    content_type: "video",
    embed_urls: ["https://www.dailymotion.com/video/x8m8jw0"],
    embed_provider: "dailymotion",
    is_ppv: false,
    price: null,
    is_approved: true,
  },
  {
    id: "demo-5",
    asset_id: "DEMO-SPOTIFY-001",
    title: "Podcast Audio Demo",
    description: "Audio content embedding example",
    thumbnail_url: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80",
    content_type: "audio",
    embed_urls: ["https://open.spotify.com/episode/0z4qE4fkjG1z2pL1n3fdfb"],
    embed_provider: "spotify",
    is_ppv: false,
    price: null,
    is_approved: true,
  },
  {
    id: "demo-6",
    asset_id: "DEMO-VIMEO-002",
    title: "Music Video Showcase",
    description: "High quality music video embedding",
    thumbnail_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    content_type: "video",
    embed_urls: ["https://vimeo.com/76979871"],
    embed_provider: "vimeo",
    is_ppv: false,
    price: null,
    is_approved: true,
  },
];

// Mock player settings for demo display
export const DEMO_PLAYER_SETTINGS = {
  autoplay: false,
  loop: false,
  showControls: true,
  muted: false,
  startTime: "",
  endTime: "",
  playbackSpeed: "1.0",
  volume: "80",
};

// Mock protection settings for demo display
export const DEMO_PROTECTION_SETTINGS = {
  disableRightClick: true,
  passwordProtected: false,
  password: "",
  watermarkEnabled: true,
  watermarkText: "SUPAView ©",
  watermarkPosition: "bottom-right",
  drmEnabled: false,
  domainLock: "",
};

// Mock AI usage for demo display
export const DEMO_AI_USAGE = {
  ai_generations_used: 5,
  ai_generations_limit: 25,
};

/**
 * Hook to manage demo mode actions
 * All write operations show a toast and do nothing
 */
export function useDemoMode(isSandboxDemo: boolean) {
  const blockAction = useCallback((actionName: string) => {
    if (isSandboxDemo) {
      toast.info(`Sign up to ${actionName}`, {
        description: "This is a demo. Create an account to use this feature.",
        action: {
          label: "Sign Up",
          onClick: () => {
            window.location.href = "/auth?redirect=/embed-pro";
          },
        },
      });
      return true; // Action was blocked
    }
    return false; // Action was not blocked
  }, [isSandboxDemo]);

  const blockSave = useCallback(() => blockAction("save settings"), [blockAction]);
  const blockDelete = useCallback(() => blockAction("delete content"), [blockAction]);
  const blockAdd = useCallback(() => blockAction("add content"), [blockAction]);
  const blockEdit = useCallback(() => blockAction("edit content"), [blockAction]);
  const blockGenerate = useCallback(() => blockAction("generate AI images"), [blockAction]);
  const blockSubmit = useCallback(() => blockAction("submit tickets"), [blockAction]);

  return {
    blockAction,
    blockSave,
    blockDelete,
    blockAdd,
    blockEdit,
    blockGenerate,
    blockSubmit,
    isSandboxDemo,
  };
}
