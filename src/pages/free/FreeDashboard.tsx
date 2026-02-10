import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ListVideo, Sparkles, ArrowLeft } from "lucide-react";

export default function FreeDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Home
          </Button>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Free Embed Hub</h1>
            <p className="text-muted-foreground mt-1">
              Paste any embed URL or code to display content on your site
            </p>
          </div>
          <Badge variant="secondary" className="text-sm px-3 py-1">Free Plan</Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card
            className="cursor-pointer border-primary/30 hover:border-primary/60 transition-colors"
            onClick={() => navigate("/free/add")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Add New Embed
              </CardTitle>
              <CardDescription>
                Paste a URL or embed code from YouTube, Vimeo, Twitch, and more
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer hover:border-muted-foreground/30 transition-colors"
            onClick={() => navigate("/free/embeds")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListVideo className="h-5 w-5 text-muted-foreground" />
                My Embeds
              </CardTitle>
              <CardDescription>
                View, preview, and manage your saved embeds
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Upgrade CTA */}
        <Card className="border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-orange-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                  <h3 className="text-lg font-semibold">Upgrade to Embed Pro</h3>
                </div>
                <p className="text-muted-foreground text-sm max-w-lg">
                  Get managed video hosting with Gumlet/Adilo CDN, analytics, content protection,
                  monetisation tools, and more.
                </p>
              </div>
              <Button
                onClick={() => navigate("/upgrade")}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
