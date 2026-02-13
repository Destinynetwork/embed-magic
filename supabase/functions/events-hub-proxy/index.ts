import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const EVENTS_HUB_URL = Deno.env.get("EVENTS_HUB_URL");
  const EVENTS_HUB_API_KEY = Deno.env.get("EVENTS_HUB_API_KEY");

  if (!EVENTS_HUB_URL || !EVENTS_HUB_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Events Hub not configured on server" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await req.json();
    const { action, payload } = body;

    if (action === "publish") {
      const response = await fetch(`${EVENTS_HUB_URL}/publish-event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": EVENTS_HUB_API_KEY,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: response.ok ? 200 : 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "unpublish") {
      const response = await fetch(`${EVENTS_HUB_URL}/publish-event`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": EVENTS_HUB_API_KEY,
        },
        body: JSON.stringify({ source_event_id: payload.source_event_id }),
      });
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: response.ok ? 200 : 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ error: "Invalid action. Use 'publish' or 'unpublish'" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("events-hub-proxy error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
