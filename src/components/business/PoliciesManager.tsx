import { useState, useEffect } from "react";
import { FileText, Save, Check, AlertCircle, Shield, RefreshCw, Truck, Package, Lock, Building2, ScrollText, Eye, RotateCcw, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SUPAVIEW_SELLER_AGREEMENT, SUPAVIEW_PLATFORM_TERMS, SUPAVIEW_DATA_PROCESSING } from "@/lib/policies/supaviewPlatformPolicies";
import { DEFAULT_VENDOR_TERMS, DEFAULT_VENDOR_REFUND, DEFAULT_VENDOR_RETURN, DEFAULT_VENDOR_PRIVACY, DEFAULT_VENDOR_SHIPPING } from "@/lib/policies/vendorCustomerPolicies";

interface PoliciesManagerProps { businessId: string | null; demoMode?: boolean; }

export default function PoliciesManager({ businessId, demoMode = false }: PoliciesManagerProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [policies, setPolicies] = useState({ termsOfService: DEFAULT_VENDOR_TERMS, refundPolicy: DEFAULT_VENDOR_REFUND, returnPolicy: DEFAULT_VENDOR_RETURN, privacyPolicy: DEFAULT_VENDOR_PRIVACY, shippingPolicy: DEFAULT_VENDOR_SHIPPING });
  const [policiesAccepted, setPoliciesAccepted] = useState(false);
  const [acceptedAt, setAcceptedAt] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("platform");
  const [platformPoliciesAccepted, setPlatformPoliciesAccepted] = useState(false);
  const [viewingPolicy, setViewingPolicy] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (demoMode) { setLoading(false); return; }
    if (businessId) { loadPolicies(); } else { setLoading(false); }
  }, [businessId, demoMode]);

  const loadPolicies = async () => {
    if (demoMode || !businessId) return;
    setLoading(true);
    const { data, error } = await supabase.from("business_store_settings").select("*").eq("business_id", businessId).maybeSingle();
    if (error) { console.error(error); }
    else if (data) {
      setPolicies({
        termsOfService: data.terms_text || DEFAULT_VENDOR_TERMS,
        refundPolicy: data.refund_policy || DEFAULT_VENDOR_REFUND,
        returnPolicy: data.returns_policy || DEFAULT_VENDOR_RETURN,
        privacyPolicy: data.privacy_policy || DEFAULT_VENDOR_PRIVACY,
        shippingPolicy: data.shipping_policy || DEFAULT_VENDOR_SHIPPING,
      });
      setPoliciesAccepted(data.policies_accepted ?? false);
      setAcceptedAt(data.policies_accepted_at ?? null);
      setPlatformPoliciesAccepted(data.policies_accepted ?? false);
    }
    setLoading(false);
  };

  const savePolicies = async (accept: boolean = false) => {
    if (demoMode) {
      setSaving(true);
      if (accept) { setPoliciesAccepted(true); setAcceptedAt(new Date().toISOString()); toast.success("Policies saved and accepted! (demo)"); }
      else { toast.success("Policies saved as draft (demo)"); }
      setSaving(false); return;
    }
    if (!businessId) { toast.error("Please set up your store first"); return; }
    if (accept && !platformPoliciesAccepted) { toast.error("Accept platform policies first"); setActiveTab("platform"); return; }
    setSaving(true);
    const policyData = {
      terms_text: policies.termsOfService,
      refund_policy: policies.refundPolicy,
      returns_policy: policies.returnPolicy,
      privacy_policy: policies.privacyPolicy,
      shipping_policy: policies.shippingPolicy,
      policies_accepted: accept ? true : policiesAccepted,
      policies_accepted_at: accept ? new Date().toISOString() : acceptedAt,
    };
    const { error } = await supabase.from("business_store_settings").update(policyData).eq("business_id", businessId);
    if (error) { toast.error("Failed to save policies"); }
    else { if (accept) { setPoliciesAccepted(true); setAcceptedAt(new Date().toISOString()); } toast.success(accept ? "Policies saved and accepted!" : "Policies saved as draft"); }
    setSaving(false);
  };

  const getPolicyContent = (t: string) => { switch (t) { case "seller": return SUPAVIEW_SELLER_AGREEMENT; case "platform": return SUPAVIEW_PLATFORM_TERMS; case "data": return SUPAVIEW_DATA_PROCESSING; default: return ""; } };
  const getPolicyTitle = (t: string) => { switch (t) { case "seller": return "SUPAView Seller Agreement"; case "platform": return "SUPAView Platform Terms"; case "data": return "Data Processing Agreement"; default: return ""; } };

  if (!businessId) { return <Alert className="border-amber-500/50 bg-amber-500/10"><AlertCircle className="h-4 w-4 text-amber-500" /><AlertDescription className="text-muted-foreground">Please set up your store in Store Settings first.</AlertDescription></Alert>; }
  if (loading) { return <div className="text-center py-8 text-muted-foreground">Loading policies...</div>; }

  return (
    <div className="space-y-6">
      <Dialog open={!!viewingPolicy} onOpenChange={() => setViewingPolicy(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]"><DialogHeader><DialogTitle>{viewingPolicy ? getPolicyTitle(viewingPolicy) : ""}</DialogTitle></DialogHeader>
          <ScrollArea className="h-[60vh] pr-4"><div className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap font-mono text-xs leading-relaxed">{viewingPolicy ? getPolicyContent(viewingPolicy) : ""}</div></ScrollArea>
        </DialogContent>
      </Dialog>

      {!platformPoliciesAccepted && <Alert className="border-purple-500/50 bg-purple-500/10"><Building2 className="h-4 w-4 text-purple-500" /><AlertTitle className="text-purple-400">Step 1: Accept Platform Policies</AlertTitle><AlertDescription className="text-muted-foreground">Review and accept the Seller Agreement, Platform Terms, and Data Processing Agreement.</AlertDescription></Alert>}
      {platformPoliciesAccepted && !policiesAccepted && <Alert className="border-amber-500/50 bg-amber-500/10"><AlertCircle className="h-4 w-4 text-amber-500" /><AlertTitle className="text-amber-400">Step 2: Configure Your Customer Policies</AlertTitle><AlertDescription className="text-muted-foreground">Customize the policy templates and click "Save & Accept" to activate your store.</AlertDescription></Alert>}
      {policiesAccepted && <Alert className="border-emerald-500/50 bg-emerald-500/10"><Check className="h-4 w-4 text-emerald-500" /><AlertTitle className="text-emerald-400">All Policies Active</AlertTitle><AlertDescription className="text-muted-foreground">Your store policies are published. {acceptedAt && `Updated: ${new Date(acceptedAt).toLocaleDateString()}`}</AlertDescription></Alert>}

      <Card className="bg-card/50 border-border/50">
        <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Store Policies</CardTitle><CardDescription>Manage platform agreements and customer-facing policies.</CardDescription></CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 flex-wrap h-auto gap-1">
              <TabsTrigger value="platform" className="flex items-center gap-1"><Building2 className="h-4 w-4" />Platform{platformPoliciesAccepted && <Check className="h-3 w-3 text-emerald-500 ml-1" />}</TabsTrigger>
              <TabsTrigger value="terms" disabled={!platformPoliciesAccepted}><Shield className="h-4 w-4" />Terms</TabsTrigger>
              <TabsTrigger value="refund" disabled={!platformPoliciesAccepted}><RefreshCw className="h-4 w-4" />Refund</TabsTrigger>
              <TabsTrigger value="return" disabled={!platformPoliciesAccepted}><Package className="h-4 w-4" />Returns</TabsTrigger>
              <TabsTrigger value="privacy" disabled={!platformPoliciesAccepted}><Lock className="h-4 w-4" />Privacy</TabsTrigger>
              <TabsTrigger value="shipping" disabled={!platformPoliciesAccepted}><Truck className="h-4 w-4" />Shipping</TabsTrigger>
            </TabsList>

            <TabsContent value="platform" className="space-y-4">
              <div className="grid gap-4">
                {[{ key: "seller", icon: ScrollText, title: "Seller Agreement", desc: "Your obligations as a seller" }, { key: "platform", icon: Building2, title: "Platform Terms", desc: "General terms for all users" }, { key: "data", icon: Lock, title: "Data Processing Agreement", desc: "How customer data is handled" }].map(({ key, icon: Icon, title, desc }) => (
                  <Card key={key} className="bg-background/50"><CardHeader className="pb-3"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Icon className="h-5 w-5 text-purple-400" /><CardTitle className="text-base">{title}</CardTitle></div><div className="flex items-center gap-2">{platformPoliciesAccepted && <Badge variant="outline" className="border-emerald-500 text-emerald-500">Accepted</Badge>}<Button variant="outline" size="sm" onClick={() => setViewingPolicy(key)}><Eye className="h-4 w-4 mr-1" />Read</Button></div></div><CardDescription>{desc}</CardDescription></CardHeader></Card>
                ))}
              </div>
              {!platformPoliciesAccepted && <Button onClick={() => { setPlatformPoliciesAccepted(true); toast.success("Platform policies accepted!"); setActiveTab("terms"); }} className="w-full"><Check className="h-4 w-4 mr-2" />Accept Platform Policies</Button>}
            </TabsContent>

            {["terms", "refund", "return", "privacy", "shipping"].map((tab) => {
              const policyKey = tab === "terms" ? "termsOfService" : tab === "refund" ? "refundPolicy" : tab === "return" ? "returnPolicy" : tab === "privacy" ? "privacyPolicy" : "shippingPolicy";
              const defaults: Record<string, string> = { terms: DEFAULT_VENDOR_TERMS, refund: DEFAULT_VENDOR_REFUND, return: DEFAULT_VENDOR_RETURN, privacy: DEFAULT_VENDOR_PRIVACY, shipping: DEFAULT_VENDOR_SHIPPING };
              return (
                <TabsContent key={tab} value={tab} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-medium capitalize">{tab === "terms" ? "Terms of Service" : `${tab} Policy`}</Label>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setPreviewMode(!previewMode)}>{previewMode ? <Edit3 className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}{previewMode ? "Edit" : "Preview"}</Button>
                      <Button variant="ghost" size="sm" onClick={() => { setPolicies(prev => ({ ...prev, [policyKey]: defaults[tab] })); toast.success("Reset to default"); }} className="text-amber-500 hover:text-amber-400"><RotateCcw className="h-4 w-4 mr-1" />Reset</Button>
                    </div>
                  </div>
                  {previewMode ? (
                    <Card className="bg-background/80 p-6"><ScrollArea className="h-[400px]"><div className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap text-sm">{policies[policyKey]}</div></ScrollArea></Card>
                  ) : (
                    <Textarea value={policies[policyKey]} onChange={(e) => setPolicies(prev => ({ ...prev, [policyKey]: e.target.value }))} rows={18} className="font-mono text-sm bg-background/50" />
                  )}
                  <div className="flex gap-3"><Button variant="outline" onClick={() => savePolicies(false)} disabled={saving}><Save className="h-4 w-4 mr-2" />{saving ? "Saving..." : "Save Draft"}</Button><Button onClick={() => savePolicies(true)} disabled={saving}><Check className="h-4 w-4 mr-2" />{saving ? "Saving..." : "Save & Accept Policies"}</Button></div>
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
