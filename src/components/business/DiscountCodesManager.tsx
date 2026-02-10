import { useState, useEffect } from "react";
import { Tag, Plus, Pencil, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { demoDiscountCodes } from "@/lib/demo/businessHubDemo";

interface DiscountCode {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  is_active: boolean;
  usage_limit: number | null;
  times_used: number;
  valid_from: string;
  valid_until: string | null;
  created_at: string;
}

interface DiscountCodesManagerProps {
  businessId: string | null;
  demoMode?: boolean;
}

export default function DiscountCodesManager({ businessId, demoMode = false }: DiscountCodesManagerProps) {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "",
    is_active: true,
    usage_limit: "",
    valid_until: "",
  });

  useEffect(() => {
    if (demoMode) {
      setCodes(demoDiscountCodes.map((c) => ({ ...c })) as unknown as DiscountCode[]);
      setLoading(false);
      return;
    }
    if (businessId) {
      loadCodes();
    } else {
      setLoading(false);
    }
  }, [businessId, demoMode]);

  const loadCodes = async () => {
    if (demoMode || !businessId) return;
    const { data, error } = await (supabase as any)
      .from("business_discount_codes")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error loading discount codes:", error);
      toast.error("Failed to load discount codes");
    } else {
      setCodes((data || []).map((d: any) => ({
        ...d,
        times_used: d.uses_count ?? 0,
        usage_limit: d.max_uses ?? null,
        valid_from: d.created_at,
        valid_until: d.expires_at ?? null,
      })));
    }
    setLoading(false);
  };

  const resetForm = () => {
    setForm({ code: "", discount_type: "percentage", discount_value: "", is_active: true, usage_limit: "", valid_until: "" });
    setEditingCode(null);
  };

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    setForm({ ...form, code });
  };

  const openAddDialog = () => { resetForm(); setDialogOpen(true); };

  const openEditDialog = (code: DiscountCode) => {
    setEditingCode(code);
    setForm({
      code: code.code,
      discount_type: code.discount_type,
      discount_value: code.discount_value.toString(),
      is_active: code.is_active,
      usage_limit: code.usage_limit?.toString() || "",
      valid_until: code.valid_until ? code.valid_until.split("T")[0] : "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!businessId && !demoMode) { toast.error("Please set up your business first"); return; }
    if (!form.code || !form.discount_value) { toast.error("Please fill in all required fields"); return; }
    setSaving(true);

    if (demoMode) {
      const now = new Date().toISOString();
      const nextBase = {
        code: form.code.toUpperCase(),
        discount_type: form.discount_type,
        discount_value: parseFloat(form.discount_value),
        is_active: form.is_active,
        usage_limit: form.usage_limit ? parseInt(form.usage_limit) : null,
        valid_from: now,
        valid_until: form.valid_until ? new Date(form.valid_until).toISOString() : null,
        times_used: editingCode?.times_used ?? 0,
        created_at: editingCode?.created_at ?? now,
      };
      if (editingCode) {
        setCodes((prev) => prev.map((c) => (c.id === editingCode.id ? { ...c, ...nextBase } : c)));
        toast.success("Discount code updated (demo)");
      } else {
        const id = crypto?.randomUUID?.() ?? `demo-${Date.now()}`;
        setCodes((prev) => [{ id, ...nextBase }, ...prev] as DiscountCode[]);
        toast.success("Discount code created (demo)");
      }
      setDialogOpen(false);
      setSaving(false);
      return;
    }

    const codeData = {
      business_id: businessId,
      code: form.code.toUpperCase(),
      discount_type: form.discount_type,
      discount_value: parseFloat(form.discount_value),
      is_active: form.is_active,
      max_uses: form.usage_limit ? parseInt(form.usage_limit) : null,
      expires_at: form.valid_until ? new Date(form.valid_until).toISOString() : null,
    };

    if (editingCode) {
      const { error } = await (supabase as any).from("business_discount_codes").update(codeData).eq("id", editingCode.id);
      if (error) { toast.error("Failed to update discount code"); } else { toast.success("Discount code updated"); setDialogOpen(false); loadCodes(); }
    } else {
      const { error } = await (supabase as any).from("business_discount_codes").insert(codeData);
      if (error) { toast.error(error.code === "23505" ? "This discount code already exists" : "Failed to create discount code"); } else { toast.success("Discount code created"); setDialogOpen(false); loadCodes(); }
    }
    setSaving(false);
  };

  const handleDelete = async (codeId: string) => {
    if (!confirm("Are you sure you want to delete this discount code?")) return;
    if (demoMode) { setCodes((prev) => prev.filter((c) => c.id !== codeId)); toast.success("Discount code deleted (demo)"); return; }
    const { error } = await (supabase as any).from("business_discount_codes").delete().eq("id", codeId);
    if (error) { toast.error("Failed to delete"); } else { toast.success("Discount code deleted"); loadCodes(); }
  };

  const copyCode = (code: string) => { navigator.clipboard.writeText(code); toast.success("Code copied to clipboard"); };

  if (!businessId) {
    return (
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-8 text-center">
          <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Please set up your store settings first before creating discount codes.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Discount Codes</h2>
          <p className="text-sm text-muted-foreground">Create and manage promotional codes</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}><Plus className="h-4 w-4 mr-2" />Create Code</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCode ? "Edit Discount Code" : "Create Discount Code"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Discount Code *</Label>
                <div className="flex gap-2">
                  <Input placeholder="e.g. SAVE20" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="font-mono" />
                  <Button type="button" variant="outline" onClick={generateCode}>Generate</Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Discount Type *</Label>
                  <Select value={form.discount_type} onValueChange={(value) => setForm({ ...form, discount_type: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount (R)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Value *</Label>
                  <Input type="number" step="0.01" placeholder={form.discount_type === "percentage" ? "e.g. 20" : "e.g. 50.00"} value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Usage Limit</Label>
                  <Input type="number" placeholder="Unlimited" value={form.usage_limit} onChange={(e) => setForm({ ...form, usage_limit: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Expires On</Label>
                  <Input type="date" value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })} />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch checked={form.is_active} onCheckedChange={(checked) => setForm({ ...form, is_active: checked })} />
                <Label>Active</Label>
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} disabled={saving} className="flex-1">{saving ? "Saving..." : editingCode ? "Update Code" : "Create Code"}</Button>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading discount codes...</div>
          ) : codes.length === 0 ? (
            <div className="p-8 text-center">
              <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No discount codes yet. Create your first promotional code.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {codes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell>
                      <button onClick={() => copyCode(code.code)} className="font-mono font-bold text-primary hover:underline flex items-center gap-1">
                        {code.code}<Copy className="h-3 w-3" />
                      </button>
                    </TableCell>
                    <TableCell>{code.discount_type === "percentage" ? `${code.discount_value}%` : `R${code.discount_value.toFixed(2)}`}</TableCell>
                    <TableCell>{code.times_used} / {code.usage_limit || "∞"}</TableCell>
                    <TableCell>{code.valid_until ? format(new Date(code.valid_until), "MMM d, yyyy") : "Never"}</TableCell>
                    <TableCell><Badge variant={code.is_active ? "default" : "destructive"}>{code.is_active ? "Active" : "Inactive"}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(code)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(code.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
