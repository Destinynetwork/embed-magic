import { supabase } from "@/integrations/supabase/client";

const FUNCTION_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-control`;

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  if (token) {
    return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  }
  return { "Content-Type": "application/json" };
}

async function controlFetch(endpoint: string, params?: Record<string, string>) {
  const headers = await getAuthHeaders();
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  const res = await fetch(`${FUNCTION_BASE}/${endpoint}${qs}`, { headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Admin API error ${res.status}: ${text}`);
  }
  return res.json();
}

export const adminApi = {
  overview: () => controlFetch("overview"),
  freeEmbeds: (product?: string, search?: string) => {
    const p: Record<string, string> = {};
    if (product) p.product = product;
    if (search) p.search = search;
    return controlFetch("free-embeds", Object.keys(p).length ? p : undefined);
  },
  proAssets: (product?: string, search?: string) => {
    const p: Record<string, string> = {};
    if (product) p.product = product;
    if (search) p.search = search;
    return controlFetch("pro-assets", Object.keys(p).length ? p : undefined);
  },
  users: (product?: string, search?: string) => {
    const p: Record<string, string> = {};
    if (product) p.product = product;
    if (search) p.search = search;
    return controlFetch("users", Object.keys(p).length ? p : undefined);
  },
};
