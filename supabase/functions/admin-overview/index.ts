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
  const adminToken = req.headers.get("x-admin-token");
  const auth = req.headers.get("authorization") || "";
  console.log("SECRET first5:", secret?.substring(0, 5), "last5:", secret?.substring((secret?.length || 0) - 5));
  console.log("TOKEN first5:", adminToken?.substring(0, 5), "last5:", adminToken?.substring((adminToken?.length || 0) - 5));
  console.log("Match:", adminToken === secret);
  if (!secret) return false;
  if (adminToken === secret) return true;
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const productKey = Deno.env.get("PRODUCT_KEY") || "unknown";
    const supabase = createClient(supabaseUrl, serviceKey);

    // Total users (profiles in this product DB)
    const { count: totalUsers } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true });

    // Free embed count
    const { count: freeEmbedCount } = await supabase
      .from("free_embed_records")
      .select("id", { count: "exact", head: true });

    // Pro asset count
    const { count: proAssetCount } = await supabase
      .from("pro_managed_assets")
      .select("id", { count: "exact", head: true });

    // Recent free embeds
    const { data: recentFree } = await supabase
      .from("free_embed_records")
      .select("id, user_id, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    // Recent pro assets
    const { data: recentPro } = await supabase
      .from("pro_managed_assets")
      .select("id, user_id, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    const recent = [
      ...(recentFree || []).map((r: any) => ({
        type: "FREE_EMBED_CREATED",
        id: r.id,
        user_id: r.user_id,
        created_at: r.created_at,
      })),
      ...(recentPro || []).map((r: any) => ({
        type: "PRO_ASSET_CREATED",
        id: r.id,
        user_id: r.user_id,
        created_at: r.created_at,
      })),
    ].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(0, 20);

    return new Response(
      JSON.stringify({
        product_key: productKey,
        stats: {
          total_users: totalUsers || 0,
          free_embed_count: freeEmbedCount || 0,
          pro_asset_count: proAssetCount || 0,
        },
        recent,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("admin-overview error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
