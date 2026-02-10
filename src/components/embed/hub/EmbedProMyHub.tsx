import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmbedProAnalyticsSection } from "./EmbedProAnalyticsSection";
import { EmbedProCreatorDashboardSection } from "./EmbedProCreatorDashboardSection";
import { EmbedProBusinessHubSection } from "./EmbedProBusinessHubSection";
import { EmbedProSupportSection } from "./EmbedProSupportSection";
import { BarChart3, Layout, Store, HelpCircle } from "lucide-react";

interface EmbedProMyHubProps {
  profileId: string;
}

export function EmbedProMyHub({ profileId }: EmbedProMyHubProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Hub</h1>
      
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="gap-2">
            <Layout className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="business" className="gap-2">
            <Store className="h-4 w-4" />
            Business
          </TabsTrigger>
          <TabsTrigger value="support" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            Support
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <EmbedProCreatorDashboardSection profileId={profileId} onBack={() => {}} />
        </TabsContent>
        <TabsContent value="analytics">
          <EmbedProAnalyticsSection profileId={profileId} onBack={() => {}} />
        </TabsContent>
        <TabsContent value="business">
          <EmbedProBusinessHubSection profileId={profileId} onBack={() => {}} />
        </TabsContent>
        <TabsContent value="support">
          <EmbedProSupportSection profileId={profileId} onBack={() => {}} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
