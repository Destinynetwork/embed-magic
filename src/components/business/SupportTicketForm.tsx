import { useState, useEffect } from "react";
import { HelpCircle, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const CATEGORIES = [
  { value: "store_setup", label: "Store Setup" },
  { value: "products", label: "Products & Inventory" },
  { value: "orders", label: "Orders & Shipping" },
  { value: "payments", label: "Payments & Payouts" },
  { value: "kyc", label: "KYC & Verification" },
  { value: "other", label: "Other" },
];

export default function SupportTicketForm({ onSuccess }: { onSuccess?: () => void }) {
  const { profile, isDemoMode } = useAuth();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!profile?.id) { toast.error("Please sign in"); return; }
    if (!category || !subject.trim() || !message.trim()) { toast.error("Please fill in all fields"); return; }
    
    setLoading(true);
    
    if (isDemoMode) {
      setTimeout(() => {
        toast.success("Ticket submitted (demo mode)");
        setCategory(""); setSubject(""); setMessage("");
        setLoading(false);
        onSuccess?.();
      }, 1000);
      return;
    }

    const { error } = await (supabase as any).from("business_support_tickets").insert({
      business_id: profile.id, // Using profile ID as business ID for simplicity in this context
      subject: subject.trim(),
      message: message.trim(),
      priority: "normal",
      status: "open",
      // admin_response and other fields have defaults
    });

    if (error) {
      console.error(error);
      toast.error("Failed to submit ticket");
    } else {
      toast.success("Support ticket submitted successfully");
      setCategory(""); setSubject(""); setMessage("");
      onSuccess?.();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
          <SelectContent>{CATEGORIES.map((cat) => <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Subject</Label>
        <Input placeholder="Brief description of your issue" value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Message</Label>
        <Textarea placeholder="Describe your issue in detail..." value={message} onChange={(e) => setMessage(e.target.value)} rows={5} />
      </div>
      <Button onClick={handleSubmit} disabled={loading || !category || !subject.trim() || !message.trim()} className="w-full">
        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Submit Ticket
      </Button>
    </div>
  );
}
