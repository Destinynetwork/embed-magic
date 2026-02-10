import { useState, useEffect } from "react";
import { Truck, Plus, Edit2, Trash2, Phone, Globe, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { demoShippingCompanies } from "@/lib/demo/businessHubDemo";

interface ShippingCompany {
  id: string; name: string; contact_person: string | null; phone: string;
  email: string | null; website: string | null; tracking_url_template: string | null;
  is_active: boolean; created_at: string;
}

interface ShippingCompaniesManagerProps { businessId: string | null; demoMode?: boolean; }

export default function ShippingCompaniesManager({ businessId, demoMode = false }: ShippingCompaniesManagerProps) {
  const [companies, setCompanies] = useState<ShippingCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<ShippingCompany | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", contact_person: "", phone: "", email: "", website: "", tracking_url_template: "", is_active: true });

  useEffect(() => {
    if (demoMode) { setCompanies(demoShippingCompanies.map((c) => ({ ...c })) as ShippingCompany[]); setLoading(false); return; }
    if (businessId) { loadCompanies(); } else { setLoading(false); }
  }, [businessId, demoMode]);

  const loadCompanies = async () => {
    if (demoMode || !businessId) return;
    const { data, error } = await (supabase as any).from("business_shipping_companies").select("*").eq("business_id", businessId).order("name", { ascending: true });
    if (error) { console.error(error); toast.error("Failed to load shipping companies"); }
    else { setCompanies((data || []).map((d: any) => ({ ...d, phone: d.contact_phone ?? "", tracking_url_template: d.tracking_url ?? null, contact_person: null, website: null }))); }
    setLoading(false);
  };

  const resetForm = () => { setForm({ name: "", contact_person: "", phone: "", email: "", website: "", tracking_url_template: "", is_active: true }); setEditingCompany(null); };

  const openDialog = (company?: ShippingCompany) => {
    if (company) { setEditingCompany(company); setForm({ name: company.name, contact_person: company.contact_person || "", phone: company.phone, email: company.email || "", website: company.website || "", tracking_url_template: company.tracking_url_template || "", is_active: company.is_active }); }
    else { resetForm(); }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.phone.trim()) { toast.error("Name and phone are required"); return; }
    setSaving(true);
    if (demoMode) {
      if (editingCompany) { setCompanies((prev) => prev.map((c) => c.id === editingCompany.id ? { ...c, ...form, contact_person: form.contact_person || null, email: form.email || null, website: form.website || null, tracking_url_template: form.tracking_url_template || null } : c)); toast.success("Updated (demo)"); }
      else { setCompanies((prev) => [...prev, { id: `demo-ship-${Date.now()}`, ...form, contact_person: form.contact_person || null, email: form.email || null, website: form.website || null, tracking_url_template: form.tracking_url_template || null, created_at: new Date().toISOString() }]); toast.success("Added (demo)"); }
      setSaving(false); setDialogOpen(false); resetForm(); return;
    }
    if (!businessId) { toast.error("Please set up your store first"); setSaving(false); return; }
    const companyData = { business_id: businessId, name: form.name.trim(), contact_phone: form.phone.trim(), contact_email: form.email.trim() || null, tracking_url: form.tracking_url_template.trim() || null, is_active: form.is_active };
    if (editingCompany) {
      const { error } = await supabase.from("business_shipping_companies").update(companyData).eq("id", editingCompany.id);
      if (error) { toast.error("Failed to update"); } else { toast.success("Updated"); loadCompanies(); }
    } else {
      const { error } = await supabase.from("business_shipping_companies").insert(companyData);
      if (error) { toast.error("Failed to add"); } else { toast.success("Added"); loadCompanies(); }
    }
    setSaving(false); setDialogOpen(false); resetForm();
  };

  const handleDelete = async (company: ShippingCompany) => {
    if (!confirm(`Delete "${company.name}"?`)) return;
    if (demoMode) { setCompanies((prev) => prev.filter((c) => c.id !== company.id)); toast.success("Deleted (demo)"); return; }
    const { error } = await supabase.from("business_shipping_companies").delete().eq("id", company.id);
    if (error) { toast.error("Failed to delete"); } else { toast.success("Deleted"); loadCompanies(); }
  };

  if (!businessId) {
    return (<Card className="bg-card/50 border-border/50"><CardContent className="p-8 text-center"><Truck className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">Please set up your store settings first.</p></CardContent></Card>);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-semibold">Shipping Companies</h2><p className="text-sm text-muted-foreground">Manage your shipping providers</p></div>
        <Button onClick={() => openDialog()}><Plus className="h-4 w-4 mr-2" />Add Shipping Company</Button>
      </div>
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-0">
          {loading ? (<div className="p-8 text-center text-muted-foreground">Loading...</div>) : companies.length === 0 ? (
            <div className="p-8 text-center"><Truck className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">No shipping companies yet.</p></div>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Company Name</TableHead><TableHead>Contact</TableHead><TableHead>Phone</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell><div className="font-medium">{company.name}</div>{company.website && <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1"><Globe className="h-3 w-3" />Website</a>}</TableCell>
                    <TableCell><div>{company.contact_person || "-"}</div>{company.email && <div className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" />{company.email}</div>}</TableCell>
                    <TableCell><div className="flex items-center gap-1"><Phone className="h-3 w-3" />{company.phone}</div></TableCell>
                    <TableCell><Badge variant={company.is_active ? "default" : "secondary"}>{company.is_active ? "Active" : "Inactive"}</Badge></TableCell>
                    <TableCell className="text-right"><div className="flex items-center justify-end gap-2"><Button variant="ghost" size="icon" onClick={() => openDialog(company)}><Edit2 className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => handleDelete(company)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingCompany ? "Edit Shipping Company" : "Add Shipping Company"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Company Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., The Courier Guy" /></div>
            <div className="space-y-2"><Label>Contact Person</Label><Input value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} /></div>
            <div className="space-y-2"><Label>Phone Number *</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="space-y-2"><Label>Website</Label><Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} /></div>
            <div className="space-y-2"><Label>Tracking URL Template</Label><Input value={form.tracking_url_template} onChange={(e) => setForm({ ...form, tracking_url_template: e.target.value })} placeholder="e.g., https://courier.co.za/track/{waybill}" /><p className="text-xs text-muted-foreground">Use {"{waybill}"} as placeholder</p></div>
            <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={(checked) => setForm({ ...form, is_active: checked })} /><Label>Active</Label></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : editingCompany ? "Update" : "Add"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
