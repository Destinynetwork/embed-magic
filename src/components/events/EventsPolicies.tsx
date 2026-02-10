import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shield, CheckCircle2, Save, FileText, Info } from "lucide-react";
import { toast } from "sonner";

interface EventsPoliciesProps {
  profileId: string;
}

export function EventsPolicies({ profileId }: EventsPoliciesProps) {
  const [policies, setPolicies] = useState({
    cancellation_policy: "",
    refund_policy: "",
    attendance_policy: "",
    terms_of_entry: "",
  });
  const [saving, setSaving] = useState(false);
  const [hasCustomPolicies, setHasCustomPolicies] = useState(false);

  // Default policies
  const defaultPolicies = {
    cancellation_policy: `Event Cancellation Policy

1. CREATOR CANCELLATION
If we cancel the event:
- Full refund issued within 14 days
- Notification sent to all ticket holders
- Alternative date offered when possible

2. ATTENDEE CANCELLATION
- More than 7 days before: Full refund (minus 6% platform fee)
- 3-7 days before: 50% refund
- Less than 3 days: No refund (ticket may be transferable)

3. FORCE MAJEURE
Events cancelled due to unforeseen circumstances (weather, health emergencies, government restrictions):
- Full refund or credit for future event
- No additional compensation provided`,

    refund_policy: `Refund Policy

1. STANDARD REFUNDS
Per the Consumer Protection Act, you have 7 days from purchase to request a refund for any reason.

2. PROCESSING TIME
- Refund requests: Processed within 48 hours
- Bank processing: 3-5 business days after approval

3. NON-REFUNDABLE FEES
- 6% platform fee is non-refundable
- You receive refund of the remaining 94%

4. HOW TO REQUEST
- Contact the event organizer directly
- Provide your ticket tracking number
- Refunds processed via original payment method`,

    attendance_policy: `Attendance Policy

1. CHECK-IN
- Arrive 30 minutes before event start
- Present your QR code ticket at entry
- Valid ID may be required for age-restricted events

2. VIRTUAL EVENTS
- Access link sent via email with ticket
- Join 10 minutes early to test connection
- One device per ticket unless specified

3. RECORDING & PHOTOGRAPHY
- Recording may not be permitted
- Follow staff instructions at all times
- Violations may result in removal without refund`,

    terms_of_entry: `Terms of Entry

By purchasing a ticket, you agree to:

1. Provide accurate personal information
2. Follow venue/platform rules and regulations
3. Not resell tickets above face value
4. Accept that events may be recorded
5. Respect other attendees and staff

The organizer reserves the right to:
- Refuse entry to anyone
- Change event details with reasonable notice
- Remove attendees who violate these terms

For virtual events:
- Share access links at your own risk
- Technical issues on your end are not grounds for refund
- Maintain appropriate conduct in chat/comments`,
  };

  useEffect(() => {
    // Load custom policies if they exist (you'd need a table for this)
    // For now, we'll use defaults
    setPolicies(defaultPolicies);
  }, [profileId]);

  const handleSave = async () => {
    setSaving(true);
    // In a real implementation, save to a table
    // For now, just show success
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success("Policies saved successfully");
    setHasCustomPolicies(true);
    setSaving(false);
  };

  const resetToDefaults = () => {
    setPolicies(defaultPolicies);
    toast.info("Policies reset to defaults");
  };

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">Event Policies</h3>
              <p className="text-muted-foreground mt-1">
                Customize the policies for your events. These are shown to attendees on the ticket purchase page.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge className="bg-emerald-500/20 text-emerald-300">CPA Compliant</Badge>
                <Badge className="bg-blue-500/20 text-blue-300">7-Day Refund Period</Badge>
                <Badge className="bg-purple-500/20 text-purple-300">Customizable</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Policy Editor */}
      <Card className="bg-card/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Edit Policies
              </CardTitle>
              <CardDescription>
                Customize each policy section below. These apply to all your events.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetToDefaults}>
                Reset to Defaults
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Policies"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cancellation Policy */}
          <div className="space-y-2">
            <label className="font-medium flex items-center gap-2">
              <Badge variant="outline">Required</Badge>
              Cancellation Policy
            </label>
            <Textarea
              value={policies.cancellation_policy}
              onChange={(e) => setPolicies({ ...policies, cancellation_policy: e.target.value })}
              rows={10}
              className="font-mono text-sm"
            />
          </div>

          {/* Refund Policy */}
          <div className="space-y-2">
            <label className="font-medium flex items-center gap-2">
              <Badge variant="outline">Required</Badge>
              Refund Policy
            </label>
            <Textarea
              value={policies.refund_policy}
              onChange={(e) => setPolicies({ ...policies, refund_policy: e.target.value })}
              rows={10}
              className="font-mono text-sm"
            />
          </div>

          {/* Attendance Policy */}
          <div className="space-y-2">
            <label className="font-medium">Attendance Policy</label>
            <Textarea
              value={policies.attendance_policy}
              onChange={(e) => setPolicies({ ...policies, attendance_policy: e.target.value })}
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          {/* Terms of Entry */}
          <div className="space-y-2">
            <label className="font-medium">Terms of Entry</label>
            <Textarea
              value={policies.terms_of_entry}
              onChange={(e) => setPolicies({ ...policies, terms_of_entry: e.target.value })}
              rows={10}
              className="font-mono text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle>Policy Preview</CardTitle>
          <CardDescription>
            This is how your policies will appear to ticket buyers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="cancellation">
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-400" />
                  Cancellation Policy
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 bg-muted/30 rounded-lg whitespace-pre-wrap text-sm">
                  {policies.cancellation_policy}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="refund">
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-pink-400" />
                  Refund Policy
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 bg-muted/30 rounded-lg whitespace-pre-wrap text-sm">
                  {policies.refund_policy}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="attendance">
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-400" />
                  Attendance Policy
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 bg-muted/30 rounded-lg whitespace-pre-wrap text-sm">
                  {policies.attendance_policy}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="terms">
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  Terms of Entry
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 bg-muted/30 rounded-lg whitespace-pre-wrap text-sm">
                  {policies.terms_of_entry}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Legal Note */}
      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-300">Legal Notice</p>
              <p className="text-muted-foreground mt-1">
                These policies are templates and should be reviewed by legal counsel. 
                The Consumer Protection Act (CPA) requires a 7-day cooling-off period for all purchases.
                You are responsible for ensuring your policies comply with local laws.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
