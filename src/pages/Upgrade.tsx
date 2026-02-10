import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, ArrowLeft, Sparkles } from "lucide-react";
import { hasProEntitlement, type AuthUser } from "@/lib/auth-helpers";

const FREE_FEATURES = [
  "Paste embed URLs from 13+ providers",
  "Sanitised & safe iframe embeds",
  "Manage your embed library",
  "Preview embeds inline",
  "Basic embed management",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Managed video hosting (Gumlet / Adilo CDN)",
  "Content protection & DRM",
  "Advanced analytics dashboard",
  "Channel & playlist management",
  "Live streaming studio",
  "Events & ticketing system",
  "Business hub with products & orders",
  "AI-powered thumbnails",
  "Multi-platform distribution",
  "Priority support",
];

export default function Upgrade() {
  const navigate = useNavigate();
  const { profile, user, isDemoMode } = useAuth();

  const authUser: AuthUser | null = profile ? {
    id: profile.id,
    authUserId: user?.id || "",
    email: profile.email,
    plan: profile.plan,
    subscriptionTier: profile.subscription_tier,
    isCreator: profile.is_creator || false,
    fullName: profile.full_name,
    username: profile.username,
  } : null;

  const isPro = authUser ? hasProEntitlement(authUser) : isDemoMode;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">
            Choose Your Plan
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Start free with basic embeds, or upgrade to Pro for full managed video hosting with CDN, analytics, and monetisation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>User-provided embeds</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">R0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {FREE_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="w-full mt-6"
                onClick={() => navigate("/free")}
              >
                {isPro ? "Visit Free Hub" : "Current Plan"}
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="relative border-amber-500/50 shadow-lg shadow-amber-500/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1">
                <Sparkles className="h-3 w-3 mr-1" />
                Recommended
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Crown className="h-6 w-6 text-amber-400" />
                Embed Pro
              </CardTitle>
              <CardDescription>Managed video hosting + full suite</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">R299</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {PRO_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full mt-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                onClick={() => {
                  if (isPro) {
                    navigate("/pro");
                  } else {
                    navigate("/pricing");
                  }
                }}
              >
                {isPro ? "Go to Pro Dashboard" : "Upgrade to Pro"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
