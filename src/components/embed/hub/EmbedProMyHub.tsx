import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmbedProAnalyticsSection } from "./EmbedProAnalyticsSection";
import { EmbedProCreatorDashboardSection } from "./EmbedProCreatorDashboardSection";
import { EmbedProBusinessHubSection } from "./EmbedProBusinessHubSection";
import { EmbedProSupportSection } from "./EmbedProSupportSection";
import { EmbedProChannelManager } from "@/components/channel/EmbedProChannelManager";
import { EmbedProStreamStudio } from "@/components/stream/EmbedProStreamStudio";
import { PlaylistManager } from "@/components/playlist/PlaylistManager";
import { EmbedProEventsHub } from "@/components/embed/EmbedProEventsHub";
import EmbedProAnalytics from "@/components/embed/EmbedProAnalytics";
import { EventsHub } from "@/components/events/EventsHub";
import { 
  BarChart3, Layout, Store, HelpCircle, 
  Tv, Radio, ListVideo, Calendar, Video, BookOpen 
} from "lucide-react";

interface EmbedProMyHubProps {
  profileId: string;
}

export function EmbedProMyHub({ profileId }: EmbedProMyHubProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Hub</h1>
      
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted p-1">
          <TabsTrigger value="dashboard" className="gap-2">
            <Layout className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="channels" className="gap-2">
            <Tv className="h-4 w-4" />
            Channels
          </TabsTrigger>
          <TabsTrigger value="playlists" className="gap-2">
            <ListVideo className="h-4 w-4" />
            Playlists
          </TabsTrigger>
          <TabsTrigger value="stream" className="gap-2">
            <Radio className="h-4 w-4" />
            Stream
          </TabsTrigger>
          <TabsTrigger value="vod" className="gap-2">
            <Video className="h-4 w-4" />
            VOD
          </TabsTrigger>
          <TabsTrigger value="events" className="gap-2">
            <Calendar className="h-4 w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="business" className="gap-2">
            <Store className="h-4 w-4" />
            Business
          </TabsTrigger>
          <TabsTrigger value="guide" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Guide
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
          <EmbedProAnalytics />
        </TabsContent>
        <TabsContent value="channels">
          <EmbedProChannelManager profileId={profileId} />
        </TabsContent>
        <TabsContent value="playlists">
          <PlaylistManager profileId={profileId} />
        </TabsContent>
        <TabsContent value="stream">
          <EmbedProStreamStudio profileId={profileId} />
        </TabsContent>
        <TabsContent value="vod">
          <EmbedProAnalyticsSection profileId={profileId} onBack={() => {}} />
        </TabsContent>
        <TabsContent value="events">
          <EventsHub profileId={profileId} />
        </TabsContent>
        <TabsContent value="business">
          <EmbedProBusinessHubSection profileId={profileId} onBack={() => {}} />
        </TabsContent>
        <TabsContent value="guide">
          <EmbedProEventsHub profileId={profileId} onBack={() => {}} />
        </TabsContent>
        <TabsContent value="support">
          <EmbedProSupportSection profileId={profileId} onBack={() => {}} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
