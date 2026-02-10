import { Code2, Menu, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-subtle">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left: Back or Logo */}
          <div className="flex items-center gap-3">
            {!isHome && (
              <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Code2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Embed<span className="text-gradient">Pro</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </button>
            <button onClick={() => { if (isHome) document.getElementById("features")?.scrollIntoView({ behavior: "smooth" }); else navigate("/"); }} className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </button>
            <button onClick={() => navigate("/demo")} className="text-muted-foreground hover:text-foreground transition-colors">
              Demo
            </button>
            <button onClick={() => navigate("/pricing")} className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </button>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/signin")}>
              Sign In
            </Button>
            <Button variant="hero" size="sm" onClick={() => navigate("/pricing")}>
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-4">
              <button onClick={() => { navigate("/"); setIsMenuOpen(false); }} className="text-left text-muted-foreground hover:text-foreground transition-colors">
                Home
              </button>
              <button onClick={() => { navigate("/demo"); setIsMenuOpen(false); }} className="text-left text-muted-foreground hover:text-foreground transition-colors">
                Demo
              </button>
              <button onClick={() => { navigate("/pricing"); setIsMenuOpen(false); }} className="text-left text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </button>
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Button variant="ghost" size="sm" onClick={() => { navigate("/signin"); setIsMenuOpen(false); }}>
                  Sign In
                </Button>
                <Button variant="hero" size="sm" onClick={() => { navigate("/pricing"); setIsMenuOpen(false); }}>
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
