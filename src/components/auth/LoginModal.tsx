import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { logAuthEvent } from "@/lib/platform/auth-logger";

interface LoginModalProps {
  size?: "default" | "sm";
}

export function LoginModal({ size = "default" }: LoginModalProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user, signOut, isDemoMode } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        logAuthEvent("failed_login", null, { email, error: error.message });
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been logged in successfully.",
        });
        setOpen(false);
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been logged out.",
    });
    setOpen(false);
  };


  // If user is logged in or in demo mode, show sign out button
  if (user || isDemoMode) {
    return (
      <Button
        variant="outline"
        size={size === "sm" ? "sm" : "default"}
        onClick={handleSignOut}
        className="gap-1.5 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
      >
        <LogIn className={cn("h-4 w-4", size === "sm" && "h-3.5 w-3.5")} />
        <span className={cn(size === "sm" && "hidden sm:inline")}>Sign Out</span>
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size={size === "sm" ? "sm" : "default"}
          className="gap-1.5 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
        >
          <LogIn className={cn("h-4 w-4", size === "sm" && "h-3.5 w-3.5")} />
          <span className={cn(size === "sm" && "hidden sm:inline")}>Sign In</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription>
            Enter your credentials to access your account
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a
                href="/auth"
                className="text-sm text-primary hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  window.location.href = '/auth';
                }}
              >
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
