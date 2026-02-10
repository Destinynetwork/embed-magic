import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function unauthorized() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function verifyServiceToken(req: Request): boolean {
  const secret = Deno.env.get("ADMIN_SERVICE_SECRET");
  if (!secret) return false;
  const auth = req.headers.get("authorization") || "";
  return auth === `Bearer ${secret}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!verifyServiceToken(req)) return unauthorized();

  try {
    const url = new URL(req.url);
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 100);
    const cursor = url.searchParams.get("cursor");
    const query = url.searchParams.get("query") || "";

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Get profiles (users in this product DB) with plan info
    let dbQuery = supabase
      .from("profiles")
      .select("id, user_id, email, username, full_name, plan, subscription_tier, is_creator, created_at, updated_at")
      .order("created_at", { ascending: false })
      .limit(limit + 1);

    if (cursor) {
      dbQuery = dbQuery.lt("created_at", cursor);
    }

    // Search by email, username, or full_name
    if (query) {
      dbQuery = dbQuery.or(
        `email.ilike.%${query}%,username.ilike.%${query}%,full_name.ilike.%${query}%`
      );
    }

    const { data, error } = await dbQuery;

    if (error) {
      return new Response(
        JSON.stringify({ error: "Database error", details: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const items = data || [];
    const hasMore = items.length > limit;
    const results = hasMore ? items.slice(0, limit) : items;
    const nextCursor = hasMore ? results[results.length - 1]?.created_at : null;

    // Enrich with product interaction data
    const enrichedUsers = await Promise.all(
      results.map(async (user: any) => {
        // Check free embeds count
        const { count: freeCount } = await supabase
          .from("free_embed_records")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id);

        // Check pro assets count
        const { count: proCount } = await supabase
          .from("pro_managed_assets")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id);

        // Last activity (most recent embed or asset)
        const { data: lastFree } = await supabase
          .from("free_embed_records")
          .select("created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1);

        const { data: lastPro } = await supabase
          .from("pro_managed_assets")
          .select("created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1);

        const lastFreeDate = lastFree?.[0]?.created_at;
        const lastProDate = lastPro?.[0]?.created_at;
        const lastSeen = [lastFreeDate, lastProDate, user.updated_at]
          .filter(Boolean)
          .sort()
          .reverse()[0] || null;

        return {
          ...user,
          free_embed_count: freeCount || 0,
          pro_asset_count: proCount || 0,
          last_seen_in_product: lastSeen,
        };
      })
    );

    return new Response(
      JSON.stringify({
        data: enrichedUsers,
        pagination: {
          limit,
          has_more: hasMore,
          next_cursor: nextCursor,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("admin-users error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
