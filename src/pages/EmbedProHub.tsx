import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { EmbedProMyHub } from "@/components/embed/hub/EmbedProMyHub";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User } from "lucide-react";

export default function EmbedProHub() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Please log in to access Embed Hub</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" onClick={() => navigate('/embed-pro')}>
            <ArrowLeft className="h-4 w-4 mr-2" />Back to Embed Pro
          </Button>
          <Button variant="outline" onClick={() => navigate('/profile')}>
            <User className="h-4 w-4 mr-2" />Profile
          </Button>
        </div>
        <EmbedProMyHub profileId={profile.id} />
      </div>
    </div>
  );
}
