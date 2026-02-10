import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Play } from "lucide-react";

export function FreeTierFreeEmbed() {
  const navigate = useNavigate();

  return (
    <Card className="border-amber-500/20 bg-gradient-to-br from-amber-900/10 to-amber-800/5">
      <CardContent className="p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <Video className="h-7 w-7 text-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Free Embed</h2>
            <p className="text-muted-foreground">Embed videos from any platform</p>
          </div>
        </div>

        <p className="text-muted-foreground mb-8 max-w-2xl">
          Create up to 100 video assets by embedding URLs from YouTube, Vimeo, and other
          platforms. Organize your content into channels and playlists with our easy-to-use
          dashboard.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="font-semibold text-foreground mb-4">Features Included:</h4>
            <ul className="space-y-3">
              {["100 video assets", "Channel organization", "10 AI-generated images per month", "Playlist support"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Supported Platforms:</h4>
            <ul className="space-y-3">
              {["YouTube, Vimeo, Dailymotion", "Spotify, SoundCloud", "Direct audio/video URLs"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Button
          className="gap-2 bg-amber-600 hover:bg-amber-700 text-white"
          onClick={() => navigate("/free/embeds")}
        >
          <Play className="h-4 w-4" />
          Launch Free Embed
        </Button>
      </CardContent>
    </Card>
  );
}
