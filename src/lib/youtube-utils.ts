/**
 * YouTube utilities for extracting video IDs and generating thumbnails
 */

/**
 * Extract YouTube video ID from various URL formats
 * Supports: youtube.com/watch, youtu.be, youtube.com/embed, youtube.com/v, youtube.com/shorts
 * Also works with iframe embed codes containing YouTube URLs
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /music\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

/**
 * Check if a URL or embed code contains a YouTube reference
 */
export function isYouTubeUrl(url: string): boolean {
  if (!url) return false;
  return url.includes("youtube.com") || url.includes("youtu.be");
}

/**
 * Generate YouTube thumbnail URL from video ID
 * Falls back to hqdefault if maxresdefault doesn't exist
 */
export function getYouTubeThumbnailUrl(videoId: string, quality: "maxres" | "hq" | "mq" | "sd" = "maxres"): string {
  const qualityMap = {
    maxres: "maxresdefault",
    hq: "hqdefault",
    mq: "mqdefault",
    sd: "sddefault",
  };
  
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

/**
 * Extract YouTube thumbnail from any embed URL array
 * Handles raw URLs and iframe embed codes
 * Returns the first valid YouTube thumbnail found
 */
export function extractYouTubeThumbnailFromUrls(urls: string[] | null): string | null {
  if (!urls || !Array.isArray(urls)) return null;
  
  for (const url of urls) {
    const videoId = extractYouTubeId(url);
    if (videoId) {
      return getYouTubeThumbnailUrl(videoId);
    }
  }
  
  return null;
}

/**
 * Check if any URL or embed code in the array contains a YouTube reference
 * Works with both direct URLs and iframe embed codes
 */
export function hasYouTubeUrl(urls: string[] | null): boolean {
  if (!urls || !Array.isArray(urls)) return false;
  return urls.some(url => isYouTubeUrl(url) || extractYouTubeId(url) !== null);
}
