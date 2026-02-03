import { useState } from "react";
import { MessageSquare, Bell, HelpCircle, Star } from "lucide-react";

const widgetTypes = [
  { id: "chat", icon: MessageSquare, label: "Chat Widget", color: "from-cyan-500 to-blue-500" },
  { id: "notification", icon: Bell, label: "Notifications", color: "from-orange-500 to-red-500" },
  { id: "feedback", icon: Star, label: "Feedback", color: "from-yellow-500 to-orange-500" },
  { id: "support", icon: HelpCircle, label: "Help Center", color: "from-green-500 to-teal-500" },
];

const Demo = () => {
  const [activeWidget, setActiveWidget] = useState("chat");
  const [position, setPosition] = useState<"bottom-right" | "bottom-left">("bottom-right");

  const activeWidgetData = widgetTypes.find((w) => w.id === activeWidget);

  return (
    <section id="demo" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            See it in <span className="text-gradient">action</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Customize your widget in real-time. What you see is what you get.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Controls */}
          <div className="space-y-8">
            {/* Widget Type */}
            <div>
              <label className="block text-sm font-medium mb-3">Widget Type</label>
              <div className="grid grid-cols-2 gap-3">
                {widgetTypes.map((widget) => (
                  <button
                    key={widget.id}
                    onClick={() => setActiveWidget(widget.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
                      activeWidget === widget.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 glass"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${widget.color} flex items-center justify-center`}>
                      <widget.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium">{widget.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium mb-3">Position</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setPosition("bottom-left")}
                  className={`flex-1 p-3 rounded-xl border transition-all duration-200 ${
                    position === "bottom-left"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-sm">Bottom Left</span>
                </button>
                <button
                  onClick={() => setPosition("bottom-right")}
                  className={`flex-1 p-3 rounded-xl border transition-all duration-200 ${
                    position === "bottom-right"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-sm">Bottom Right</span>
                </button>
              </div>
            </div>

            {/* Generated Code */}
            <div>
              <label className="block text-sm font-medium mb-3">Generated Code</label>
              <div className="glass rounded-xl p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-muted-foreground">
                  <span className="text-primary">&lt;embed-pro</span>
                  {"\n"}
                  {"  "}type=<span className="text-green-400">"{activeWidget}"</span>
                  {"\n"}
                  {"  "}position=<span className="text-green-400">"{position}"</span>
                  {"\n"}
                  <span className="text-primary">/&gt;</span>
                </pre>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="relative">
            <div className="glass rounded-2xl border-gradient overflow-hidden">
              {/* Browser Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-secondary/30">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-background/50 rounded-lg px-4 py-1.5 text-xs text-muted-foreground text-center">
                    yourwebsite.com
                  </div>
                </div>
              </div>

              {/* Page Content */}
              <div className="relative h-[400px] bg-gradient-to-br from-background to-secondary/20 p-8">
                {/* Placeholder content */}
                <div className="space-y-4">
                  <div className="h-8 w-48 bg-muted/30 rounded-lg" />
                  <div className="h-4 w-full bg-muted/20 rounded" />
                  <div className="h-4 w-3/4 bg-muted/20 rounded" />
                  <div className="h-4 w-5/6 bg-muted/20 rounded" />
                  <div className="h-32 w-full bg-muted/10 rounded-xl mt-8" />
                </div>

                {/* Widget */}
                <div
                  className={`absolute bottom-6 transition-all duration-500 ${
                    position === "bottom-right" ? "right-6" : "left-6"
                  }`}
                >
                  <div 
                    className={`w-14 h-14 rounded-full bg-gradient-to-br ${activeWidgetData?.color} flex items-center justify-center shadow-2xl animate-float cursor-pointer hover:scale-110 transition-transform`}
                  >
                    {activeWidgetData && <activeWidgetData.icon className="w-7 h-7 text-white" />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
