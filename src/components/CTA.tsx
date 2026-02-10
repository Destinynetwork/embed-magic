import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CTA = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="glass rounded-3xl p-8 sm:p-12 lg:p-16 border-gradient text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <span className="text-sm text-primary font-medium">Free forever for small projects</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Ready to <span className="text-gradient">embed like a pro?</span>
          </h2>

          {/* Subheadline */}
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of developers who trust EmbedPro for their embedding needs. 
            Get started in seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" onClick={() => navigate("/pricing")}>
              Start building for free
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="hero-outline" size="xl" onClick={() => navigate("/signin")}>
              Talk to sales
            </Button>
          </div>

          {/* Trust indicators */}
          <p className="mt-8 text-sm text-muted-foreground">
            No credit card required • 5-minute setup • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
