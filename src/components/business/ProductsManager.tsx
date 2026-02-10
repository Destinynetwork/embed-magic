import { useState, useEffect } from "react";
import { Package, Plus, Pencil, Trash2, Copy, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { demoProducts } from "@/lib/demo/businessHubDemo";
import { calculateInclusivePrice, getPriceBreakdown, VAT_RATE, COMMISSION_RATE } from "@/lib/pricing-utils";

interface Product {
  id: string; sku: string; name: string; description: string | null; price: number;
  is_digital: boolean; digital_file_path: string | null; stock_quantity: number;
  is_active: boolean; thumbnail_url: string | null; created_at: string;
}

interface ProductsManagerProps { businessId: string | null; demoMode?: boolean; }

export default function ProductsManager({ businessId, demoMode = false }: ProductsManagerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ sku: "", name: "", description: "", price: "", is_digital: false, stock_quantity: "0", is_active: true });

  useEffect(() => {
    if (demoMode) { setProducts(demoProducts.map((p) => ({ ...p })) as unknown as Product[]); setLoading(false); return; }
    if (businessId) { loadProducts(); } else { setLoading(false); }
  }, [businessId, demoMode]);

  const loadProducts = async () => {
    if (demoMode || !businessId) return;
    const { data, error } = await (supabase as any).from("business_products").select("*").eq("business_id", businessId).order("created_at", { ascending: false });
    if (error) { console.error(error); toast.error("Failed to load products"); }
    else { setProducts((data || []).map((d: any) => ({ ...d, price: d.base_price ?? 0, stock_quantity: d.stock ?? 0, is_digital: d.product_type === "digital", is_active: d.status === "active", digital_file_path: null }))); }
    setLoading(false);
  };

  const resetForm = () => { setForm({ sku: "", name: "", description: "", price: "", is_digital: false, stock_quantity: "0", is_active: true }); setEditingProduct(null); };

  const handleSave = async () => {
    if (!businessId && !demoMode) { toast.error("Please set up your business first"); return; }
    if (!form.sku || !form.name || !form.price) { toast.error("Please fill in all required fields"); return; }
    setSaving(true);
    if (demoMode) {
      const now = new Date().toISOString();
      const nextBase = { sku: form.sku, name: form.name, description: form.description || null, price: parseFloat(form.price), is_digital: form.is_digital, stock_quantity: parseInt(form.stock_quantity) || 0, is_active: form.is_active };
      if (editingProduct) { setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? { ...p, ...nextBase } : p))); toast.success("Product updated (demo)"); }
      else { setProducts((prev) => [{ id: crypto?.randomUUID?.() ?? `demo-${Date.now()}`, ...nextBase, digital_file_path: null, thumbnail_url: null, created_at: now }, ...prev]); toast.success("Product added (demo)"); }
      setDialogOpen(false); setSaving(false); return;
    }
    const productData = { business_id: businessId, sku: form.sku, name: form.name, description: form.description || null, base_price: parseFloat(form.price), stock: parseInt(form.stock_quantity) || 0, product_type: form.is_digital ? "digital" : "physical", status: form.is_active ? "active" : "inactive" };
    if (editingProduct) {
      const { error } = await (supabase as any).from("business_products").update(productData).eq("id", editingProduct.id);
      if (error) { toast.error("Failed to update product"); } else { toast.success("Product updated"); setDialogOpen(false); loadProducts(); }
    } else {
      const { error } = await (supabase as any).from("business_products").insert(productData);
      if (error) { toast.error("Failed to add product"); } else { toast.success("Product added"); setDialogOpen(false); loadProducts(); }
    }
    setSaving(false);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Delete this product?")) return;
    if (demoMode) { setProducts((prev) => prev.filter((p) => p.id !== productId)); toast.success("Product deleted (demo)"); return; }
    const { error } = await (supabase as any).from("business_products").delete().eq("id", productId);
    if (error) { toast.error("Failed to delete"); } else { toast.success("Product deleted"); loadProducts(); }
  };

  if (!businessId) {
    return (<Card className="bg-card/50 border-border/50"><CardContent className="p-8 text-center"><Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">Please set up your store settings first.</p></CardContent></Card>);
  }

  return (
    <TooltipProvider>
    <div className="space-y-6">
      <Card className="bg-primary/5 border-primary/20"><CardContent className="p-4"><div className="flex items-start gap-3"><Info className="h-5 w-5 text-primary mt-0.5" /><div className="text-sm"><p className="font-medium text-foreground mb-1">Pricing Structure</p><p className="text-muted-foreground">All prices include <span className="font-medium text-foreground">{VAT_RATE}% VAT</span> and <span className="font-medium text-foreground">{COMMISSION_RATE}% platform commission</span>.</p></div></div></CardContent></Card>
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-semibold">Products</h2><p className="text-sm text-muted-foreground">Manage your product catalog</p></div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button onClick={() => { resetForm(); setDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" />Add Product</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>SKU *</Label><Input placeholder="e.g. PROD-001" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} /></div>
                <div className="space-y-2"><Label>Base Price (R) *</Label><Input type="number" step="0.01" placeholder="0.00" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />{form.price && parseFloat(form.price) > 0 && <p className="text-xs text-muted-foreground">Customer pays: <span className="font-medium text-foreground">R{calculateInclusivePrice(parseFloat(form.price)).toFixed(2)}</span></p>}</div>
              </div>
              <div className="space-y-2"><Label>Product Name *</Label><Input placeholder="Enter product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Enter product description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Stock Quantity</Label><Input type="number" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} /></div>
                <div className="flex items-center space-x-2 pt-6"><Switch checked={form.is_digital} onCheckedChange={(checked) => setForm({ ...form, is_digital: checked })} /><Label>Digital Product</Label></div>
              </div>
              <div className="flex items-center space-x-2"><Switch checked={form.is_active} onCheckedChange={(checked) => setForm({ ...form, is_active: checked })} /><Label>Active</Label></div>
              <div className="flex gap-3 pt-4"><Button onClick={handleSave} disabled={saving} className="flex-1">{saving ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}</Button><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button></div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-0">
          {loading ? (<div className="p-8 text-center text-muted-foreground">Loading products...</div>) : products.length === 0 ? (
            <div className="p-8 text-center"><Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">No products yet. Add your first product.</p></div>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>SKU</TableHead><TableHead>Base Price</TableHead><TableHead>Customer Price</TableHead><TableHead>Stock</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {products.map((product) => {
                  const breakdown = getPriceBreakdown(product.price);
                  return (
                    <TableRow key={product.id}>
                      <TableCell><div className="font-medium">{product.name}</div><button onClick={() => { navigator.clipboard.writeText(product.id); toast.success("ID copied"); }} className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"><Copy className="h-3 w-3" />{product.id.slice(0, 8)}...</button></TableCell>
                      <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                      <TableCell className="text-muted-foreground">R{product.price.toFixed(2)}</TableCell>
                      <TableCell><Tooltip><TooltipTrigger asChild><span className="font-medium text-green-500 cursor-help">R{breakdown.totalInclusive.toFixed(2)}</span></TooltipTrigger><TooltipContent side="right" className="text-xs"><div className="space-y-1"><div className="flex justify-between gap-4"><span>Base:</span><span>R{product.price.toFixed(2)}</span></div><div className="flex justify-between gap-4"><span>VAT ({VAT_RATE}%):</span><span>R{breakdown.vatAmount.toFixed(2)}</span></div><div className="flex justify-between gap-4"><span>Commission ({COMMISSION_RATE}%):</span><span>R{breakdown.commissionAmount.toFixed(2)}</span></div></div></TooltipContent></Tooltip></TableCell>
                      <TableCell>{product.is_digital ? "∞" : product.stock_quantity}</TableCell>
                      <TableCell><Badge variant={product.is_digital ? "secondary" : "outline"}>{product.is_digital ? "Digital" : "Physical"}</Badge></TableCell>
                      <TableCell><Badge variant={product.is_active ? "default" : "destructive"}>{product.is_active ? "Active" : "Inactive"}</Badge></TableCell>
                      <TableCell className="text-right"><div className="flex items-center justify-end gap-2"><Button variant="ghost" size="icon" onClick={() => { setEditingProduct(product); setForm({ sku: product.sku, name: product.name, description: product.description || "", price: product.price.toString(), is_digital: product.is_digital, stock_quantity: product.stock_quantity.toString(), is_active: product.is_active }); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
    </TooltipProvider>
  );
}
