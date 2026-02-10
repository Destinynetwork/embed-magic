import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Tv, Video, Tag, FileText, Settings } from "lucide-react";

interface EmbedProBusinessHubSectionProps {
  profileId: string;
  onBack: () => void;
}

export function EmbedProBusinessHubSection({ profileId, onBack }: EmbedProBusinessHubSectionProps) {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto gap-1 bg-card/50 p-1">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Dashboard</TabsTrigger>
          <TabsTrigger value="channels" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Channels</TabsTrigger>
          <TabsTrigger value="content" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Content</TabsTrigger>
          <TabsTrigger value="discounts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Discounts</TabsTrigger>
          <TabsTrigger value="policies" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Policies</TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6 text-center">
                <Tv className="h-8 w-8 mx-auto mb-2 text-indigo-400" />
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Active Channels</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6 text-center">
                <Video className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Total Content</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6 text-center">
                <Store className="h-8 w-8 mx-auto mb-2 text-green-400" />
                <p className="text-2xl font-bold">R0.00</p>
                <p className="text-sm text-muted-foreground">Revenue</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {["channels", "content", "discounts", "policies", "settings"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <Card className="bg-card/50 border-border/50">
              <CardContent className="py-12 text-center text-muted-foreground">
                <Settings className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg capitalize">{tab} Manager</p>
                <p className="text-sm">Manage your embed {tab}</p>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
