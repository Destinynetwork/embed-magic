import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET") || "default-webhook-secret";

Deno.serve(async (req: Request) => {
  // Only accept POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Verify webhook secret
  const authHeader = req.headers.get("x-webhook-secret") || req.headers.get("authorization");
  if (authHeader !== `Bearer ${WEBHOOK_SECRET}` && authHeader !== WEBHOOK_SECRET) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { asset_id, status, playback_url, thumbnail_url, duration_seconds, metadata } = body;

    if (!asset_id || !status) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: asset_id, status" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate status
    const validStatuses = ["UPLOADING", "READY", "FAILED"];
    if (!validStatuses.includes(status)) {
      return new Response(
        JSON.stringify({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Idempotent update - find by external_asset_id
    const updateData: Record<string, any> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (playback_url) updateData.playback_url = playback_url;
    if (thumbnail_url) updateData.thumbnail_url = thumbnail_url;
    if (duration_seconds !== undefined) updateData.duration_seconds = duration_seconds;
    if (metadata) updateData.metadata_json = metadata;

    const { data, error } = await supabase
      .from("pro_managed_assets")
      .update(updateData)
      .eq("external_asset_id", asset_id)
      .select("id, title, status");

    if (error) {
      console.error("Database update error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to update asset", details: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({ error: "Asset not found", asset_id }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, updated: data }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Webhook processing error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
