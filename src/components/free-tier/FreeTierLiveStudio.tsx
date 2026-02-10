import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, Wifi, Copy, ExternalLink, QrCode, Users } from "lucide-react";
import { toast } from "sonner";

export function FreeTierLiveStudio() {
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isCreated, setIsCreated] = useState(false);

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 14);
  };

  const handleCreateRoom = () => {
    if (!roomName.trim()) {
      toast.error("Please enter a room name");
      return;
    }
    const newId = generateRoomId();
    setRoomId(newId);
    setIsCreated(true);
    toast.success("Room created successfully!");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const guestLinks = Array.from({ length: 10 }, (_, i) =>
    `https://vdo.ninja/?room=${roomId}&push&label=Guest${i + 1}`
  );

  const hostLink = `https://vdo.ninja/?room=${roomId}&push&label=Host`;
  const audienceLink = `https://vdo.ninja/?room=${roomId}&scene`;
  const embedCode = `<iframe src="https://vdo.ninja/?room=${roomId}&scene" width="100%" height="480" frameborder="0" allowfullscreen></iframe>`;

  return (
    <Tabs defaultValue="free-streaming" className="space-y-6">
      <TabsList className="bg-card/50">
        <TabsTrigger value="free-streaming" className="gap-2">
          <Link className="h-4 w-4" />
          Free Streaming
        </TabsTrigger>
        <TabsTrigger value="how-it-works" className="gap-2">
          How It Works
        </TabsTrigger>
        <TabsTrigger value="platform-info" className="gap-2">
          Platform Info
        </TabsTrigger>
      </TabsList>

      <TabsContent value="free-streaming">
        {!isCreated ? (
          <Card className="border-border/50">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-2">
                <Wifi className="h-5 w-5 text-red-400" />
                <h3 className="text-xl font-bold">Create Live Room</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Set up a room for your live stream with up to 10 guests
              </p>

              <div className="max-w-md space-y-4">
                <div>
                  <Label>Room Name *</Label>
                  <Input
                    placeholder="e.g., Weekly Podcast, Live Q&A"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={handleCreateRoom}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold gap-2"
                >
                  <Wifi className="h-4 w-4" />
                  Create Room
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Room Info Banner */}
            <Card className="border-cyan-500/20 bg-gradient-to-r from-cyan-900/10 to-cyan-800/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Link className="h-4 w-4 text-cyan-400" />
                      <h3 className="font-bold">Free Streaming - Invite 10 Guests</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Share links with co-hosts or guests. Perfect for podcasts, interviews, and panel discussions.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                      <Users className="h-3 w-3 mr-1" />
                      Up to 10 Guests
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 border-red-500/50 text-red-400"
                      onClick={() => {
                        setIsCreated(false);
                        setRoomId("");
                        setRoomName("");
                      }}
                    >
                      <Wifi className="h-3 w-3" />
                      New Room
                    </Button>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-xs text-muted-foreground">Room ID</span>
                  <p className="text-lg font-mono font-bold text-red-400">{roomId}</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Guest Invite Links */}
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h4 className="font-bold text-foreground mb-1 flex items-center gap-2">
                    <Users className="h-4 w-4 text-cyan-400" />
                    Guest Invite Links (10 Slots)
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Share these links with co-hosts or guests. Each can join via mobile or desktop browser.
                  </p>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {guestLinks.map((link, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Badge variant="outline" className="text-red-400 border-red-500/40 text-xs whitespace-nowrap">
                          Guest {i + 1}
                        </Badge>
                        <Input value={link} readOnly className="text-xs font-mono h-8" />
                        <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={() => copyToClipboard(link)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                        <a href={link} target="_blank" rel="noopener noreferrer">
                          <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </a>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 gap-2 text-red-400 border-red-500/40">
                    <QrCode className="h-4 w-4" />
                    Show QR Code for Guests
                  </Button>
                </CardContent>
              </Card>

              {/* Audience Link */}
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h4 className="font-bold text-foreground mb-1 flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-cyan-400" />
                    Live Audience Link
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Share this link with your audience or embed on your website.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs">Your Broadcast Link (Host)</Label>
                      <div className="flex gap-2 mt-1">
                        <Input value={hostLink} readOnly className="text-xs font-mono" />
                        <Button size="sm" className="gap-1 bg-cyan-600 hover:bg-cyan-700 shrink-0" onClick={() => copyToClipboard(hostLink)}>
                          <Copy className="h-3 w-3" /> Copy
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Open this to start broadcasting</p>
                    </div>

                    <div>
                      <Label className="text-xs">Audience Viewer URL</Label>
                      <div className="flex gap-2 mt-1">
                        <Input value={audienceLink} readOnly className="text-xs font-mono" />
                        <Button size="sm" className="gap-1 bg-cyan-600 hover:bg-cyan-700 shrink-0" onClick={() => copyToClipboard(audienceLink)}>
                          <Copy className="h-3 w-3" /> Copy
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">Embed Code (for websites)</Label>
                      <div className="flex gap-2 mt-1">
                        <Input value={embedCode} readOnly className="text-xs font-mono" />
                        <Button size="sm" className="gap-1 bg-cyan-600 hover:bg-cyan-700 shrink-0" onClick={() => copyToClipboard(embedCode)}>
                          <Copy className="h-3 w-3" /> Copy
                        </Button>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full gap-2 text-cyan-400 border-cyan-500/40">
                      <QrCode className="h-4 w-4" />
                      Show QR Code for Audience
                    </Button>
                    <Button variant="outline" className="w-full gap-2 border-cyan-500/40">
                      <ExternalLink className="h-4 w-4" />
                      Preview Audience View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </TabsContent>

      <TabsContent value="how-it-works">
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <h3 className="text-xl font-bold text-foreground mb-4">How It Works</h3>
            <p>Create a room, share guest links, and start broadcasting for free using VDO.Ninja + OBS.</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="platform-info">
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <h3 className="text-xl font-bold text-foreground mb-4">Platform Info</h3>
            <p>Powered by VDO.Ninja — peer-to-peer, zero-cost, zero-latency live streaming technology.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
