import { Check, Sparkles, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

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
              <Button variant="hero" size="xl" onClick={() => navigate("/signin")}>
                <ShoppingCart className="w-5 h-5" />
                Start 7-Day Free Trial
              </Button>
              <Button variant="hero-outline" size="xl" onClick={() => navigate("/demo")}>
                Try Demo First
              </Button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Cancel anytime • No commitment • Full access during trial
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
