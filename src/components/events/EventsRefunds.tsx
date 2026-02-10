import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { 
  RefreshCw, AlertTriangle, CheckCircle2, 
  Clock, Info, Wallet, Send
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { toast } from "sonner";

interface EventsRefundsProps {
  profileId: string;
}

interface RefundableTicket {
  id: string;
  event_id: string;
  event_title: string;
  buyer_name: string;
  buyer_email: string;
  price: number;
  ticket_tier: string | null;
  payment_status: string | null;
  payfast_reference: string | null;
  purchased_at: string | null;
  days_since_purchase: number;
  can_refund: boolean;
}

interface RefundRequest {
  id: string;
  ticket_id: string;
  reason: string | null;
  amount: number;
  status: string;
  admin_notes: string | null;
  requested_at: string;
  processed_at: string | null;
}

export function EventsRefunds({ profileId }: EventsRefundsProps) {
  const [tickets, setTickets] = useState<RefundableTicket[]>([]);
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<RefundableTicket | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadRefundableTickets();
    loadRefundRequests();
  }, [profileId]);

  const loadRefundableTickets = async () => {
    setLoading(true);

    // Get creator's events from creator_events table
    const { data: events } = await supabase
      .from("creator_events")
      .select("id, title")
      .eq("creator_id", profileId);

    if (!events || events.length === 0) {
      setTickets([]);
      setLoading(false);
      return;
    }

    const eventIds = events.map(e => e.id);

    // Note: Creator owns event data, full access granted
    // event_tickets_masked is available for cross-user contexts
    const { data: ticketsData } = await supabase
      .from("creator_event_tickets")
      .select("*")
      .in("event_id", eventIds)
      .in("payment_status", ["completed", "refund_requested", "refunded"])
      .order("purchased_at", { ascending: false });

    const enrichedTickets: RefundableTicket[] = (ticketsData || []).map(ticket => {
      const event = events.find(e => e.id === ticket.event_id);
      const daysSincePurchase = ticket.purchased_at 
        ? differenceInDays(new Date(), new Date(ticket.purchased_at))
        : 0;
      
      return {
        id: ticket.id,
        event_id: ticket.event_id,
        event_title: event?.title || "Unknown Event",
        buyer_name: ticket.buyer_name,
        buyer_email: ticket.buyer_email,
        price: ticket.price,
        ticket_tier: ticket.ticket_tier,
        payment_status: ticket.payment_status,
        payfast_reference: ticket.payfast_reference,
        purchased_at: ticket.purchased_at,
        days_since_purchase: daysSincePurchase,
        can_refund: daysSincePurchase <= 7 && ticket.payment_status === "completed",
      };
    });

    setTickets(enrichedTickets);
    setLoading(false);
  };

  const loadRefundRequests = async () => {
    const { data } = await supabase
      .from("admin_refund_requests")
      .select("*")
      .eq("creator_id", profileId)
      .order("requested_at", { ascending: false });

    setRefundRequests(data || []);
  };

  const handleRefundRequest = (ticket: RefundableTicket) => {
    setSelectedTicket(ticket);
    setRefundReason("");
    setShowRefundModal(true);
  };

  const submitRefundRequest = async () => {
    if (!selectedTicket) return;

    setProcessing(true);

    // Calculate refund amount (94% - creator's share)
    const refundAmount = selectedTicket.price * 0.94;

    // Create admin refund request
    const { error: requestError } = await supabase
      .from("admin_refund_requests")
      .insert({
        ticket_id: selectedTicket.id,
        creator_id: profileId,
        reason: refundReason || null,
        amount: refundAmount,
        payfast_reference: selectedTicket.payfast_reference,
        status: "pending",
      });

    if (requestError) {
      toast.error("Failed to submit refund request");
      setProcessing(false);
      return;
    }

    // Update ticket status
    const { error: ticketError } = await supabase
      .from("creator_event_tickets")
      .update({ payment_status: "refund_requested" })
      .eq("id", selectedTicket.id);

    if (ticketError) {
      toast.error("Failed to update ticket status");
      setProcessing(false);
      return;
    }

    toast.success("Refund request submitted to Admin for processing");
    setShowRefundModal(false);
    setSelectedTicket(null);
    loadRefundableTickets();
    loadRefundRequests();
    setProcessing(false);
  };

  const getStatusBadge = (status: string | null, canRefund: boolean) => {
    switch (status) {
      case "refund_requested":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Pending Admin</Badge>;
      case "refunded":
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Refunded</Badge>;
      case "completed":
        return canRefund 
          ? <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Eligible</Badge>
          : <Badge className="bg-muted/50 text-muted-foreground">Expired</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRequestStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Pending</Badge>;
      case "approved":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Approved</Badge>;
      case "processed":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Processed</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Stats
  const totalRefunded = tickets.filter(t => t.payment_status === "refunded").length;
  const pendingRefunds = refundRequests.filter(r => r.status === "pending").length;
  const eligibleForRefund = tickets.filter(t => t.can_refund).length;
  const refundedAmount = tickets
    .filter(t => t.payment_status === "refunded")
    .reduce((sum, t) => sum + (t.price * 0.94), 0);

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <Card className="bg-amber-500/10 border-amber-500/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-amber-300">Refund Policy</h4>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• <strong>7-day cooling-off period</strong> applies per Consumer Protection Act</li>
                <li>• Refund requests are submitted to <strong>Admin for processing</strong></li>
                <li>• <strong>6% platform commission is non-refundable</strong> - you receive 94% refund</li>
                <li>• Admin will process the refund via PayFast and notify you when complete</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Eligible for Refund</p>
            <p className="text-2xl font-bold text-emerald-400">{eligibleForRefund}</p>
            <p className="text-xs text-muted-foreground">within 7 days</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-amber-500/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pending with Admin</p>
            <p className="text-2xl font-bold text-amber-400">{pendingRefunds}</p>
            <p className="text-xs text-muted-foreground">awaiting processing</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-purple-500/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Refunded</p>
            <p className="text-2xl font-bold">{totalRefunded}</p>
            <p className="text-xs text-muted-foreground">tickets</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Refund Amount</p>
            <p className="text-2xl font-bold">R{refundedAmount.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">total refunded</p>
          </CardContent>
        </Card>
      </div>

      {/* My Refund Requests */}
      {refundRequests.length > 0 && (
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              My Refund Requests
            </CardTitle>
            <CardDescription>Track the status of your submitted refund requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Admin Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {refundRequests.map(request => {
                    const ticket = tickets.find(t => t.id === request.ticket_id);
                    return (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{ticket?.buyer_name || "Unknown"}</p>
                            <p className="text-xs text-muted-foreground">{ticket?.event_title}</p>
                          </div>
                        </TableCell>
                        <TableCell>R{request.amount.toFixed(2)}</TableCell>
                        <TableCell>{getRequestStatusBadge(request.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(request.requested_at), "MMM d, h:mm a")}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {request.admin_notes || "-"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tickets Table */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Refundable Tickets
          </CardTitle>
          <CardDescription>
            Tickets purchased within the last 7 days are eligible for refund
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No paid tickets found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Days Ago</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map(ticket => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium max-w-[150px] truncate">
                        {ticket.event_title}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{ticket.buyer_name}</p>
                          <p className="text-xs text-muted-foreground">{ticket.buyer_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {ticket.ticket_tier || "Adult"}
                        </Badge>
                      </TableCell>
                      <TableCell>R{ticket.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={ticket.days_since_purchase <= 7 ? "text-emerald-400" : "text-muted-foreground"}>
                          {ticket.days_since_purchase}d
                        </span>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(ticket.payment_status, ticket.can_refund)}
                      </TableCell>
                      <TableCell>
                        {ticket.payment_status === "completed" && ticket.can_refund && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRefundRequest(ticket)}
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Request
                          </Button>
                        )}
                        {ticket.payment_status === "refund_requested" && (
                          <div className="flex items-center gap-1 text-amber-400">
                            <Clock className="h-4 w-4" />
                            <span className="text-xs">Pending</span>
                          </div>
                        )}
                        {ticket.payment_status === "refunded" && (
                          <CheckCircle2 className="h-5 w-5 text-purple-400" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Refund Request Modal */}
      <Dialog open={showRefundModal} onOpenChange={setShowRefundModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Refund Request</DialogTitle>
            <DialogDescription>
              Your request will be sent to Admin for processing via PayFast.
            </DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                <p><strong>Event:</strong> {selectedTicket.event_title}</p>
                <p><strong>Buyer:</strong> {selectedTicket.buyer_name}</p>
                <p><strong>Email:</strong> {selectedTicket.buyer_email}</p>
                <p><strong>Amount:</strong> R{selectedTicket.price.toFixed(2)}</p>
                <p><strong>PayFast Ref:</strong> {selectedTicket.payfast_reference || "N/A"}</p>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-amber-400" />
                  <span className="font-medium text-amber-300">Refund Calculation</span>
                </div>
                <div className="text-sm space-y-1">
                  <p>Ticket Price: R{selectedTicket.price.toFixed(2)}</p>
                  <p>Platform Fee (6%): -R{(selectedTicket.price * 0.06).toFixed(2)} <span className="text-muted-foreground">(non-refundable)</span></p>
                  <p className="font-medium text-emerald-400">
                    Refund Amount: R{(selectedTicket.price * 0.94).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Reason for Refund (optional)</label>
                <Textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Enter reason for refund..."
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRefundModal(false)}>
              Cancel
            </Button>
            <Button onClick={submitRefundRequest} disabled={processing}>
              {processing ? "Submitting..." : "Submit to Admin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}