import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  Users, Download, Search, Filter, CheckCircle2, 
  XCircle, Clock, QrCode, Mail, Phone, Calendar
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface EventsAttendeesProps {
  profileId: string;
}

interface Event {
  id: string;
  title: string;
  start_date: string;
  attendee_count: number | null;
}

interface Ticket {
  id: string;
  event_id: string;
  buyer_name: string;
  buyer_email: string;
  ticket_tier: string | null;
  price: number;
  payment_status: string | null;
  tracking_number: string | null;
  checked_in: boolean | null;
  checked_in_at: string | null;
  purchased_at: string | null;
  email_sent: boolean | null;
}

export function EventsAttendees({ profileId }: EventsAttendeesProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [checkInMode, setCheckInMode] = useState(false);
  const [trackingInput, setTrackingInput] = useState("");

  useEffect(() => {
    loadEvents();
  }, [profileId]);

  useEffect(() => {
    loadTickets();
  }, [selectedEventId, profileId]);

  const loadEvents = async () => {
    const { data } = await supabase
      .from("creator_events")
      .select("id, title, start_date, attendee_count")
      .eq("creator_id", profileId)
      .order("start_date", { ascending: false });

    setEvents(data || []);
  };

  const loadTickets = async () => {
    setLoading(true);
    
    // Get event IDs for this creator
    const eventIds = events.map(e => e.id);
    
    if (eventIds.length === 0) {
      setTickets([]);
      setLoading(false);
      return;
    }

    // Note: Creator owns event data, full access granted
    // event_tickets_masked is available for cross-user contexts
    let query = supabase
      .from("creator_event_tickets")
      .select("*")
      .in("event_id", eventIds)
      .order("purchased_at", { ascending: false });

    if (selectedEventId !== "all") {
      query = query.eq("event_id", selectedEventId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error loading tickets:", error);
      toast.error("Failed to load attendees");
    } else {
      setTickets(data || []);
    }
    setLoading(false);
  };

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.buyer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.buyer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.tracking_number?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      statusFilter === "all" ||
      (statusFilter === "completed" && ticket.payment_status === "completed") ||
      (statusFilter === "pending" && ticket.payment_status === "pending") ||
      (statusFilter === "checked_in" && ticket.checked_in) ||
      (statusFilter === "not_checked_in" && !ticket.checked_in);

    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalTickets = tickets.length;
  const completedTickets = tickets.filter(t => t.payment_status === "completed").length;
  const checkedInTickets = tickets.filter(t => t.checked_in).length;
  const pendingTickets = tickets.filter(t => t.payment_status === "pending").length;

  // Export CSV
  const exportCSV = () => {
    if (filteredTickets.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = ["Name", "Email", "Ticket Tier", "Price", "Status", "Tracking #", "Checked In", "Check-In Time", "Purchase Date"];
    const rows = filteredTickets.map(t => [
      t.buyer_name,
      t.buyer_email,
      t.ticket_tier || "Adult",
      `R${t.price.toFixed(2)}`,
      t.payment_status || "unknown",
      t.tracking_number || "",
      t.checked_in ? "Yes" : "No",
      t.checked_in_at ? format(new Date(t.checked_in_at), "yyyy-MM-dd HH:mm") : "",
      t.purchased_at ? format(new Date(t.purchased_at), "yyyy-MM-dd HH:mm") : ""
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendees-${selectedEventId === "all" ? "all-events" : selectedEventId}-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(`Exported ${filteredTickets.length} records`);
  };

  // Check-in by tracking number
  const handleCheckIn = async () => {
    if (!trackingInput.trim()) {
      toast.error("Enter a tracking number");
      return;
    }

    const ticket = tickets.find(t => 
      t.tracking_number?.toLowerCase() === trackingInput.toLowerCase().trim()
    );

    if (!ticket) {
      toast.error("Ticket not found");
      return;
    }

    if (ticket.checked_in) {
      toast.error(`Already checked in at ${ticket.checked_in_at ? format(new Date(ticket.checked_in_at), "h:mm a") : "earlier"}`);
      return;
    }

    if (ticket.payment_status !== "completed") {
      toast.error("Ticket payment not completed");
      return;
    }

    const { error } = await supabase
      .from("creator_event_tickets")
      .update({
        checked_in: true,
        checked_in_at: new Date().toISOString()
      })
      .eq("id", ticket.id);

    if (error) {
      toast.error("Failed to check in");
    } else {
      toast.success(`${ticket.buyer_name} checked in!`);
      setTrackingInput("");
      loadTickets();
    }
  };

  // Toggle check-in status
  const toggleCheckIn = async (ticket: Ticket) => {
    const { error } = await supabase
      .from("creator_event_tickets")
      .update({
        checked_in: !ticket.checked_in,
        checked_in_at: !ticket.checked_in ? new Date().toISOString() : null
      })
      .eq("id", ticket.id);

    if (error) {
      toast.error("Failed to update");
    } else {
      toast.success(ticket.checked_in ? "Check-in removed" : "Checked in!");
      loadTickets();
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Paid</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Pending</Badge>;
      case "refunded":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Refunded</Badge>;
      default:
        return <Badge variant="secondary">{status || "Unknown"}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Tickets</p>
            <p className="text-2xl font-bold">{totalTickets}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-emerald-500/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Paid</p>
            <p className="text-2xl font-bold text-emerald-400">{completedTickets}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-blue-500/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Checked In</p>
            <p className="text-2xl font-bold text-blue-400">{checkedInTickets}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-amber-500/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-amber-400">{pendingTickets}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Actions */}
      <Card className="bg-card/50">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            {/* Event Filter */}
            <div className="flex-1 min-w-[200px]">
              <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  {events.map(event => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.title} ({event.attendee_count || 0})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search name, email, tracking #..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="checked_in">Checked In</SelectItem>
                <SelectItem value="not_checked_in">Not Checked In</SelectItem>
              </SelectContent>
            </Select>

            {/* Actions */}
            <Button variant="outline" onClick={exportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button 
              variant={checkInMode ? "default" : "outline"}
              onClick={() => setCheckInMode(!checkInMode)}
              className={checkInMode ? "bg-gradient-to-r from-purple-500 to-pink-500" : ""}
            >
              <QrCode className="h-4 w-4 mr-2" />
              {checkInMode ? "Exit Check-In" : "Check-In Mode"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Check-In Mode Panel */}
      {checkInMode && (
        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <QrCode className="h-12 w-12 text-purple-400" />
              <div className="flex-1">
                <h3 className="font-bold text-lg">Check-In Mode</h3>
                <p className="text-sm text-muted-foreground">Enter tracking number to check in attendee</p>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Input 
                placeholder="Enter tracking number (e.g., TKT-20260117-ABC123)"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleCheckIn()}
                className="flex-1 font-mono"
              />
              <Button onClick={handleCheckIn} className="bg-gradient-to-r from-purple-500 to-pink-500">
                Check In
              </Button>
            </div>
            <div className="flex gap-4 mt-4 text-sm">
              <span className="text-emerald-400">✓ Checked In: {checkedInTickets}</span>
              <span className="text-muted-foreground">/ Total: {completedTickets}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendees Table */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Attendees ({filteredTickets.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No attendees found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tracking #</TableHead>
                    <TableHead>Checked In</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map(ticket => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.buyer_name}</TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{ticket.buyer_email}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {ticket.ticket_tier || "Adult"}
                        </Badge>
                      </TableCell>
                      <TableCell>R{ticket.price.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(ticket.payment_status)}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {ticket.tracking_number || "N/A"}
                        </code>
                      </TableCell>
                      <TableCell>
                        {ticket.checked_in ? (
                          <div className="flex items-center gap-1 text-emerald-400">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-xs">
                              {ticket.checked_in_at && format(new Date(ticket.checked_in_at), "h:mm a")}
                            </span>
                          </div>
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleCheckIn(ticket)}
                          disabled={ticket.payment_status !== "completed"}
                        >
                          {ticket.checked_in ? "Undo" : "Check In"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
