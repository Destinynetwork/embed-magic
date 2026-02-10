import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Code2, LogOut, BarChart3, Layers, Shield, Settings, Sparkles, Radio, Plus, Copy, Check } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const embedCode = `<script src="https://cdn.embedpro.io/v1/embed.js"></script>
<embed-pro
  type="video"
  src="https://youtube.com/watch?v=example"
  theme="dark"
  protection="watermark"
/>`;

const stats = [
  { label: "Total Embeds", value: "0", icon: Layers },
  { label: "Views This Month", value: "0", icon: BarChart3 },
  { label: "Protected Assets", value: "0", icon: Shield },
  { label: "Live Streams", value: "0", icon: Radio },
];

const quickActions = [
  { label: "Create Embed", icon: Plus, description: "Embed video, audio, or documents" },
  { label: "AI Thumbnails", icon: Sparkles, description: "Generate thumbnails with AI" },
  { label: "Player Settings", icon: Settings, description: "Customize player appearance" },
  { label: "Content Protection", icon: Shield, description: "Set up watermarks & domain locking" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        navigate("/signin");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate("/signin");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Code2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">
              Embed<span className="text-gradient">Pro</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">
            Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}
          </h1>
          <p className="text-muted-foreground">Manage your embeds, analytics, and settings.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-5 border-gradient">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  className="glass rounded-xl p-5 border-gradient text-left hover:border-primary/30 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <action.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-medium text-sm mb-1">{action.label}</h3>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Embed Code */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Embed Code</h2>
            <div className="glass rounded-xl border-gradient overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                <span className="text-sm text-muted-foreground font-mono">embed-snippet.html</span>
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <pre className="p-4 text-sm font-mono text-muted-foreground overflow-x-auto">
                <code>{embedCode}</code>
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
