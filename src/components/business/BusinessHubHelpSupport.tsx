import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HelpCircle, CheckCircle, Store, Package, Tag, ShoppingCart, Truck, FileText, Shield, CreditCard, MessageSquare, Clock, AlertCircle, Loader2, CheckCircle2, XCircle, Mail, Rocket } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface BusinessHubHelpSupportProps { open: boolean; onOpenChange: (open: boolean) => void; profileId: string | null; }

interface Ticket { id: string; ticket_number: string; subject: string; message: string; category: string; status: string; priority: string; admin_response: string | null; responded_at: string | null; created_at: string; }

const CATEGORIES = [
  { value: "store_setup", label: "Store Setup" },
  { value: "products", label: "Products & Inventory" },
  { value: "orders", label: "Orders & Shipping" },
  { value: "payments", label: "Payments & Payouts" },
  { value: "kyc", label: "KYC & Verification" },
  { value: "other", label: "Other" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; Icon: React.ElementType }> = {
  open: { label: "Open", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", Icon: Clock },
  in_progress: { label: "In Progress", color: "bg-amber-500/20 text-amber-400 border-amber-500/30", Icon: AlertCircle },
  resolved: { label: "Resolved", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", Icon: CheckCircle2 },
  closed: { label: "Closed", color: "bg-gray-500/20 text-gray-400 border-gray-500/30", Icon: XCircle },
};

export default function BusinessHubHelpSupport({ open, onOpenChange, profileId }: BusinessHubHelpSupportProps) {
  const { isDemoMode } = useAuth();
  const [activeTab, setActiveTab] = useState("guides");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const fetchTickets = async () => {
    if (!profileId || isDemoMode) return;
    setLoading(true);
    const { data, error } = await supabase.from("business_support_tickets").select("*").eq("business_id", profileId).order("created_at", { ascending: false });
    if (error) { console.error(error); }
    else { setTickets((data || []).map((d: any) => ({ ...d, ticket_number: d.id?.slice(0, 8) ?? "", category: d.priority ?? "general", message: d.message ?? "", responded_at: null }))); }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!profileId) { toast.error("Please sign in"); return; }
    if (!category || !subject.trim() || !message.trim()) { toast.error("Please fill in all fields"); return; }
    if (isDemoMode) { toast.success("Demo: Ticket submitted"); setCategory(""); setSubject(""); setMessage(""); setActiveTab("tickets"); return; }
    setSubmitting(true);
    const { error } = await supabase.from("business_support_tickets").insert({ business_id: profileId, subject: subject.trim(), message: message.trim(), priority: "normal", status: "open" });
    if (error) { toast.error("Failed to submit ticket"); } else { toast.success("Ticket submitted"); setCategory(""); setSubject(""); setMessage(""); fetchTickets(); setActiveTab("tickets"); }
    setSubmitting(false);
  };

  const getCategoryLabel = (value: string) => CATEGORIES.find((c) => c.value === value)?.label || value;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader><DialogTitle className="flex items-center gap-2 text-xl"><HelpCircle className="h-5 w-5 text-primary" />Business Hub Help & Support</DialogTitle></DialogHeader>
        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); if (v === "tickets") fetchTickets(); }} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="new-ticket">New Ticket</TabsTrigger>
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
            <TabsTrigger value="guides">Quick Guides</TabsTrigger>
          </TabsList>
          <TabsContent value="new-ticket" className="flex-1 space-y-4">
            <div className="space-y-4">
              <div className="space-y-2"><Label>Category</Label><Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger><SelectContent>{CATEGORIES.map((cat) => <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Subject</Label><Input placeholder="Brief description" value={subject} onChange={(e) => setSubject(e.target.value)} /></div>
              <div className="space-y-2"><Label>Message</Label><Textarea placeholder="Describe your issue..." value={message} onChange={(e) => setMessage(e.target.value)} rows={5} /></div>
              <Button onClick={handleSubmit} disabled={submitting || !category || !subject.trim() || !message.trim()} className="w-full">{submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Submit Ticket</Button>
            </div>
          </TabsContent>
          <TabsContent value="tickets" className="flex-1 min-h-0">
            <ScrollArea className="h-[400px] pr-4">
              {loading ? <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div> : tickets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground"><MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" /><p>No support tickets yet</p></div>
              ) : (
                <div className="space-y-3">{tickets.map((ticket) => { const sc = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open; return (
                  <div key={ticket.id} className="p-4 rounded-lg bg-card/50 border border-border/50 space-y-2">
                    <div className="flex items-start justify-between"><div><div className="flex items-center gap-2 mb-1"><Badge variant="outline" className="text-xs">{ticket.ticket_number}</Badge><Badge className={sc.color}><sc.Icon className="h-3 w-3 mr-1" />{sc.label}</Badge></div><h4 className="font-medium">{ticket.subject}</h4><p className="text-xs text-muted-foreground">{getCategoryLabel(ticket.category)} • {new Date(ticket.created_at).toLocaleDateString()}</p></div></div>
                    {ticket.admin_response && <div className="mt-3 p-3 rounded bg-emerald-500/10 border border-emerald-500/20"><p className="text-xs font-medium text-emerald-400 mb-1">Admin Response:</p><p className="text-sm text-muted-foreground">{ticket.admin_response}</p></div>}
                  </div>); })}</div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="guides" className="flex-1 min-h-0">
            <ScrollArea className="h-[400px] pr-4">
              <Accordion type="single" collapsible className="space-y-2">
                <AccordionItem value="getting-started" className="border border-border/50 rounded-lg px-4"><AccordionTrigger className="hover:no-underline"><div className="flex items-center gap-3"><Rocket className="h-4 w-4 text-emerald-400" /><span>Getting Started Checklist</span></div></AccordionTrigger><AccordionContent className="space-y-3 pb-4"><p className="text-sm text-muted-foreground">Complete these steps to launch your store:</p><div className="space-y-2 text-sm">{["Upload your store logo", "Set contact details (phone, email, WhatsApp)", "Add your first product", "Share your store link"].map((step) => <div key={step} className="flex items-start gap-2 p-3 rounded bg-card/50"><CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" /><span className="text-muted-foreground">{step}</span></div>)}</div></AccordionContent></AccordionItem>
                <AccordionItem value="store-settings" className="border border-border/50 rounded-lg px-4"><AccordionTrigger className="hover:no-underline"><div className="flex items-center gap-3"><Store className="h-4 w-4 text-primary" /><span>Store Settings & Branding</span></div></AccordionTrigger><AccordionContent className="pb-4"><p className="text-sm text-muted-foreground">Configure your store name, contact details, WhatsApp, and address in the Settings tab.</p></AccordionContent></AccordionItem>
                <AccordionItem value="products" className="border border-border/50 rounded-lg px-4"><AccordionTrigger className="hover:no-underline"><div className="flex items-center gap-3"><Package className="h-4 w-4 text-purple-400" /><span>Products Management</span></div></AccordionTrigger><AccordionContent className="pb-4"><p className="text-sm text-muted-foreground">Add products with SKU, price, description, and images. Set stock quantity and mark digital vs physical.</p></AccordionContent></AccordionItem>
                <AccordionItem value="discounts" className="border border-border/50 rounded-lg px-4"><AccordionTrigger className="hover:no-underline"><div className="flex items-center gap-3"><Tag className="h-4 w-4 text-amber-400" /><span>Discount Codes</span></div></AccordionTrigger><AccordionContent className="pb-4"><p className="text-sm text-muted-foreground">Create percentage or fixed-amount discount codes with usage limits and expiry dates.</p></AccordionContent></AccordionItem>
                <AccordionItem value="orders" className="border border-border/50 rounded-lg px-4"><AccordionTrigger className="hover:no-underline"><div className="flex items-center gap-3"><ShoppingCart className="h-4 w-4 text-primary" /><span>Orders & Fulfilment</span></div></AccordionTrigger><AccordionContent className="pb-4"><p className="text-sm text-muted-foreground">View orders, contact customers via email or WhatsApp, and track payment status.</p></AccordionContent></AccordionItem>
                <AccordionItem value="shipping" className="border border-border/50 rounded-lg px-4"><AccordionTrigger className="hover:no-underline"><div className="flex items-center gap-3"><Truck className="h-4 w-4 text-primary" /><span>Shipping & Waybills</span></div></AccordionTrigger><AccordionContent className="pb-4"><p className="text-sm text-muted-foreground">Add shipping companies, create waybills with tracking numbers, and notify customers.</p></AccordionContent></AccordionItem>
                <AccordionItem value="policies" className="border border-border/50 rounded-lg px-4"><AccordionTrigger className="hover:no-underline"><div className="flex items-center gap-3"><FileText className="h-4 w-4 text-primary" /><span>Store Policies</span></div></AccordionTrigger><AccordionContent className="pb-4"><p className="text-sm text-muted-foreground">Set up your Privacy, Refund, Shipping, Return, and Terms of Service policies using pre-written templates.</p></AccordionContent></AccordionItem>
              </Accordion>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
