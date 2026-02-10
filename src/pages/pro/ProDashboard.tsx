import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, ListVideo, BarChart3, ArrowLeft, Crown } from "lucide-react";

export default function ProDashboard() {
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
          <Button variant="ghost" onClick={() => navigate("/embed-pro-hub")}>
            My Hub
          </Button>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown className="h-6 w-6 text-amber-400" />
              <h1 className="text-3xl font-bold">Pro Managed Videos</h1>
            </div>
            <p className="text-muted-foreground mt-1">
              Upload and manage video assets with Gumlet/Adilo CDN hosting
            </p>
          </div>
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-sm px-3 py-1">
            Pro Plan
          </Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card
            className="cursor-pointer border-primary/30 hover:border-primary/60 transition-colors"
            onClick={() => navigate("/pro/upload")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Upload Video
              </CardTitle>
              <CardDescription>
                Upload a new managed video to Gumlet or Adilo CDN
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer hover:border-muted-foreground/30 transition-colors"
            onClick={() => navigate("/pro/assets")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListVideo className="h-5 w-5 text-muted-foreground" />
                My Assets
              </CardTitle>
              <CardDescription>
                View and manage your managed video assets
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer hover:border-muted-foreground/30 transition-colors"
            onClick={() => navigate("/embed-pro-hub")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
                Analytics & Hub
              </CardTitle>
              <CardDescription>
                Full dashboard with analytics, channels, events, and more
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
