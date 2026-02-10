import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// PayFast whitelisted IP range: 197.97.145.144/28 (197.97.145.144 - 197.97.145.159)
const PAYFAST_IP_START = 197 * 256 ** 3 + 97 * 256 ** 2 + 145 * 256 + 144;
const PAYFAST_IP_END = PAYFAST_IP_START + 15;

function ipToNumber(ip: string): number {
  const parts = ip.split(".").map(Number);
  return parts[0] * 256 ** 3 + parts[1] * 256 ** 2 + parts[2] * 256 + parts[3];
}

function isPayFastIP(ip: string): boolean {
  if (!ip) return false;
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

serve(async (req) => {
  // Only accept POST
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const clientIP = getClientIP(req);
  console.log(`PayFast ITN received from IP: ${clientIP}`);

  // Validate IP is from PayFast's whitelisted range
  if (!isPayFastIP(clientIP)) {
    console.error(`Rejected ITN from non-PayFast IP: ${clientIP}`);
    return new Response("Forbidden", { status: 403 });
  }

  try {
    // Parse the URL-encoded form data from PayFast
    const body = await req.text();
    const params = new URLSearchParams(body);
    const data: Record<string, string> = {};
    for (const [key, value] of params.entries()) {
      data[key] = value;
    }

    console.log("PayFast ITN data:", JSON.stringify({
      m_payment_id: data.m_payment_id,
      pf_payment_id: data.pf_payment_id,
      payment_status: data.payment_status,
      amount_gross: data.amount_gross,
      email_address: data.email_address,
    }));

    const paymentStatus = data.payment_status;
    const email = data.email_address;

    if (!email) {
      console.error("No email in ITN data");
      return new Response("OK", { status: 200 });
    }

    // Initialize Supabase admin client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase credentials");
      return new Response("OK", { status: 200 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (paymentStatus === "COMPLETE") {
      // Update user's profile to pro/embed_pro
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .update({
          plan: "embed_pro",
          subscription_tier: "pro",
          updated_at: new Date().toISOString(),
        })
        .eq("email", email);

      if (profileError) {
        console.error("Error updating profile:", profileError);
      } else {
        console.log(`Successfully upgraded user ${email} to embed_pro`);
      }
    } else {
      console.log(`Payment status for ${email}: ${paymentStatus}`);
    }

    // PayFast expects a 200 OK response
    return new Response("OK", { status: 200 });
  } catch (error: any) {
    console.error("PayFast ITN error:", error.message);
    return new Response("OK", { status: 200 });
  }
});
