import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { 
  MessageCircle, 
  Send, 
  Loader2, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  HardDrive,
  Lightbulb,
  FolderOpen,
  Package,
  Lock,
  CreditCard,
  Users,
  Shield,
  Link,
  Eye,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";

interface CreatorHelpTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileId: string | null;
}

interface Ticket {
  id: string;
  ticket_number: string;
  subject: string;
  message: string;
  category: string;
  status: string;
  priority: string;
  admin_response: string | null;
  responded_at: string | null;
  created_at: string;
}

const CATEGORIES = [
  { value: "cdn", label: "CDN Setup" },
  { value: "uploads", label: "Uploads & Storage" },
  { value: "embedding", label: "Embedding Issues" },
  { value: "payments", label: "Payment Questions" },
  { value: "account", label: "Account Help" },
  { value: "general", label: "General Question" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  open: { label: "Open", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: Clock },
  in_progress: { label: "In Progress", color: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: AlertCircle },
  resolved: { label: "Resolved", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: CheckCircle2 },
};

export default function CreatorHelpTicketModal({
  open,
  onOpenChange,
  profileId,
}: CreatorHelpTicketModalProps) {
  const [activeTab, setActiveTab] = useState("new");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("general");

  useEffect(() => {
    if (open && profileId) {
      fetchTickets();
    }
  }, [open, profileId]);

  const fetchTickets = async () => {
    if (!profileId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("embed_pro_support_tickets" as any)
        .select("*")
        .eq("embed_profile_id", profileId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTickets((data as any[]) || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!profileId) {
      toast.error("Please sign in to submit a ticket");
      return;
    }

    if (!subject.trim()) {
      toast.error("Subject is required");
      return;
    }

    if (!message.trim()) {
      toast.error("Message is required");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("embed_pro_support_tickets" as any)
        .insert({
          embed_profile_id: profileId,
          subject,
          description: message,
          category,
          ticket_number: "TEMP", // Will be replaced by trigger
        });

      if (error) throw error;

      toast.success("Support ticket submitted! Admin will respond soon.");
      setSubject("");
      setMessage("");
      setCategory("general");
      fetchTickets();
      setActiveTab("history");
    } catch (error) {
      console.error("Error submitting ticket:", error);
      toast.error("Failed to submit ticket");
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryLabel = (value: string) => {
    return CATEGORIES.find(c => c.value === value)?.label || value;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MessageCircle className="h-6 w-6 text-violet-500" />
            Help & Support
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Get help with CDN setup, uploads, or any other questions
          </p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="new">New Ticket</TabsTrigger>
            <TabsTrigger value="history">My Tickets</TabsTrigger>
            <TabsTrigger value="guides">Quick Guides</TabsTrigger>
          </TabsList>

          {/* New Ticket Tab */}
          <TabsContent value="new" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Subject *</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief description of your issue"
              />
            </div>

            <div className="space-y-2">
              <Label>Message *</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue in detail. Include any error messages or steps you've tried."
                rows={6}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full gap-2 bg-violet-500 hover:bg-violet-600"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Ticket
                </>
              )}
            </Button>
          </TabsContent>

          {/* Ticket History Tab */}
          <TabsContent value="history" className="space-y-4 mt-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <HelpCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No support tickets yet</p>
                <p className="text-sm">Submit a ticket to get help from admin</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket) => {
                  const statusConfig = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <div
                      key={ticket.id}
                      className="p-4 rounded-lg border border-border bg-card/50 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {ticket.ticket_number}
                            </Badge>
                            <Badge className={statusConfig.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig.label}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {getCategoryLabel(ticket.category)}
                            </Badge>
                          </div>
                          <h4 className="font-medium mt-2 truncate">{ticket.subject}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {ticket.message}
                          </p>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Submitted: {format(new Date(ticket.created_at), "MMM d, yyyy 'at' h:mm a")}
                      </div>

                      {ticket.admin_response && (
                        <div className="mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                          <div className="flex items-center gap-2 text-sm font-medium text-emerald-400 mb-1">
                            <CheckCircle2 className="h-4 w-4" />
                            Admin Response
                          </div>
                          <p className="text-sm text-foreground">{ticket.admin_response}</p>
                          {ticket.responded_at && (
                            <div className="text-xs text-muted-foreground mt-2">
                              Responded: {format(new Date(ticket.responded_at), "MMM d, yyyy 'at' h:mm a")}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Quick Guides Tab */}
          <TabsContent value="guides" className="space-y-4 mt-4">
            <Accordion type="single" collapsible className="w-full">
              {/* 1. Maximizing Your Storage */}
              <AccordionItem value="storage">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5 text-amber-500" />
                    Maximizing Your Storage
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-sm text-muted-foreground">
                  <p>Your VOD Pro subscription includes 25GB of CDN storage, but you can dramatically expand your library using a hybrid approach:</p>
                  
                  <div className="space-y-3">
                    <p className="text-emerald-400 font-medium">✓ CDN Storage (25GB included)</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Best for premium content requiring DRM protection</li>
                      <li>Adaptive streaming (HLS) for all devices</li>
                      <li>Fastest loading times with global CDN</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-violet-400 font-medium">✓ YouTube (Private/Unlisted)</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Unlimited storage at no extra cost</li>
                      <li>Upload to YouTube as "Unlisted" or "Private"</li>
                      <li>Import the embed URL into your channel</li>
                      <li>Viewers only see content on YOUR branded channel</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-cyan-400 font-medium">✓ Vimeo Pro/Business</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Professional quality with privacy controls</li>
                      <li>Domain-level embedding restrictions</li>
                      <li>Great for exclusive content</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-blue-400 font-medium">✓ AWS S3 / CloudFront</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>For tech-savvy creators with large libraries</li>
                      <li>Pay only for what you use</li>
                      <li>Use direct MP4 or HLS stream URLs</li>
                    </ul>
                  </div>
                  
                  <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <p className="text-amber-400 font-medium">💡 Pro Tip:</p>
                    <p className="text-sm">Use CDN storage for your most valuable content (paid courses, premium series) and external sources for free/promotional content. This maximizes your storage while keeping premium content secure.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 2. Planning Your Channel Before Launch */}
              <AccordionItem value="planning">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-400" />
                    Planning Your Channel Before Launch
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-sm text-muted-foreground">
                  <p>Take time to plan your channel structure before going live. A well-organized channel converts better!</p>
                  
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <p className="font-medium text-foreground">1. Define Your Content Categories</p>
                    <p className="text-sm mt-1">Group similar content together. Example for a church: Sermons, Worship Sessions, Bible Studies, Youth Content</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <p className="font-medium text-foreground">2. Plan Your Pricing Tiers</p>
                    <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                      <li><span className="text-emerald-400 font-medium">Free Content:</span> Teasers, trailers, promotional clips</li>
                      <li><span className="text-blue-400 font-medium">Subscription:</span> Regular content for monthly subscribers</li>
                      <li><span className="text-amber-400 font-medium">Single Purchase:</span> Premium events or exclusive series</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <p className="font-medium text-foreground">3. Create Parent & Sub-Channels</p>
                    <p className="text-sm mt-1">Use the hierarchy: Parent Channel → Sub-channels (folders). Viewers can subscribe to the full package or individual sub-channels.</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <p className="font-medium text-foreground">4. Prepare Your Branding</p>
                    <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                      <li>Channel thumbnail (1280x720 recommended)</li>
                      <li>Compelling description for each channel</li>
                      <li>Consistent naming convention</li>
                    </ul>
                  </div>
                  
                  <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-emerald-400 font-medium">✓ Best Practice:</p>
                    <p className="text-sm">Upload and organize ALL your content in the Media Upload step before creating channels. Then use the Channel Manager to assign content to the appropriate sub-channels.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 3. Your Content Library & Media Dump */}
              <AccordionItem value="library">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-cyan-500" />
                    Your Content Library & Media Dump
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-sm text-muted-foreground">
                  <p>Understanding how your content flows through the system:</p>
                  
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <p className="font-medium text-cyan-400">Step 1: Media Upload (Media Dump)</p>
                    <p className="text-sm mt-1">All uploaded content first goes to your "Media Dump" - a central library of all your videos. This is where you can see all your uploaded content regardless of channel assignment.</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <p className="font-medium text-violet-400">Step 2: Content Cards</p>
                    <p className="text-sm mt-1">Add thumbnails, descriptions, and metadata to each piece of content. AI-generated thumbnails are available here.</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <p className="font-medium text-blue-400">Step 3: Channel Assignment</p>
                    <p className="text-sm mt-1">Use the Channel Content Picker to assign content from your library to specific channels. Content can exist in multiple channels.</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <p className="font-medium text-amber-400">Step 4: Playlists</p>
                    <p className="text-sm mt-1">Create playlists to group content for sequential viewing (e.g., a course with episodes in order).</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <p className="font-medium text-emerald-400">Step 5: Publish</p>
                    <p className="text-sm mt-1">Submit content for admin review. Once approved, it goes live on your branded channel.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 4. Your Branded Channel Experience */}
              <AccordionItem value="branded">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-violet-500" />
                    Your Branded Channel Experience
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-sm text-muted-foreground">
                  <p>Viewers experience your content exclusively on YOUR branded channel:</p>
                  
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>Your channel has a unique URL that you can share</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>Content from YouTube/Vimeo appears embedded in YOUR player, not on external sites</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>Viewers cannot access content outside your channel (private/unlisted external videos)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>Your branding, thumbnails, and descriptions are what viewers see</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>Payment and access is controlled through YOUR subscription system</span>
                    </li>
                  </ul>
                  
                  <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <p className="font-medium text-blue-400">Channel URL:</p>
                    <p className="text-sm mt-1">Your channel will be available at: <code className="bg-muted px-2 py-0.5 rounded">/channel/[your-channel-id]</code></p>
                    <p className="text-xs mt-2 text-muted-foreground">Share this link on social media, your website, or via email to your audience.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 5. Viewer Access & Permissions */}
              <AccordionItem value="access">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-red-400" />
                    Viewer Access & Permissions
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-sm text-muted-foreground">
                  <p>How viewers gain access to your content:</p>
                  
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-amber-400 font-medium">🔓 Free Content</p>
                    <p className="text-sm mt-1">Content marked as "Free" is immediately accessible to anyone who visits your channel. No login required.</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <p className="text-yellow-400 font-medium">🔐 Subscription Content</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2 mt-2">
                      <li>Viewer clicks "Subscribe" on your channel</li>
                      <li>They complete payment via PayFast</li>
                      <li>Access is granted <strong>automatically</strong> upon payment confirmation</li>
                      <li>Subscription is stored in their profile</li>
                      <li>Access continues until subscription expires</li>
                    </ol>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <p className="text-amber-400 font-medium">💳 Single Purchase (One-Time Access)</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2 mt-2">
                      <li>Viewer clicks "Buy" on the specific content</li>
                      <li>They complete one-time payment</li>
                      <li>Access is granted <strong>automatically</strong> for 30 days (default)</li>
                      <li>View-only access (no download unless you enable it)</li>
                    </ol>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <p className="font-medium text-foreground">Access Duration Settings:</p>
                    <p className="text-sm mt-1">By default, purchased content is accessible for 30 days with view-only permissions. You can configure this per channel or content item in the Channel Manager.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 6. Payment & Access Notifications */}
              <AccordionItem value="payments">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-emerald-500" />
                    Payment & Access Notifications
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-sm text-muted-foreground">
                  <p>How the payment-to-access flow works:</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-violet-400 font-bold text-sm">1</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Viewer Makes Payment</p>
                        <p className="text-sm">They're redirected to PayFast to complete payment securely.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-400 font-bold text-sm">2</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Automatic Webhook Processing</p>
                        <p className="text-sm">PayFast sends a confirmation to our system (this happens instantly).</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-emerald-400 font-bold text-sm">3</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Access Granted Immediately</p>
                        <p className="text-sm">The viewer's subscription/purchase is recorded in the database and they can immediately access the content.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-cyan-400 font-bold text-sm">4</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Confirmation</p>
                        <p className="text-sm">Viewer sees a success message and is redirected to the content. No manual activation required!</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-emerald-400 font-medium">✓ Fully Automatic</p>
                    <p className="text-sm">You don't need to manually approve or activate access. The system handles everything automatically via secure webhooks.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 7. Viewer Subscription Management */}
              <AccordionItem value="subscriptions">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    Viewer Subscription Management
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-sm text-muted-foreground">
                  <p>How viewers manage their subscriptions:</p>
                  
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <p className="font-medium text-foreground">Viewing All Subscriptions</p>
                    <p className="text-sm mt-1">Viewers can see all their active subscriptions in their Profile page under "My Subscriptions". This shows:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                      <li>Channel subscriptions (monthly/yearly)</li>
                      <li>Bundle subscriptions</li>
                      <li>Single purchases with expiry dates</li>
                      <li>Subscription status (active, expired, cancelled)</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <p className="font-medium text-foreground">Subscription Details Shown:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                      <li>Channel/content name and thumbnail</li>
                      <li>Start date and expiry date</li>
                      <li>Amount paid and billing type</li>
                      <li>Cancel or renew options</li>
                    </ul>
                  </div>
                  
                  <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <p className="text-blue-400 font-medium">For Creators:</p>
                    <p className="text-sm">You can view all your subscribers in the CRM section of your Creator Dashboard. This shows subscriber details, payment history, and allows you to manage their access.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 8. Content Protection (No DRM) */}
              <AccordionItem value="drm">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-cyan-400" />
                    Content Protection
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-sm text-muted-foreground">
                  <p>Understanding how your content is protected in Embed Pro:</p>
                  
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-red-400 font-medium flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      DRM is NOT Available for Embed Pro
                    </p>
                    <p className="text-sm mt-1">Embed Pro uses embedded content from external platforms (YouTube, Vimeo, etc.) which do not support DRM through our system. DRM is only available for VOD Pro tier with direct CDN uploads.</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-emerald-400 font-medium">How to Protect Your Embed Pro Content</p>
                    <p className="text-sm mt-1">Instead of DRM, use these protection methods:</p>
                    <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
                      <li><strong className="text-foreground">Generated Password (72 Hours)</strong> - Apply a time-limited password to your content. Viewers must enter the password to access, and it expires after 72 hours for added security.</li>
                      <li><strong className="text-foreground">Disable Right-Click Download</strong> - Prevents viewers from using right-click context menu to download or save content. This is enabled by default on all Embed Pro content.</li>
                      <li><strong className="text-foreground">Domain Restrictions</strong> - On Vimeo Pro, restrict embedding to specific domains only.</li>
                      <li><strong className="text-foreground">Unlisted/Private Settings</strong> - Set your YouTube/Vimeo content to Unlisted or Private so it's only accessible through your channels.</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <p className="text-amber-400 font-medium">Access Control = Your Primary Protection</p>
                    <p className="text-sm mt-1">Regardless of other protections, access is controlled through:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                      <li>Channel subscription status</li>
                      <li>Single purchase verification</li>
                      <li>Access expiry dates (30-day rentals)</li>
                      <li>View-only permissions (no downloads)</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <p className="font-medium text-foreground">Summary:</p>
                    <p className="text-sm mt-1">Embed Pro content is protected through password generation (72-hour expiry), disabled right-click, and subscription-based access control. For full DRM protection (Widevine, FairPlay, PlayReady), upgrade to VOD Pro with direct CDN uploads.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 9. Supported Embed Formats */}
              <AccordionItem value="formats">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <Link className="h-5 w-5 text-pink-500" />
                    Supported Embed Formats
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-sm text-muted-foreground">
                  <p>Our player supports multiple embed formats:</p>
                  
                  <ul className="space-y-2">
                    <li><strong className="text-foreground">HLS streams</strong> (.m3u8) - Best for adaptive streaming</li>
                    <li><strong className="text-foreground">Direct MP4</strong> - Standard video files</li>
                    <li><strong className="text-foreground">YouTube</strong> - Paste video or playlist URL</li>
                    <li><strong className="text-foreground">Vimeo</strong> - Regular or Pro embed URLs</li>
                    <li><strong className="text-foreground">Facebook Video</strong> - Public video URLs</li>
                    <li><strong className="text-foreground">SoundCloud</strong> - Audio tracks and playlists</li>
                    <li><strong className="text-foreground">Audio files</strong> - MP3, WAV, M4A supported</li>
                  </ul>
                  
                  <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                      <p className="text-amber-400 font-medium">Not Supported:</p>
                    </div>
                    <p className="text-sm mt-1">TikTok and Instagram URLs are not supported due to platform restrictions.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 10. How Pricing & Payouts Work */}
              <AccordionItem value="pricing">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-amber-500" />
                    How Pricing & Payouts Work
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-sm text-muted-foreground">
                  <p>For single purchases and subscription content, pricing is calculated as:</p>
                  
                  <ul className="space-y-2">
                    <li><strong className="text-violet-400">Your Base Price</strong> - What you set in ZAR (R)</li>
                    <li><strong className="text-blue-400">+ 15% VAT</strong> - South African tax requirement</li>
                    <li><strong className="text-amber-400">+ 6% Commission</strong> - Platform fee</li>
                  </ul>
                  
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <p className="font-medium text-foreground">Example:</p>
                    <p className="text-sm mt-1">R100 base price = R121.90 customer price</p>
                    <p className="text-emerald-400 font-medium mt-1">You receive: R94 (94% of base price)</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <p className="font-medium text-foreground">Default Access Terms:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                      <li>Single purchases: 30-day access</li>
                      <li>View-only (no download by default)</li>
                      <li>Subscriptions: Until expiry/cancellation</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
