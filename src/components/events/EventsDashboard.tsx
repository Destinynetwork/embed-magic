import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, Ticket, Users, Wallet, TrendingUp, 
  Clock, Video, MapPin, Eye
} from "lucide-react";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface EventsDashboardProps {
  profileId: string;
}

interface Event {
  id: string;
  title: string;
  start_date: string;
  attendee_count: number | null;
  max_attendees: number | null;
  status: string | null;
  is_virtual: boolean | null;
  adult_price: number | null;
}

interface Payment {
  id: string;
  amount: number;
  created_at: string;
  notes: string | null;
}

export function EventsDashboard({ profileId }: EventsDashboardProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [profileId]);

  const loadData = async () => {
    const [eventsRes, paymentsRes] = await Promise.all([
      supabase
        .from("creator_events")
        .select("*")
        .eq("creator_id", profileId)
        .order("start_date", { ascending: false }),
      supabase
        .from("creator_payments")
        .select("*")
        .eq("creator_id", profileId)
        .eq("payment_type", "event_revenue")
        .order("created_at", { ascending: false })
    ]);

    setEvents(eventsRes.data || []);
    setPayments(paymentsRes.data || []);
    setLoading(false);
  };

  // Calculate stats
  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => e.status === "upcoming");
  const liveEvents = events.filter(e => e.status === "live");
  const completedEvents = events.filter(e => e.status === "completed");
  const totalTicketsSold = events.reduce((sum, e) => sum + (e.attendee_count || 0), 0);
  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const avgTicketsPerEvent = totalEvents > 0 ? Math.round(totalTicketsSold / totalEvents) : 0;

  // Chart data - tickets by event
  const ticketsByEvent = events.slice(0, 7).map(e => ({
    name: e.title.slice(0, 15) + (e.title.length > 15 ? "..." : ""),
    tickets: e.attendee_count || 0,
    capacity: e.max_attendees || 100,
  }));

  // Chart data - event types
  const eventTypeData = [
    { name: "Virtual", value: events.filter(e => e.is_virtual).length, color: "#8b5cf6" },
    { name: "In-Person", value: events.filter(e => !e.is_virtual).length, color: "#ec4899" },
  ].filter(d => d.value > 0);

  // Recent payments
  const recentPayments = payments.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-3xl font-bold">{totalEvents}</p>
              </div>
              <Calendar className="h-10 w-10 text-purple-400 opacity-30" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tickets Sold</p>
                <p className="text-3xl font-bold">{totalTicketsSold}</p>
              </div>
              <Ticket className="h-10 w-10 text-blue-400 opacity-30" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue (94%)</p>
                <p className="text-3xl font-bold">R{totalRevenue.toFixed(0)}</p>
              </div>
              <Wallet className="h-10 w-10 text-emerald-400 opacity-30" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Tickets/Event</p>
                <p className="text-3xl font-bold">{avgTicketsPerEvent}</p>
              </div>
              <TrendingUp className="h-10 w-10 text-pink-400 opacity-30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live & Upcoming Events */}
      {(liveEvents.length > 0 || upcomingEvents.length > 0) && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Live Now */}
          {liveEvents.length > 0 && (
            <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Live Now
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {liveEvents.map(event => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {event.is_virtual ? (
                        <Video className="h-5 w-5 text-red-400" />
                      ) : (
                        <MapPin className="h-5 w-5 text-red-400" />
                      )}
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.attendee_count || 0} attendees
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-red-500 text-white">LIVE</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Upcoming */}
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald-400" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.length === 0 ? (
                <p className="text-muted-foreground text-sm">No upcoming events</p>
              ) : (
                upcomingEvents.slice(0, 3).map(event => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      {event.is_virtual ? (
                        <Video className="h-5 w-5 text-purple-400" />
                      ) : (
                        <MapPin className="h-5 w-5 text-pink-400" />
                      )}
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(event.start_date), "MMM d, h:mm a")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{event.attendee_count || 0}</p>
                      <p className="text-xs text-muted-foreground">tickets</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Tickets by Event */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle>Tickets by Event</CardTitle>
          </CardHeader>
          <CardContent>
            {ticketsByEvent.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ticketsByEvent}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#888' }} />
                  <Tooltip 
                    contentStyle={{ background: '#1a1a2e', border: '1px solid #333' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="tickets" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                No events yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Event Types */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle>Event Types</CardTitle>
          </CardHeader>
          <CardContent>
            {eventTypeData.length > 0 ? (
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={eventTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {eventTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                No events yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Payments */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-emerald-400" />
            Recent Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentPayments.length === 0 ? (
            <p className="text-muted-foreground text-sm">No revenue yet</p>
          ) : (
            <div className="space-y-3">
              {recentPayments.map(payment => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-emerald-400">+R{payment.amount.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {payment.notes?.slice(0, 50) || "Event revenue"}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(payment.created_at), "MMM d, h:mm a")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
