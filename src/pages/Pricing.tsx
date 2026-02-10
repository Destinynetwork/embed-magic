import { Check, Sparkles, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const features = [
  "Unlimited embeds",
  "All platform support (YouTube, Vimeo, Spotify, etc.)",
  "AI Thumbnail Generator",
  "Content protection & watermarks",
  "Custom player skins & branding",
  "Live streaming support",
  "Analytics dashboard",
  "Domain locking",
  "Priority support",
];

const Pricing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "success") {
      toast({ title: "Payment successful!", description: "Welcome to EMBED Pro." });
    } else if (status === "cancelled") {
      toast({ title: "Payment cancelled", description: "You can try again anytime.", variant: "destructive" });
    }
  }, [searchParams]);

  const handleBuyNow = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate("/signin");
        return;
      }

      const { data, error } = await supabase.functions.invoke("create-payfast-payment", {
        body: {
          email: user.email,
          return_url: `${window.location.origin}/pricing?status=success`,
          cancel_url: `${window.location.origin}/pricing?status=cancelled`,
        },
      });

      if (error) throw error;

      // Create a form and submit it to PayFast
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.payfast_url;

      for (const [key, value] of Object.entries(data.payment_data)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-sm text-primary font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              7-Day Free Trial
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
              <span className="text-gradient">EMBED Pro</span>
            </h1>

            <div className="mb-4">
              <span className="text-5xl font-extrabold text-foreground">R299</span>
              <span className="text-muted-foreground text-lg">/month</span>
            </div>
            <p className="text-muted-foreground mb-10">No card required to start your free trial</p>

            {/* Features */}
            <div className="glass rounded-2xl p-8 border-gradient text-left mb-10">
              <h3 className="font-semibold mb-4 text-lg">Everything included:</h3>
              <ul className="space-y-3">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" onClick={handleBuyNow} disabled={loading}>
                <ShoppingCart className="w-5 h-5" />
                {loading ? "Processing..." : "Start 7-Day Free Trial"}
              </Button>
              <Button variant="hero-outline" size="xl" onClick={() => navigate("/demo")}>
                Try Demo First
              </Button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Powered by PayFast • Cancel anytime • Full access during trial
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
