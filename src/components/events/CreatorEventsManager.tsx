import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, Calendar, MapPin, Users, Ticket, Edit, Trash2, Eye, 
  Clock, Wallet, Video, Radio, Crown, QrCode, Mail, Copy, ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface CreatorEvent {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  location: string | null;
  adult_price: number | null;
  child_price: number | null;
  senior_price: number | null;
  max_attendees: number | null;
  attendee_count: number | null;
  event_type: string | null;
  is_virtual: boolean | null;
  is_vvip: boolean | null;
  status: string | null;
  thumbnail_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_whatsapp: string | null;
}

interface EventTicket {
  id: string;
  buyer_name: string;
  buyer_email: string;
  ticket_type: string | null;
  ticket_tier: string | null;
  price: number;
  payment_status: string | null;
  checked_in: boolean | null;
  tracking_number: string | null;
  purchased_at: string | null;
}

const EVENT_TYPES = [
  "Concert",
  "Live Stream",
  "Club Scene",
  "Performance",
  "Conference",
  "Exhibition",
  "Screening",
  "Podcast",
  "Radio Show",
  "Workshop",
  "Other"
];

interface CreatorEventsManagerProps {
  profileId: string;
  filterType?: "all" | "live" | "vod";
}

export function CreatorEventsManager({ profileId, filterType = "all" }: CreatorEventsManagerProps) {
  const [events, setEvents] = useState<CreatorEvent[]>([]);
  const [tickets, setTickets] = useState<EventTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTicketsModal, setShowTicketsModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CreatorEvent | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    location: "",
    event_type: "Live Stream",
    is_virtual: true,
    is_vvip: false,
    adult_price: "0",
    child_discount: "50",
    senior_discount: "30",
    max_attendees: "100",
    contact_email: "",
    contact_phone: "",
    contact_whatsapp: "",
    thumbnail_url: "",
  });

  useEffect(() => {
    loadEvents();
  }, [profileId]);

  const loadEvents = async () => {
    const { data, error } = await supabase
      .from('creator_events')
      .select('*')
      .eq('creator_id', profileId)
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error loading events:', error);
      toast.error('Failed to load events');
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  const loadEventTickets = async (eventId: string) => {
    const { data, error } = await supabase
      .from('creator_event_tickets')
      .select('*')
      .eq('event_id', eventId)
      .order('purchased_at', { ascending: false });

    if (error) {
      console.error('Error loading tickets:', error);
    } else {
      setTickets(data || []);
    }
  };

  const handleViewTickets = async (eventId: string) => {
    setSelectedEventId(eventId);
    await loadEventTickets(eventId);
    setShowTicketsModal(true);
  };

  const handleEditEvent = (event: CreatorEvent) => {
    const startDate = event.start_date ? new Date(event.start_date) : new Date();
    const endDate = event.end_date ? new Date(event.end_date) : null;
    
    setFormData({
      title: event.title,
      description: event.description || "",
      start_date: format(startDate, "yyyy-MM-dd"),
      start_time: format(startDate, "HH:mm"),
      end_date: endDate ? format(endDate, "yyyy-MM-dd") : "",
      end_time: endDate ? format(endDate, "HH:mm") : "",
      location: event.location || "",
      event_type: event.event_type || "Live Stream",
      is_virtual: event.is_virtual ?? true,
      is_vvip: event.is_vvip ?? false,
      adult_price: (event.adult_price || 0).toString(),
      child_discount: "50",
      senior_discount: "30",
      max_attendees: (event.max_attendees || 100).toString(),
      contact_email: event.contact_email || "",
      contact_phone: event.contact_phone || "",
      contact_whatsapp: event.contact_whatsapp || "",
      thumbnail_url: event.thumbnail_url || "",
    });
    setEditingEvent(event);
    setShowCreateModal(true);
  };

  const handleCreateNew = () => {
    setFormData({
      title: "",
      description: "",
      start_date: "",
      start_time: "",
      end_date: "",
      end_time: "",
      location: "",
      event_type: "Live Stream",
      is_virtual: true,
      is_vvip: false,
      adult_price: "0",
      child_discount: "50",
      senior_discount: "30",
      max_attendees: "100",
      contact_email: "",
      contact_phone: "",
      contact_whatsapp: "",
      thumbnail_url: "",
    });
    setEditingEvent(null);
    setShowCreateModal(true);
  };

  const handleSaveEvent = async () => {
    if (!formData.title || !formData.start_date || !formData.start_time) {
      toast.error("Please fill in required fields: Title, Date, and Time");
      return;
    }

    setSaving(true);

    const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`);
    const endDateTime = formData.end_date && formData.end_time 
      ? new Date(`${formData.end_date}T${formData.end_time}`)
      : null;

    const adultPrice = parseFloat(formData.adult_price) || 0;
    const childDiscount = parseFloat(formData.child_discount) || 50;
    const seniorDiscount = parseFloat(formData.senior_discount) || 30;

    const eventData = {
      title: formData.title,
      description: formData.description || null,
      start_date: startDateTime.toISOString(),
      end_date: endDateTime?.toISOString() || null,
      location: formData.is_virtual ? "Virtual Event" : formData.location,
      event_type: formData.event_type,
      is_virtual: formData.is_virtual,
      is_vvip: formData.is_vvip,
      ticket_price: adultPrice,
      adult_price: adultPrice,
      child_price: adultPrice * (1 - childDiscount / 100),
      senior_price: adultPrice * (1 - seniorDiscount / 100),
      child_discount_percent: childDiscount,
      senior_discount_percent: seniorDiscount,
      max_attendees: parseInt(formData.max_attendees) || 100,
      contact_email: formData.contact_email || null,
      contact_phone: formData.contact_phone || null,
      contact_whatsapp: formData.contact_whatsapp || null,
      thumbnail_url: formData.thumbnail_url || null,
      status: "upcoming",
      creator_id: profileId,
    };

    if (editingEvent) {
      const { error } = await supabase
        .from('creator_events')
        .update(eventData)
        .eq('id', editingEvent.id);

      if (error) {
        toast.error('Failed to update event');
        console.error(error);
      } else {
        toast.success('Event updated successfully');
        setShowCreateModal(false);
        loadEvents();
      }
    } else {
      const { error } = await supabase
        .from('creator_events')
        .insert(eventData);

      if (error) {
        toast.error('Failed to create event');
        console.error(error);
      } else {
        toast.success('Event created successfully');
        setShowCreateModal(false);
        loadEvents();
      }
    }

    setSaving(false);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    const { error } = await supabase
      .from('creator_events')
      .delete()
      .eq('id', eventId);

    if (error) {
      toast.error('Failed to delete event');
    } else {
      toast.success('Event deleted');
      loadEvents();
    }
  };

  const copyEventLink = (eventId: string) => {
    const link = `${window.location.origin}/premiere/${eventId}/tickets`;
    navigator.clipboard.writeText(link);
    toast.success('Event link copied to clipboard!');
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'live':
        return <Badge className="bg-red-500 text-white">🔴 LIVE</Badge>;
      case 'upcoming':
        return <Badge variant="outline" className="border-emerald-500 text-emerald-400">Upcoming</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status || 'Draft'}</Badge>;
    }
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Events</h2>
          <p className="text-muted-foreground">Create and manage your premiere events</p>
        </div>
        <Button onClick={handleCreateNew} className="bg-gradient-to-r from-purple-500 to-pink-500">
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <Card className="bg-card/50">
          <CardContent className="py-12 text-center">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Events Yet</h3>
            <p className="text-muted-foreground mb-4">Create your first premiere event to start selling tickets</p>
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Event
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <Card key={event.id} className="bg-card/50 hover:border-purple-500/50 transition-all">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-32 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {event.thumbnail_url ? (
                      <img src={event.thumbnail_url} alt={event.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                        {event.is_virtual ? <Video className="h-8 w-8 text-purple-400" /> : <MapPin className="h-8 w-8 text-pink-400" />}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold truncate">{event.title}</h3>
                        {getStatusBadge(event.status)}
                        {event.is_vvip && (
                          <Badge className="bg-amber-500 text-black">
                            <Crown className="h-3 w-3 mr-1" />
                            VVIP
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(event.start_date), "MMM d, yyyy h:mm a")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {event.attendee_count || 0} / {event.max_attendees || '∞'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Wallet className="h-4 w-4" />
                        {event.adult_price ? `R${event.adult_price}` : 'FREE'}
                      </span>
                      {event.is_virtual && (
                        <Badge variant="outline" className="text-xs">Virtual</Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => handleViewTickets(event.id)} title="View Tickets">
                      <Ticket className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => copyEventLink(event.id)} title="Copy Link">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEditEvent(event)} title="Edit">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteEvent(event.id)} title="Delete" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Event Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
            <DialogDescription>
              {editingEvent ? 'Update your event details' : 'Fill in the details to create a new premiere event'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Event Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Live Concert: Summer Vibes 2026"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your event..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <Select value={formData.event_type} onValueChange={(v) => setFormData({ ...formData, event_type: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Thumbnail URL</Label>
                  <Input
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="space-y-4">
              <h4 className="font-medium">Date & Time</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start Time *</Label>
                  <Input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Location & Type */}
            <div className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_virtual}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_virtual: checked })}
                  />
                  <Label>Virtual Event</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_vvip}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_vvip: checked })}
                  />
                  <Label className="flex items-center gap-1">
                    <Crown className="h-4 w-4 text-amber-500" />
                    VVIP Only
                  </Label>
                </div>
              </div>

              {!formData.is_virtual && (
                <div className="space-y-2">
                  <Label>Venue Location</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Cape Town Stadium, Cape Town"
                  />
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h4 className="font-medium">Ticket Pricing</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Adult Price (R)</Label>
                  <Input
                    type="number"
                    value={formData.adult_price}
                    onChange={(e) => setFormData({ ...formData, adult_price: e.target.value })}
                    placeholder="0 for free"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Child Discount (%)</Label>
                  <Input
                    type="number"
                    value={formData.child_discount}
                    onChange={(e) => setFormData({ ...formData, child_discount: e.target.value })}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Senior Discount (%)</Label>
                  <Input
                    type="number"
                    value={formData.senior_discount}
                    onChange={(e) => setFormData({ ...formData, senior_discount: e.target.value })}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Max Attendees</Label>
                <Input
                  type="number"
                  value={formData.max_attendees}
                  onChange={(e) => setFormData({ ...formData, max_attendees: e.target.value })}
                  placeholder="100"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="font-medium">Contact Information</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp</Label>
                  <Input
                    value={formData.contact_whatsapp}
                    onChange={(e) => setFormData({ ...formData, contact_whatsapp: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button onClick={handleSaveEvent} disabled={saving}>
              {saving ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tickets Modal */}
      <Dialog open={showTicketsModal} onOpenChange={setShowTicketsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Tickets for: {selectedEvent?.title}
            </DialogTitle>
            <DialogDescription>
              {tickets.length} tickets sold • Revenue: R{tickets.reduce((sum, t) => sum + t.price, 0).toFixed(2)}
            </DialogDescription>
          </DialogHeader>

          {tickets.length === 0 ? (
            <div className="py-12 text-center">
              <QrCode className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No tickets sold yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Checked In</TableHead>
                  <TableHead>Ticket #</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{ticket.buyer_name}</p>
                        <p className="text-xs text-muted-foreground">{ticket.buyer_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{ticket.ticket_tier || ticket.ticket_type || 'Adult'}</TableCell>
                    <TableCell>R{ticket.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={ticket.payment_status === 'paid' ? 'default' : 'secondary'}>
                        {ticket.payment_status || 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {ticket.checked_in ? (
                        <Badge className="bg-emerald-500 text-white">✓ Yes</Badge>
                      ) : (
                        <Badge variant="outline">No</Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{ticket.tracking_number || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
