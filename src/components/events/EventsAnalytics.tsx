import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, TrendingUp, Users, Wallet, Ticket,
  Calendar, ArrowUp, ArrowDown, Minus
} from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";

interface EventsAnalyticsProps {
  profileId: string;
}

export function EventsAnalytics({ profileId }: EventsAnalyticsProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [profileId]);

  const loadData = async () => {
    // Load events
    const { data: eventsData } = await supabase
      .from("community_events")
      .select("*")
      .eq("creator_id", profileId);

    const eventIds = eventsData?.map(e => e.id) || [];

    // Load tickets for all events
    const { data: ticketsData } = eventIds.length > 0
      ? await supabase
          .from("event_tickets")
          .select("*")
          .in("event_id", eventIds)
      : { data: [] };

    // Load payments
    const { data: paymentsData } = await supabase
      .from("creator_payments")
      .select("*")
      .eq("creator_id", profileId)
      .eq("payment_type", "event_revenue");

    setEvents(eventsData || []);
    setTickets(ticketsData || []);
    setPayments(paymentsData || []);
    setLoading(false);
  };

  // Calculate metrics
  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalTickets = tickets.filter(t => t.payment_status === "completed").length;
  const avgTicketPrice = totalTickets > 0 
    ? tickets.filter(t => t.payment_status === "completed").reduce((sum, t) => sum + t.price, 0) / totalTickets 
    : 0;
  const conversionRate = tickets.length > 0 
    ? (tickets.filter(t => t.payment_status === "completed").length / tickets.length * 100) 
    : 0;

  // Revenue by day (last 30 days)
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dayPayments = payments.filter(p => 
      format(new Date(p.created_at), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
    return {
      date: format(date, "MMM d"),
      revenue: dayPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
    };
  });

  // Ticket tiers distribution
  const tierCounts = {
    adult: tickets.filter(t => (t.ticket_tier || "adult") === "adult").length,
    child: tickets.filter(t => t.ticket_tier === "child").length,
    senior: tickets.filter(t => t.ticket_tier === "senior").length,
  };
  const tierData = [
    { name: "Adult", value: tierCounts.adult, color: "#8b5cf6" },
    { name: "Child", value: tierCounts.child, color: "#ec4899" },
    { name: "Senior", value: tierCounts.senior, color: "#10b981" },
  ].filter(d => d.value > 0);

  // Top events by revenue
  const eventRevenue = events.map(event => {
    const eventTickets = tickets.filter(t => t.event_id === event.id && t.payment_status === "completed");
    const revenue = eventTickets.reduce((sum, t) => sum + (t.price * 0.94), 0);
    return {
      name: event.title.slice(0, 20) + (event.title.length > 20 ? "..." : ""),
      revenue,
      tickets: eventTickets.length,
    };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  // Monthly comparison
  const thisMonth = payments.filter(p => {
    const date = new Date(p.created_at);
    return date >= startOfMonth(new Date()) && date <= endOfMonth(new Date());
  }).reduce((sum, p) => sum + (p.amount || 0), 0);

  const lastMonth = payments.filter(p => {
    const date = new Date(p.created_at);
    const lastMonthStart = startOfMonth(subDays(new Date(), 30));
    const lastMonthEnd = endOfMonth(subDays(new Date(), 30));
    return date >= lastMonthStart && date <= lastMonthEnd;
  }).reduce((sum, p) => sum + (p.amount || 0), 0);

  const monthlyChange = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <Wallet className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-emerald-400">R{totalRevenue.toFixed(0)}</p>
            <div className="flex items-center gap-1 mt-1">
              {monthlyChange > 0 ? (
                <ArrowUp className="h-3 w-3 text-emerald-400" />
              ) : monthlyChange < 0 ? (
                <ArrowDown className="h-3 w-3 text-red-400" />
              ) : (
                <Minus className="h-3 w-3 text-muted-foreground" />
              )}
              <span className={`text-xs ${monthlyChange >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {Math.abs(monthlyChange).toFixed(0)}% vs last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Tickets Sold</p>
              <Ticket className="h-4 w-4 text-blue-400" />
            </div>
            <p className="text-2xl font-bold">{totalTickets}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {events.length} events
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Avg Ticket Price</p>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold">R{avgTicketPrice.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              per ticket
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <Users className="h-4 w-4 text-pink-400" />
            </div>
            <p className="text-2xl font-bold">{conversionRate.toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              pending to paid
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Revenue Over Time */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Revenue (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={last30Days}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" tick={{ fill: '#888', fontSize: 10 }} />
                <YAxis tick={{ fill: '#888' }} />
                <Tooltip 
                  contentStyle={{ background: '#1a1a2e', border: '1px solid #333' }}
                  formatter={(value: number) => [`R${value.toFixed(0)}`, "Revenue"]}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8b5cf6" 
                  fill="url(#revenueGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ticket Tiers */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Ticket Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {tierData.length > 0 ? (
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={tierData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {tierData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                No ticket data yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Events by Revenue */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">Top Events by Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          {eventRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventRevenue} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" tick={{ fill: '#888' }} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#888', fontSize: 11 }} width={150} />
                <Tooltip 
                  contentStyle={{ background: '#1a1a2e', border: '1px solid #333' }}
                  formatter={(value: number, name: string) => [
                    name === "revenue" ? `R${value.toFixed(0)}` : value,
                    name === "revenue" ? "Revenue (94%)" : "Tickets"
                  ]}
                />
                <Bar dataKey="revenue" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No events with revenue yet</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revenue Breakdown */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Gross Sales</p>
              <p className="text-2xl font-bold">R{(totalRevenue / 0.94).toFixed(0)}</p>
            </div>
            <div className="p-4 bg-red-500/10 rounded-lg text-center border border-red-500/20">
              <p className="text-sm text-muted-foreground">Platform Fee (6%)</p>
              <p className="text-2xl font-bold text-red-400">-R{(totalRevenue / 0.94 * 0.06).toFixed(0)}</p>
            </div>
            <div className="p-4 bg-emerald-500/10 rounded-lg text-center border border-emerald-500/20">
              <p className="text-sm text-muted-foreground">Your Earnings (94%)</p>
              <p className="text-2xl font-bold text-emerald-400">R{totalRevenue.toFixed(0)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
