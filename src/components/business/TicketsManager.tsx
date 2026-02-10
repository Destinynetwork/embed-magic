import { useState, useEffect } from "react";
import { MessageSquare, Search, Filter, AlertCircle, CheckCircle2, Clock, XCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { demoTickets, demoOrders } from "@/lib/demo/businessHubDemo";

interface Ticket {
  id: string; ticket_number: string; customer_name: string; customer_email: string; customer_phone: string | null;
  ticket_type: string; subject: string; description: string; status: string; priority: string;
  admin_notes: string | null; business_response: string | null; resolved_at: string | null;
  created_at: string; updated_at: string;
}

interface TicketsManagerProps { businessId: string | null; demoMode?: boolean; }

export default function TicketsManager({ businessId, demoMode = false }: TicketsManagerProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [responseText, setResponseText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (demoMode) { setTickets(demoTickets.map(t => ({ ...t })) as unknown as Ticket[]); setLoading(false); return; }
    if (businessId) { loadTickets(); } else { setLoading(false); }
  }, [businessId, demoMode]);

  const loadTickets = async () => {
    if (demoMode || !businessId) return;
    const { data, error } = await (supabase as any).from("business_support_tickets").select("*").eq("business_id", businessId).order("created_at", { ascending: false });
    if (error) { console.error(error); toast.error("Failed to load tickets"); }
    else { setTickets((data || []).map((d: any) => ({ ...d, ticket_number: d.id.slice(0, 8), ticket_type: "general", description: d.message, customer_phone: null, admin_notes: null, business_response: d.admin_response, resolved_at: null }))); }
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open": return <Badge variant="destructive" className="flex gap-1"><AlertCircle className="h-3 w-3" />Open</Badge>;
      case "in_progress": return <Badge variant="secondary" className="flex gap-1"><Clock className="h-3 w-3" />In Progress</Badge>;
      case "resolved": return <Badge variant="default" className="bg-green-500 hover:bg-green-600 flex gap-1"><CheckCircle2 className="h-3 w-3" />Resolved</Badge>;
      case "closed": return <Badge variant="outline" className="flex gap-1"><XCircle className="h-3 w-3" />Closed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleSendResponse = async () => {
    if (!selectedTicket || !responseText.trim()) return;
    setSending(true);
    if (demoMode) {
      setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, business_response: responseText, status: "in_progress", updated_at: new Date().toISOString() } : t));
      toast.success("Response sent (demo)");
      setResponseText(""); setSelectedTicket(null); setSending(false);
      return;
    }
    const { error } = await (supabase as any).from("business_support_tickets").update({ admin_response: responseText, status: "in_progress", updated_at: new Date().toISOString() }).eq("id", selectedTicket.id);
    if (error) { toast.error("Failed to send response"); }
    else { toast.success("Response sent"); loadTickets(); setResponseText(""); setSelectedTicket(null); }
    setSending(false);
  };

  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    if (demoMode) {
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus, updated_at: new Date().toISOString() } : t));
      toast.success("Status updated (demo)"); return;
    }
    const { error } = await (supabase as any).from("business_support_tickets").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", ticketId);
    if (error) { toast.error("Failed to update status"); } else { toast.success("Status updated"); loadTickets(); }
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) || t.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) || t.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!businessId) { return <Card className="bg-card/50 border-border/50"><CardContent className="p-8 text-center"><MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">Please set up your store settings first.</p></CardContent></Card>; }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h2 className="text-xl font-semibold">Support Tickets</h2><p className="text-sm text-muted-foreground">Manage customer inquiries</p></div>
        <div className="flex items-center gap-2">
          <div className="relative"><Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search tickets..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-64" /></div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Filter Status" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="open">Open</SelectItem><SelectItem value="in_progress">In Progress</SelectItem><SelectItem value="resolved">Resolved</SelectItem><SelectItem value="closed">Closed</SelectItem></SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Open Tickets</p><p className="text-2xl font-bold text-red-500">{tickets.filter(t => t.status === "open").length}</p></CardContent></Card>
        <Card className="bg-card/50 border-border/50"><CardContent className="p-4"><p className="text-sm text-muted-foreground">In Progress</p><p className="text-2xl font-bold text-amber-500">{tickets.filter(t => t.status === "in_progress").length}</p></CardContent></Card>
        <Card className="bg-card/50 border-border/50"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Resolved</p><p className="text-2xl font-bold text-green-500">{tickets.filter(t => t.status === "resolved").length}</p></CardContent></Card>
        <Card className="bg-card/50 border-border/50"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Avg Response Time</p><p className="text-2xl font-bold text-primary">2.4h</p></CardContent></Card>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-0">
          {loading ? <div className="p-8 text-center text-muted-foreground">Loading...</div> : filteredTickets.length === 0 ? (
            <div className="p-8 text-center"><MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">No tickets found.</p></div>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Ticket #</TableHead><TableHead>Customer</TableHead><TableHead>Subject</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-mono font-medium">{ticket.ticket_number}</TableCell>
                    <TableCell><div className="font-medium">{ticket.customer_name}</div><div className="text-xs text-muted-foreground">{ticket.customer_email}</div></TableCell>
                    <TableCell><div className="font-medium truncate max-w-[200px]">{ticket.subject}</div></TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{format(new Date(ticket.created_at), "MMM d")}</TableCell>
                    <TableCell className="text-right"><Button variant="outline" size="sm" onClick={() => setSelectedTicket(ticket)}>View</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Ticket Details</DialogTitle></DialogHeader>
          {selectedTicket && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{selectedTicket.subject}</h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <span>{selectedTicket.ticket_number}</span>•<span>{format(new Date(selectedTicket.created_at), "PPP p")}</span>
                  </div>
                </div>
                <Select value={selectedTicket.status} onValueChange={(val) => handleUpdateStatus(selectedTicket.id, val)}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="open">Open</SelectItem><SelectItem value="in_progress">In Progress</SelectItem><SelectItem value="resolved">Resolved</SelectItem><SelectItem value="closed">Closed</SelectItem></SelectContent>
                </Select>
              </div>

              <Card className="bg-muted/30">
                <CardContent className="p-4 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{selectedTicket.customer_name}</span>
                    <span className="text-muted-foreground">{selectedTicket.customer_email}</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{selectedTicket.description}</p>
                </CardContent>
              </Card>

              {selectedTicket.business_response && (
                <div className="pl-8 border-l-2 border-primary/20 space-y-2">
                  <p className="text-xs font-medium text-primary">Your Response</p>
                  <Card className="bg-primary/5 border-primary/10">
                    <CardContent className="p-4 text-sm whitespace-pre-wrap">{selectedTicket.business_response}</CardContent>
                  </Card>
                </div>
              )}

              {!selectedTicket.business_response && (
                <div className="space-y-2">
                  <Label>Reply to Customer</Label>
                  <Textarea placeholder="Type your response here..." value={responseText} onChange={(e) => setResponseText(e.target.value)} rows={4} />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setSelectedTicket(null)}>Cancel</Button>
                    <Button onClick={handleSendResponse} disabled={sending || !responseText.trim()}>{sending ? "Sending..." : <><Send className="h-4 w-4 mr-2" />Send Response</>}</Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
