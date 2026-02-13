const EVENTS_HUB_URL = import.meta.env.VITE_EVENTS_HUB_URL;
const EVENTS_HUB_API_KEY = import.meta.env.VITE_EVENTS_HUB_API_KEY;

export interface EventPublishPayload {
  source_event_id: string;
  source_creator_id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  event_type?: "live" | "virtual" | "hybrid";
  category?: string;
  location?: string;
  venue_name?: string;
  start_date: string;
  end_date?: string;
  is_free?: boolean;
  is_pro?: boolean;
  ticket_price_zar?: number;
  ticket_url?: string;
  event_page_url?: string;
  creator_name?: string;
  creator_avatar_url?: string;
  creator_username?: string;
  max_attendees?: number;
  current_attendees?: number;
  status?: "upcoming" | "live" | "completed" | "cancelled";
  is_featured?: boolean;
}

export async function publishEventToHub(payload: EventPublishPayload): Promise<{ success: boolean; error?: string }> {
  if (!EVENTS_HUB_URL || !EVENTS_HUB_API_KEY) {
    console.warn("Events Hub not configured — skipping publish");
    return { success: false, error: "Events Hub not configured" };
  }
  const response = await fetch(`${EVENTS_HUB_URL}/publish-event`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": EVENTS_HUB_API_KEY },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) return { success: false, error: data.error || "Unknown error" };
  return { success: true };
}

export async function unpublishEventFromHub(sourceEventId: string): Promise<{ success: boolean; error?: string }> {
  if (!EVENTS_HUB_URL || !EVENTS_HUB_API_KEY) return { success: false, error: "Events Hub not configured" };
  const response = await fetch(`${EVENTS_HUB_URL}/publish-event`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", "x-api-key": EVENTS_HUB_API_KEY },
    body: JSON.stringify({ source_event_id: sourceEventId }),
  });
  const data = await response.json();
  if (!response.ok) return { success: false, error: data.error };
  return { success: true };
}
