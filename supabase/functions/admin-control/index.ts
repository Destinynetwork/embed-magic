import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-token",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

interface ProductConfig {
  product_key: string;
  name: string;
  admin_base_url: string;
}

function getProducts(): ProductConfig[] {
  const raw = Deno.env.get("PRODUCTS_JSON");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    console.error("Failed to parse PRODUCTS_JSON");
    return [];
  }
}

function getServiceToken(): string {
  return Deno.env.get("ADMIN_SERVICE_SECRET") || "";
}

/** Verify that the caller is an admin. Accepts x-admin-token or Bearer token. */
async function verifyAdmin(req: Request): Promise<boolean> {
  // Option 1: service token (for testing)
  const secret = Deno.env.get("ADMIN_SERVICE_SECRET");
  const adminToken = req.headers.get("x-admin-token");
  if (secret && adminToken === secret) return true;
  const auth = req.headers.get("authorization") || "";
  if (secret && auth === `Bearer ${secret}`) return true;

  // Option 2: Supabase JWT — check user_roles for admin
  const token = auth.replace("Bearer ", "");
  if (!token) return false;
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return false;

    // Check allowlist
    const allowlist = Deno.env.get("ADMIN_EMAIL_ALLOWLIST");
    if (allowlist) {
      const emails = allowlist.split(",").map((e: string) => e.trim().toLowerCase());
      if (emails.includes(user.email?.toLowerCase() || "")) return true;
    }

    // Check user_roles table
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    return !!data;
  } catch {
    return false;
  }
}

/** Fan-out: call a specific admin endpoint on all products in parallel */
async function fanOut(endpoint: string, queryString = ""): Promise<{ product_key: string; name: string; data: any; error?: string }[]> {
  const products = getProducts();
  const token = getServiceToken();

  const results = await Promise.allSettled(
    products.map(async (p) => {
      const url = `${p.admin_base_url}/${endpoint}${queryString ? `?${queryString}` : ""}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "x-admin-token": token,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const text = await res.text();
        return { product_key: p.product_key, name: p.name, data: null, error: `${res.status}: ${text}` };
      }
      const data = await res.json();
      return { product_key: p.product_key, name: p.name, data };
    })
  );

  return results.map((r, i) => {
    if (r.status === "fulfilled") return r.value;
    return { product_key: products[i].product_key, name: products[i].name, data: null, error: r.reason?.message || "Unknown error" };
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!(await verifyAdmin(req))) {
    return json({ error: "Unauthorized" }, 401);
  }

  const url = new URL(req.url);
  const path = url.pathname.split("/").filter(Boolean).pop() || "";
  const productFilter = url.searchParams.get("product");
  const search = url.searchParams.get("search") || "";

  try {
    switch (path) {
      case "overview": {
        const results = await fanOut("admin-overview");
        // Aggregate stats
        let totalUsers = 0, totalFreeEmbeds = 0, totalProAssets = 0;
        const allRecent: any[] = [];
        const perProduct: any[] = [];

        for (const r of results) {
          if (r.data) {
            totalUsers += r.data.stats?.total_users || 0;
            totalFreeEmbeds += r.data.stats?.free_embed_count || 0;
            totalProAssets += r.data.stats?.pro_asset_count || 0;
            perProduct.push({
              product_key: r.product_key,
              name: r.name,
              stats: r.data.stats,
            });
            for (const ev of r.data.recent || []) {
              allRecent.push({ ...ev, product_key: r.product_key, product_name: r.name });
            }
          } else {
            perProduct.push({ product_key: r.product_key, name: r.name, stats: null, error: r.error });
          }
        }

        allRecent.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        return json({
          global: { total_users: totalUsers, free_embed_count: totalFreeEmbeds, pro_asset_count: totalProAssets },
          per_product: perProduct,
          recent: allRecent.slice(0, 50),
          products: getProducts().map((p) => ({ product_key: p.product_key, name: p.name })),
        });
      }

      case "free-embeds": {
        const qs = search ? `search=${encodeURIComponent(search)}` : "";
        const results = await fanOut("admin-free-embeds", qs);
        const allEmbeds: any[] = [];
        for (const r of results) {
          if (r.data?.embeds) {
            for (const e of r.data.embeds) {
              allEmbeds.push({ ...e, product_key: r.product_key, product_name: r.name });
            }
          }
        }
        const filtered = productFilter
          ? allEmbeds.filter((e) => e.product_key === productFilter)
          : allEmbeds;
        return json({ embeds: filtered, total: filtered.length });
      }

      case "pro-assets": {
        const qs = search ? `search=${encodeURIComponent(search)}` : "";
        const results = await fanOut("admin-pro-assets", qs);
        const allAssets: any[] = [];
        for (const r of results) {
          if (r.data?.assets) {
            for (const a of r.data.assets) {
              allAssets.push({ ...a, product_key: r.product_key, product_name: r.name });
            }
          }
        }
        const filtered = productFilter
          ? allAssets.filter((a) => a.product_key === productFilter)
          : allAssets;
        return json({ assets: filtered, total: filtered.length });
      }

      case "users": {
        const qs = search ? `search=${encodeURIComponent(search)}` : "";
        const results = await fanOut("admin-users", qs);
        const allUsers: any[] = [];
        for (const r of results) {
          if (r.data?.users) {
            for (const u of r.data.users) {
              allUsers.push({ ...u, product_key: r.product_key, product_name: r.name });
            }
          }
        }
        const filtered = productFilter
          ? allUsers.filter((u) => u.product_key === productFilter)
          : allUsers;
        return json({ users: filtered, total: filtered.length });
      }

      default:
        return json({ error: "Not found", available: ["overview", "free-embeds", "pro-assets", "users"] }, 404);
    }
  } catch (err) {
    console.error("admin-control error:", err);
    return json({ error: "Internal server error" }, 500);
  }
});
