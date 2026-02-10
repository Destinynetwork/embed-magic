import { Layers, Sparkles, Shield, Settings, Radio, BarChart3 } from "lucide-react";

import featureMultiplatform from "@/assets/feature-multiplatform.jpg";
import featureAiThumbnails from "@/assets/feature-ai-thumbnails.jpg";
import featureProtection from "@/assets/feature-protection.jpg";
import featureCustomization from "@/assets/feature-customization.jpg";
import featureLivestream from "@/assets/feature-livestream.jpg";
import featureAnalytics from "@/assets/feature-analytics.jpg";

const features = [
  {
    icon: Layers,
    title: "Multi-Platform Support",
    description: "Embed from YouTube, Vimeo, Wistia, Dailymotion, Spotify, and more.",
    image: featureMultiplatform,
  },
  {
    icon: Sparkles,
    title: "AI Thumbnail Generator",
    description: "Create stunning thumbnails with AI—just describe what you want.",
    image: featureAiThumbnails,
  },
  {
    icon: Shield,
    title: "Content Protection",
    description: "Watermarks, password protection, and domain locking.",
    image: featureProtection,
  },
  {
    icon: Settings,
    title: "Player Customization",
    description: "Custom skins, colors, controls, and branding for your player.",
    image: featureCustomization,
  },
  {
    icon: Radio,
    title: "Live Streaming",
    description: "Stream live content with real-time viewer analytics.",
    image: featureLivestream,
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track views, engagement, and performance metrics in real-time.",
    image: featureAnalytics,
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need for Professional Embedding
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl overflow-hidden glass border-gradient hover:border-primary/30 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-5 relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
