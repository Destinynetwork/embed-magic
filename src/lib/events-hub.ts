import { supabase } from "@/integrations/supabase/client";

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
  try {
    const { data, error } = await supabase.functions.invoke("events-hub-proxy", {
      body: { action: "publish", payload },
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    console.warn("Events Hub publish failed:", err);
    return { success: false, error: err.message };
  }
}

export async function unpublishEventFromHub(sourceEventId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke("events-hub-proxy", {
      body: { action: "unpublish", payload: { source_event_id: sourceEventId } },
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    console.warn("Events Hub unpublish failed:", err);
    return { success: false, error: err.message };
  }
}
