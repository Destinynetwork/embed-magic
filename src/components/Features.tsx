import { Palette, Zap, BarChart3, Globe, Lock, Puzzle } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Loads in under 50ms. Zero impact on your site's performance.",
  },
  {
    icon: Palette,
    title: "Fully Customizable",
    description: "Match your brand perfectly with themes, colors, and custom CSS.",
  },
  {
    icon: BarChart3,
    title: "Built-in Analytics",
    description: "Track impressions, clicks, and conversions in real-time.",
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    description: "Compatible with any website, CMS, or framework.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "GDPR compliant. No cookies. Your data stays yours.",
  },
  {
    icon: Puzzle,
    title: "Easy Integration",
    description: "One line of code. No dependencies. No build step required.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything you need to{" "}
            <span className="text-gradient">embed like a pro</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed for developers who care about user experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl glass border-gradient hover:border-primary/30 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-gradient-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
