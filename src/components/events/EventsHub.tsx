import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Rocket, Calendar, Ticket, Users, BarChart3, 
  Settings, HelpCircle, Download, Shield, ExternalLink
} from "lucide-react";
import { EventsGettingStarted } from "./EventsGettingStarted";
import { EventsDashboard } from "./EventsDashboard";
import { EventsManager } from "./EventsManager";
import { EventsAttendees } from "./EventsAttendees";
import { EventsAnalytics } from "./EventsAnalytics";
import { EventsRefunds } from "./EventsRefunds";
import { EventsHelpSupport } from "./EventsHelpSupport";
import { EventsPolicies } from "./EventsPolicies";

interface EventsHubProps {
  profileId: string;
}

export function EventsHub({ profileId }: EventsHubProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("getting-started");
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalTicketsSold: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    loadStats();
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Events Bookings
              </h1>
              <p className="text-muted-foreground mt-1">
                Create, sell tickets, track attendees & manage your event revenue
              </p>
            </div>
            <Button 
              variant="outline" 
              className="gap-2 border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
              onClick={() => navigate("/events-diary?from=elite-pro")}
            >
              <ExternalLink className="h-4 w-4" />
              View Events Diary
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Card className="bg-card/50 border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Events</p>
                    <p className="text-2xl font-bold">{stats.totalEvents}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-400 opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-emerald-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Upcoming</p>
                    <p className="text-2xl font-bold">{stats.upcomingEvents}</p>
                  </div>
                  <Rocket className="h-8 w-8 text-emerald-400 opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-blue-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tickets Sold</p>
                    <p className="text-2xl font-bold">{stats.totalTicketsSold}</p>
                  </div>
                  <Ticket className="h-8 w-8 text-blue-400 opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-pink-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue (94%)</p>
                    <p className="text-2xl font-bold">R{stats.totalRevenue.toFixed(0)}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-pink-400 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap h-auto gap-1 bg-card/50 p-1">
            <TabsTrigger value="getting-started" className="data-[state=active]:bg-purple-500/20">
              <Rocket className="h-4 w-4 mr-2" />
              Getting Started
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-500/20">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-purple-500/20">
              <Calendar className="h-4 w-4 mr-2" />
              My Events
            </TabsTrigger>
            <TabsTrigger value="attendees" className="data-[state=active]:bg-purple-500/20">
              <Users className="h-4 w-4 mr-2" />
              Attendees
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-500/20">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="refunds" className="data-[state=active]:bg-purple-500/20">
              <Download className="h-4 w-4 mr-2" />
              Refunds
            </TabsTrigger>
            <TabsTrigger value="policies" className="data-[state=active]:bg-purple-500/20">
              <Shield className="h-4 w-4 mr-2" />
              Policies
            </TabsTrigger>
            <TabsTrigger value="help" className="data-[state=active]:bg-purple-500/20">
              <HelpCircle className="h-4 w-4 mr-2" />
              Help
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="getting-started">
              <EventsGettingStarted onNavigate={setActiveTab} />
            </TabsContent>
            <TabsContent value="dashboard">
              <EventsDashboard profileId={profileId} />
            </TabsContent>
            <TabsContent value="events">
              <EventsManager profileId={profileId} />
            </TabsContent>
            <TabsContent value="attendees">
              <EventsAttendees profileId={profileId} />
            </TabsContent>
            <TabsContent value="analytics">
              <EventsAnalytics profileId={profileId} />
            </TabsContent>
            <TabsContent value="refunds">
              <EventsRefunds profileId={profileId} />
            </TabsContent>
            <TabsContent value="policies">
              <EventsPolicies profileId={profileId} />
            </TabsContent>
            <TabsContent value="help">
              <EventsHelpSupport />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
