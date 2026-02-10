/**
 * Internal auth helper layer.
 * Reads the current user session and fetches the user's plan/roles
 * from the shared auth database. Vendor-agnostic.
 */

import { supabase } from "@/integrations/supabase/client";

export interface AuthUser {
  id: string;            // profile id
  authUserId: string;    // auth.users id
  email: string | null;
  plan: string | null;
  subscriptionTier: string | null;
  isCreator: boolean;
  fullName: string | null;
  username: string | null;
}

const PRO_PLANS = ["Studio Pro", "pro", "embed_pro", "studio_zenstream"];
const PRO_TIER_PATTERNS = ["pro", "studio", "elite", "premium"];

/**
 * Returns the current authenticated user with their profile data,
 * or null if not authenticated.
 */
export async function requireUser(): Promise<AuthUser | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const { data: profile } = await supabase
    .from("profiles" as any)
    .select("*")
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (!profile) return null;

  const p = profile as any;
  return {
    id: p.id,
    authUserId: session.user.id,
    email: p.email || session.user.email || null,
    plan: p.plan,
    subscriptionTier: p.subscription_tier,
    isCreator: p.is_creator || false,
    fullName: p.full_name,
    username: p.username,
  };
}

/**
 * Checks if a user has Pro entitlement based on their plan or subscription tier.
 */
export function hasProEntitlement(user: AuthUser): boolean {
  if (user.plan && PRO_PLANS.includes(user.plan)) return true;
  if (user.subscriptionTier) {
    return PRO_TIER_PATTERNS.some(pattern =>
      user.subscriptionTier!.toLowerCase().includes(pattern)
    );
  }
  return false;
}

/**
 * Verifies user has Pro entitlement. Returns true if Pro, false otherwise.
 */
export function requireProEntitlement(user: AuthUser): boolean {
  return hasProEntitlement(user);
}

/**
 * Provider allowlist for free embeds
 */
export const ALLOWED_PROVIDERS = [
  "youtube",
  "vimeo",
  "dailymotion",
  "twitch",
  "soundcloud",
  "spotify",
  "rumble",
  "odysee",
  "peertube",
  "bitchute",
  "facebook",
  "instagram",
  "tiktok",
] as const;

export type AllowedProvider = typeof ALLOWED_PROVIDERS[number];

/**
 * Detect provider from a URL
 */
export function detectProvider(url: string): AllowedProvider | null {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) return "youtube";
  if (lowerUrl.includes("vimeo.com")) return "vimeo";
  if (lowerUrl.includes("dailymotion.com") || lowerUrl.includes("dai.ly")) return "dailymotion";
  if (lowerUrl.includes("twitch.tv")) return "twitch";
  if (lowerUrl.includes("soundcloud.com")) return "soundcloud";
  if (lowerUrl.includes("spotify.com")) return "spotify";
  if (lowerUrl.includes("rumble.com")) return "rumble";
  if (lowerUrl.includes("odysee.com")) return "odysee";
  if (lowerUrl.includes("bitchute.com")) return "bitchute";
  if (lowerUrl.includes("facebook.com") || lowerUrl.includes("fb.watch")) return "facebook";
  if (lowerUrl.includes("instagram.com")) return "instagram";
  if (lowerUrl.includes("tiktok.com")) return "tiktok";
  return null;
}

/**
 * Sanitize embed HTML: remove scripts, only allow safe iframe embeds
 */
export function sanitizeEmbedHtml(rawHtml: string): string {
  // Remove all script tags
  let sanitized = rawHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // Remove event handlers
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");

  // Only allow iframe tags with safe attributes
  const iframeMatch = sanitized.match(/<iframe[^>]*src\s*=\s*["']([^"']*)["'][^>]*>[\s\S]*?<\/iframe>/i);
  if (iframeMatch) {
    const src = iframeMatch[1];
    // Validate src is from an allowed provider
    const provider = detectProvider(src);
    if (provider) {
      return `<iframe src="${src}" width="100%" height="400" frameborder="0" allowfullscreen allow="autoplay; encrypted-media" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>`;
    }
  }

  // If no valid iframe found, return empty
  return "";
}
