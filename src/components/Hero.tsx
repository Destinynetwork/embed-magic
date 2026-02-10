import { ArrowRight, Play, ShoppingCart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center pt-20 pb-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/8 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      {/* Subtle top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8 animate-fade-in">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-sm text-primary font-medium">
              Universal Media Embedding
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-sm text-primary font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              7-Day Free Trial
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <span className="text-gradient">EMBED Pro</span>
          </h1>

          {/* Pricing */}
          <p className="text-muted-foreground text-lg mb-6 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            R299/month after trial • No card required
          </p>

          {/* Description */}
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Embed videos, audio, documents, and images from any platform. AI-powered
            thumbnails, content protection, and professional player customization—all in one
            dashboard.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Button variant="hero" size="xl" onClick={() => navigate("/pricing")}>
              <ShoppingCart className="w-5 h-5" />
              Buy Now
            </Button>
            <Button variant="hero-outline" size="xl" onClick={() => navigate("/signin")}>
              Sign In
            </Button>
            <Button variant="hero-outline" size="xl" onClick={() => navigate("/signup")}>
              Sign Up
            </Button>
            <button
              onClick={() => navigate("/demo")}
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
            >
              <Play className="w-4 h-4" />
              Try Demo
            </button>
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </section>
  );
};

export default Hero;
