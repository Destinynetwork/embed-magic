import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Rocket, Calendar, Ticket, Users, BarChart3, 
  HelpCircle, Download, Shield, ExternalLink
} from "lucide-react";
import { EventsGettingStarted } from "@/components/events/EventsGettingStarted";
import { EventsDashboard } from "@/components/events/EventsDashboard";
import { EventsManager } from "@/components/events/EventsManager";
import { EventsAttendees } from "@/components/events/EventsAttendees";
import { EventsAnalytics } from "@/components/events/EventsAnalytics";
import { EventsRefunds } from "@/components/events/EventsRefunds";
import { EventsHelpSupport } from "@/components/events/EventsHelpSupport";
import { EventsPolicies } from "@/components/events/EventsPolicies";

interface EmbedProEventsHubProps {
  profileId: string;
  onBack: () => void;
}

export function EmbedProEventsHub({ profileId, onBack }: EmbedProEventsHubProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("getting-started");
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalTicketsSold: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    if (profileId) {
      loadStats();
    }
  }, [profileId]);

  const loadStats = async () => {
    // Load events count from creator_events table
    const { data: events } = await supabase
      .from("creator_events")
      .select("id, status, attendee_count")
      .eq("creator_id", profileId);

    // Load revenue
    const { data: payments } = await supabase
      .from("creator_payments")
      .select("amount")
      .eq("creator_id", profileId)
      .eq("payment_type", "event_revenue");

    const totalEvents = events?.length || 0;
    const upcomingEvents = events?.filter(e => e.status === "upcoming").length || 0;
    const totalTicketsSold = events?.reduce((sum, e) => sum + (e.attendee_count || 0), 0) || 0;
    const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

    setStats({ totalEvents, upcomingEvents, totalTicketsSold, totalRevenue });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 -mx-6 -mt-4 px-6 pt-4 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Events Bookings
            </h1>
            <p className="text-muted-foreground mt-1">
              Create, sell tickets, track attendees & manage your event revenue
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="gap-2 border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
              onClick={() => navigate("/events-diary?from=embed-pro")}
            >
              <ExternalLink className="h-4 w-4" />
              View Events Diary
            </Button>
            <Button variant="outline" onClick={onBack}>
              ← Back to Embed Pro
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Card className="bg-card/50 border-amber-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Events</p>
                  <p className="text-2xl font-bold">{stats.totalEvents}</p>
                </div>
                <Calendar className="h-8 w-8 text-amber-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold">{stats.upcomingEvents}</p>
                </div>
                <Rocket className="h-8 w-8 text-green-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-cyan-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tickets Sold</p>
                  <p className="text-2xl font-bold">{stats.totalTicketsSold}</p>
                </div>
                <Users className="h-8 w-8 text-cyan-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-pink-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue (94%)</p>
                  <p className="text-2xl font-bold">R{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-pink-500/50" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 flex-wrap h-auto gap-1">
          <TabsTrigger value="getting-started" className="gap-2">
            <Rocket className="h-4 w-4" />
            Getting Started
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="events" className="gap-2">
            <Calendar className="h-4 w-4" />
            My Events
          </TabsTrigger>
          <TabsTrigger value="attendees" className="gap-2">
            <Users className="h-4 w-4" />
            Attendees
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="refunds" className="gap-2">
            <Download className="h-4 w-4" />
            Refunds
          </TabsTrigger>
          <TabsTrigger value="policies" className="gap-2">
            <Shield className="h-4 w-4" />
            Policies
          </TabsTrigger>
          <TabsTrigger value="help" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            Help
          </TabsTrigger>
        </TabsList>

        <TabsContent value="getting-started" className="mt-6">
          <EventsGettingStarted onNavigate={setActiveTab} />
        </TabsContent>

        <TabsContent value="dashboard" className="mt-6">
          <EventsDashboard profileId={profileId} />
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <EventsManager profileId={profileId} />
        </TabsContent>

        <TabsContent value="attendees" className="mt-6">
          <EventsAttendees profileId={profileId} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <EventsAnalytics profileId={profileId} />
        </TabsContent>

        <TabsContent value="refunds" className="mt-6">
          <EventsRefunds profileId={profileId} />
        </TabsContent>

        <TabsContent value="policies" className="mt-6">
          <EventsPolicies profileId={profileId} />
        </TabsContent>

        <TabsContent value="help" className="mt-6">
          <EventsHelpSupport />
        </TabsContent>
      </Tabs>
    </div>
  );
}
