import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { crypto } from "https://deno.land/std@0.190.0/crypto/mod.ts";
import { encodeHex } from "https://deno.land/std@0.190.0/encoding/hex.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// PayFast whitelisted IP range: 197.97.145.144/28 (197.97.145.144 - 197.97.145.159)
const PAYFAST_IP_START = 197 * 256 ** 3 + 97 * 256 ** 2 + 145 * 256 + 144; // 197.97.145.144
const PAYFAST_IP_END = PAYFAST_IP_START + 15; // 197.97.145.159

function ipToNumber(ip: string): number {
  const parts = ip.split(".").map(Number);
  return parts[0] * 256 ** 3 + parts[1] * 256 ** 2 + parts[2] * 256 + parts[3];
}

function isPayFastIP(ip: string): boolean {
  const num = ipToNumber(ip);
  return num >= PAYFAST_IP_START && num <= PAYFAST_IP_END;
}

function getClientIP(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    ""
  );
}

async function generateSignature(data: Record<string, string>, passphrase: string): Promise<string> {
  // Build param string: sort keys, exclude empty values, URL-encode values with + for spaces
  const params = Object.keys(data)
    .filter((key) => data[key] !== "")
    .sort()
    .map((key) => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, "+")}`)
    .join("&");

  const withPassphrase = passphrase
    ? `${params}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}`
    : params;

  const encoder = new TextEncoder();
  const digest = await crypto.subtle.digest("MD5", encoder.encode(withPassphrase));
  return encodeHex(new Uint8Array(digest));
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const MERCHANT_ID = Deno.env.get("PAYFAST_MERCHANT_ID");
    if (!MERCHANT_ID) throw new Error("PAYFAST_MERCHANT_ID is not configured");

    const MERCHANT_KEY = Deno.env.get("PAYFAST_MERCHANT_KEY");
    if (!MERCHANT_KEY) throw new Error("PAYFAST_MERCHANT_KEY is not configured");

    const PASSPHRASE = Deno.env.get("PAYFAST_PASSPHRASE") || "";

    const { email, name_first, name_last, return_url, cancel_url, notify_url } = await req.json();

    if (!email) throw new Error("Email is required");

    const paymentData: Record<string, string> = {
      merchant_id: MERCHANT_ID,
      merchant_key: MERCHANT_KEY,
      return_url: return_url || `${req.headers.get("origin")}/pricing?status=success`,
      cancel_url: cancel_url || `${req.headers.get("origin")}/pricing?status=cancelled`,
      notify_url: notify_url || "",
      name_first: name_first || "",
      name_last: name_last || "",
      email_address: email,
      m_payment_id: crypto.randomUUID(),
      amount: "299.00",
      item_name: "EMBED Pro - Monthly Subscription",
      item_description: "EMBED Pro monthly subscription with 7-day free trial",
      subscription_type: "1",
      billing_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      recurring_amount: "299.00",
      frequency: "3", // Monthly
      cycles: "0", // Indefinite
    };

    // Remove empty values before signing
    const cleanData: Record<string, string> = {};
    for (const [key, value] of Object.entries(paymentData)) {
      if (value !== "") cleanData[key] = value;
    }

    const signature = await generateSignature(cleanData, PASSPHRASE);
    cleanData.signature = signature;

    const payfastUrl = "https://www.payfast.co.za/eng/process";

    return new Response(
      JSON.stringify({
        payfast_url: payfastUrl,
        payment_data: cleanData,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("PayFast error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
