import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HelpCircle, ArrowLeft, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface EmbedProSupportSectionProps {
  profileId: string;
  onBack: () => void;
}

interface SupportTicket {
  id: string;
  ticket_number: string;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
}

export function EmbedProSupportSection({ profileId, onBack }: EmbedProSupportSectionProps) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, [profileId]);

  const loadTickets = async () => {
    try {
      const { data } = await supabase
        .from("embed_pro_support_tickets" as any)
        .select("id, ticket_number, subject, status, priority, created_at")
        .eq("embed_profile_id", profileId)
        .order("created_at", { ascending: false });

      setTickets((data as any[]) || []);
    } catch (err) {
      console.error("Error loading embed support tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open": return <Badge variant="outline" className="border-amber-500 text-amber-400"><AlertCircle className="h-3 w-3 mr-1" />Open</Badge>;
      case "in_progress": return <Badge variant="outline" className="border-blue-500 text-blue-400"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>;
      case "resolved": return <Badge variant="outline" className="border-emerald-500 text-emerald-400"><CheckCircle className="h-3 w-3 mr-1" />Resolved</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <HelpCircle className="h-8 w-8 text-indigo-500" />Support Center
          </h1>
          <p className="text-muted-foreground">Manage support tickets and inquiries</p>
        </div>
        <Button variant="outline" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-2" />Back to Hub</Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
        </div>
      ) : tickets.length === 0 ? (
        <Card className="bg-card/50 border-border/50">
          <CardContent className="py-12 text-center text-muted-foreground">
            <HelpCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No support tickets yet</p>
            <p className="text-sm">Tickets from your customers will appear here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="bg-card border-border">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{ticket.subject}</p>
                  <p className="text-sm text-muted-foreground">
                    {ticket.ticket_number} • {format(new Date(ticket.created_at), "MMM d, yyyy")}
                  </p>
                </div>
                {getStatusBadge(ticket.status)}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
