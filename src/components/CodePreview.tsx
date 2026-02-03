import { useState } from "react";
import { Check, Copy } from "lucide-react";

const CodePreview = () => {
  const [copied, setCopied] = useState(false);

  const codeSnippet = `<script src="https://embed.pro/v1.js"></script>
<embed-pro 
  id="your-widget-id"
  theme="dark"
  position="bottom-right"
/>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      {/* Glow Effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Main Card */}
      <div className="relative glass rounded-2xl overflow-hidden border-gradient animate-glow">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="text-xs text-muted-foreground font-mono">embed.html</div>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md hover:bg-secondary transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Code Content */}
        <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
          <pre className="text-muted-foreground">
            <code>
              <span className="text-primary">&lt;script</span>
              <span className="text-foreground"> src</span>
              <span className="text-muted-foreground">=</span>
              <span className="text-green-400">"https://embed.pro/v1.js"</span>
              <span className="text-primary">&gt;&lt;/script&gt;</span>
              {"\n"}
              <span className="text-primary">&lt;embed-pro</span>
              {"\n"}
              {"  "}
              <span className="text-foreground">id</span>
              <span className="text-muted-foreground">=</span>
              <span className="text-green-400">"your-widget-id"</span>
              {"\n"}
              {"  "}
              <span className="text-foreground">theme</span>
              <span className="text-muted-foreground">=</span>
              <span className="text-green-400">"dark"</span>
              {"\n"}
              {"  "}
              <span className="text-foreground">position</span>
              <span className="text-muted-foreground">=</span>
              <span className="text-green-400">"bottom-right"</span>
              {"\n"}
              <span className="text-primary">/&gt;</span>
            </code>
          </pre>
        </div>

        {/* Preview */}
        <div className="border-t border-border/50 p-6 bg-secondary/30">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Live Preview</span>
            <span className="inline-flex items-center gap-1.5 text-xs text-green-500">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Active
            </span>
          </div>
          
          {/* Widget Preview */}
          <div className="relative bg-background/50 rounded-xl p-4 min-h-[120px]">
            <div className="absolute bottom-4 right-4">
              <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/30 animate-float">
                <svg className="w-7 h-7 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Your widget appears here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePreview;
