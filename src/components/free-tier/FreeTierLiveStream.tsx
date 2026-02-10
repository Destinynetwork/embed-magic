import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wifi, Play } from "lucide-react";

export function FreeTierLiveStream() {
  return (
    <Card className="border-red-500/20 bg-gradient-to-br from-red-900/10 to-red-800/5">
      <CardContent className="p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-red-500/20 flex items-center justify-center">
            <Wifi className="h-7 w-7 text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Live Stream</h2>
            <p className="text-muted-foreground">Stream live to any platform</p>
          </div>
        </div>

        <p className="text-muted-foreground mb-8 max-w-2xl">
          Stream live to YouTube, Twitch, Facebook, TikTok and more using OBS. Invite up to 10 guests
          per room for collaborative broadcasts.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="font-semibold text-foreground mb-4">Features Included:</h4>
            <ul className="space-y-3">
              {["Free live streaming", "Up to 10 guests per room", "OBS integration", "No storage needed"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Supported Destinations:</h4>
            <ul className="space-y-3">
              {["YouTube Live", "Twitch, Facebook Live", "TikTok Live, Custom RTMP"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Button className="gap-2 bg-red-600 hover:bg-red-700 text-white">
          <Play className="h-4 w-4" />
          Launch Live Stream
        </Button>
      </CardContent>
    </Card>
  );
}
