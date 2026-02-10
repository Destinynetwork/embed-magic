import { useState } from "react";
import { HelpCircle, Send, MessageSquare, Phone, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface CustomerSupportSectionProps { onBack: () => void; }

const ticketCategories = [
  { value: "general", label: "General Support" },
  { value: "technical", label: "Technical Issue" },
  { value: "billing", label: "Billing Inquiry" },
  { value: "products", label: "Product Question" },
  { value: "account", label: "Account Help" },
];

export default function CustomerSupportSection({ onBack }: CustomerSupportSectionProps) {
  const { profile } = useAuth();
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // Cast profile to any to avoid type errors with potential missing properties
  const userProfile = profile as any;
  const [ticketForm, setTicketForm] = useState({ 
    name: userProfile?.display_name || userProfile?.full_name || "", 
    email: userProfile?.email || "", 
    phone: userProfile?.phone || "", 
    category: "general", 
    subject: "", 
    message: "" 
  });

  const handleSubmitTicket = async () => {
    if (!ticketForm.name || !ticketForm.email || !ticketForm.subject || !ticketForm.message) { toast.error("Please fill in all required fields"); return; }
    setSubmitting(true);
    toast.success("Support ticket submitted");
    setIsTicketModalOpen(false);
    setTicketForm(prev => ({ ...prev, subject: "", message: "" }));
    setSubmitting(false);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <Button variant="ghost" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
        <h1 className="text-3xl font-bold text-foreground">Customer Support</h1>
        <p className="text-muted-foreground">How can we help you today?</p>
      </div>
      <Card className="bg-gradient-to-br from-primary/20 to-purple-500/20 border-primary/30">
        <CardContent className="p-8 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center"><HelpCircle className="h-8 w-8 text-primary" /></div>
          <h2 className="text-xl font-semibold text-foreground">Need Help?</h2>
          <p className="text-muted-foreground">Submit a support ticket and our team will respond within 24 hours</p>
          <Dialog open={isTicketModalOpen} onOpenChange={setIsTicketModalOpen}>
            <DialogTrigger asChild><Button className="bg-primary hover:bg-primary/90"><Send className="h-4 w-4 mr-2" />Submit Support Ticket</Button></DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Submit Support Ticket</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Your Name *</Label><Input value={ticketForm.name} onChange={(e) => setTicketForm(prev => ({ ...prev, name: e.target.value }))} /></div>
                  <div className="space-y-2"><Label>Email *</Label><Input type="email" value={ticketForm.email} onChange={(e) => setTicketForm(prev => ({ ...prev, email: e.target.value }))} /></div>
                </div>
                <div className="space-y-2"><Label>Category *</Label><Select value={ticketForm.category} onValueChange={(value) => setTicketForm(prev => ({ ...prev, category: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{ticketCategories.map((cat) => <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Subject *</Label><Input placeholder="Brief description" value={ticketForm.subject} onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Message *</Label><Textarea placeholder="Describe your issue..." className="min-h-[120px]" value={ticketForm.message} onChange={(e) => setTicketForm(prev => ({ ...prev, message: e.target.value }))} /></div>
                <div className="flex gap-3 pt-2"><Button variant="outline" className="flex-1" onClick={() => setIsTicketModalOpen(false)}>Cancel</Button><Button className="flex-1 bg-primary" onClick={handleSubmitTicket} disabled={submitting}>{submitting ? "Submitting..." : "Submit Ticket"}</Button></div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border/50"><CardContent className="p-6 text-center space-y-3"><MessageSquare className="h-8 w-8 text-primary mx-auto" /><h3 className="font-semibold text-foreground">WhatsApp</h3><p className="text-sm text-muted-foreground">Chat with us</p><Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => window.open("https://wa.me/27101234567", "_blank")}>Chat Now</Button></CardContent></Card>
        <Card className="bg-card/50 border-border/50"><CardContent className="p-6 text-center space-y-3"><Phone className="h-8 w-8 text-primary mx-auto" /><h3 className="font-semibold text-foreground">Phone</h3><p className="text-sm text-muted-foreground">Call us</p><Button size="sm" variant="outline" onClick={() => window.open("tel:+27101234567")}>Call Us</Button></CardContent></Card>
        <Card className="bg-card/50 border-border/50"><CardContent className="p-6 text-center space-y-3"><Mail className="h-8 w-8 text-primary mx-auto" /><h3 className="font-semibold text-foreground">Email</h3><p className="text-sm text-muted-foreground">Email us</p><Button size="sm" variant="outline" onClick={() => window.open("mailto:support@supaviewtv.co.za")}>Email Us</Button></CardContent></Card>
      </div>
    </div>
  );
}
