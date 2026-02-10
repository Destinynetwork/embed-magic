import { useState, useEffect } from "react";
import { Package, Send, Truck, ExternalLink, Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { format } from "date-fns";
import { demoOrders, demoShippingCompanies, demoShipments } from "@/lib/demo/businessHubDemo";

interface ShippingCompany { id: string; name: string; phone: string; email: string | null; tracking_url_template: string | null; }
interface Order { id: string; customer_name: string; customer_email: string; customer_phone: string | null; payment_status: string; product: { name: string; sku: string; is_digital: boolean } | null; }
interface Shipment { id: string; order_id: string; waybill_number: string; shipping_status: string; shipped_at: string | null; estimated_delivery: string | null; notes: string | null; customer_notified: boolean; created_at: string; shipping_company: ShippingCompany | null; order?: Order; }

interface WaybillManagerProps { businessId: string | null; demoMode?: boolean; }

export default function WaybillManager({ businessId, demoMode = false }: WaybillManagerProps) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [shippingCompanies, setShippingCompanies] = useState<ShippingCompany[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({ order_id: "", shipping_company_id: "", waybill_number: "", estimated_delivery: "", notes: "" });

  useEffect(() => {
    if (demoMode) {
      setShippingCompanies(demoShippingCompanies.map(c => ({ ...c })) as ShippingCompany[]);
      setOrders(demoOrders.filter((o) => !o.product.is_digital).map((o) => ({ id: o.id, customer_name: o.customer_name, customer_email: o.customer_email, customer_phone: o.customer_phone, payment_status: o.payment_status, product: { ...o.product } })) as Order[]);
      setShipments(demoShipments.map(s => ({ ...s, shipping_company: s.shipping_company ? { ...s.shipping_company } : null, order: s.order ? { ...s.order, product: { ...s.order.product } } : undefined })) as Shipment[]);
      setLoading(false);
      return;
    }
    setLoading(false);
  }, [businessId, demoMode]);

  const resetForm = () => setForm({ order_id: "", shipping_company_id: "", waybill_number: "", estimated_delivery: "", notes: "" });

  const handleCreateWaybill = async () => {
    if (!form.order_id || !form.shipping_company_id || !form.waybill_number.trim()) { toast.error("Order, shipping company, and waybill number are required"); return; }
    setSaving(true);
    const company = shippingCompanies.find((c) => c.id === form.shipping_company_id);
    const order = orders.find((o) => o.id === form.order_id);
    const newShipment: Shipment = { id: `demo-shipment-${Date.now()}`, order_id: form.order_id, waybill_number: form.waybill_number, shipping_status: "pending", shipped_at: null, estimated_delivery: form.estimated_delivery || null, notes: form.notes || null, customer_notified: false, created_at: new Date().toISOString(), shipping_company: company || null, order };
    setShipments((prev) => [newShipment, ...prev]);
    toast.success("Waybill created" + (demoMode ? " (demo)" : ""));
    setSaving(false); setDialogOpen(false); resetForm();
  };

  const updateShippingStatus = (shipment: Shipment, status: string) => {
    setShipments((prev) => prev.map((s) => s.id === shipment.id ? { ...s, shipping_status: status, shipped_at: status === "shipped" ? new Date().toISOString() : s.shipped_at } : s));
    toast.success("Status updated");
  };

  const sendCustomerNotification = (shipment: Shipment) => {
    const order = shipment.order;
    const company = shipment.shipping_company;
    if (!order || !company) { toast.error("Missing order or shipping company info"); return; }
    let trackingUrl = "";
    if (company.tracking_url_template) trackingUrl = company.tracking_url_template.replace("{waybill}", shipment.waybill_number);
    const subject = encodeURIComponent(`Your order has been shipped - Waybill: ${shipment.waybill_number}`);
    const body = encodeURIComponent(`Dear ${order.customer_name},\n\nYour order has been shipped.\n\nWaybill: ${shipment.waybill_number}\nShipping: ${company.name}\n${trackingUrl ? `Track: ${trackingUrl}\n` : ""}\nThank you!`);
    window.open(`mailto:${order.customer_email}?subject=${subject}&body=${body}`, "_blank");
    setShipments((prev) => prev.map((s) => s.id === shipment.id ? { ...s, customer_notified: true } : s));
    toast.success("Email composed");
  };

  const filteredShipments = shipments.filter((s) => { if (!searchTerm) return true; const t = searchTerm.toLowerCase(); return s.waybill_number.toLowerCase().includes(t) || s.order?.customer_name.toLowerCase().includes(t) || s.shipping_company?.name.toLowerCase().includes(t); });
  const unshippedOrders = orders.filter((o) => !shipments.some((s) => s.order_id === o.id));

  if (!businessId) { return <Card className="bg-card/50 border-border/50"><CardContent className="p-8 text-center"><Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">Please set up your store settings first.</p></CardContent></Card>; }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h2 className="text-xl font-semibold">Waybills & Shipping</h2><p className="text-sm text-muted-foreground">Create waybills and notify customers</p></div>
        <div className="flex items-center gap-2">
          <div className="relative"><Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search waybills..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-64" /></div>
          <Button onClick={() => setDialogOpen(true)} disabled={unshippedOrders.length === 0}><Truck className="h-4 w-4 mr-2" />Create Waybill</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Awaiting Shipment</p><p className="text-2xl font-bold text-amber-500">{unshippedOrders.length}</p></CardContent></Card>
        <Card className="bg-card/50 border-border/50"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold text-muted-foreground">{shipments.filter((s) => s.shipping_status === "pending").length}</p></CardContent></Card>
        <Card className="bg-card/50 border-border/50"><CardContent className="p-4"><p className="text-sm text-muted-foreground">In Transit</p><p className="text-2xl font-bold text-primary">{shipments.filter((s) => s.shipping_status === "shipped").length}</p></CardContent></Card>
        <Card className="bg-card/50 border-border/50"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Delivered</p><p className="text-2xl font-bold text-green-500">{shipments.filter((s) => s.shipping_status === "delivered").length}</p></CardContent></Card>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-0">
          {loading ? <div className="p-8 text-center text-muted-foreground">Loading...</div> : filteredShipments.length === 0 ? (
            <div className="p-8 text-center"><Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">{searchTerm ? "No matches." : "No waybills yet."}</p></div>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Waybill #</TableHead><TableHead>Customer</TableHead><TableHead>Company</TableHead><TableHead>Status</TableHead><TableHead>Est. Delivery</TableHead><TableHead>Notified</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredShipments.map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell className="font-mono font-medium">{shipment.waybill_number}</TableCell>
                    <TableCell><div className="font-medium">{shipment.order?.customer_name || "Unknown"}</div><div className="text-xs text-muted-foreground">{shipment.order?.product?.name}</div></TableCell>
                    <TableCell><div>{shipment.shipping_company?.name}</div></TableCell>
                    <TableCell><Select value={shipment.shipping_status} onValueChange={(value) => updateShippingStatus(shipment, value)}><SelectTrigger className="w-32"><Badge variant={shipment.shipping_status === "delivered" ? "default" : shipment.shipping_status === "shipped" ? "secondary" : "outline"}>{shipment.shipping_status}</Badge></SelectTrigger><SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="shipped">Shipped</SelectItem><SelectItem value="delivered">Delivered</SelectItem></SelectContent></Select></TableCell>
                    <TableCell>{shipment.estimated_delivery ? <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />{shipment.estimated_delivery}</div> : "-"}</TableCell>
                    <TableCell><Badge variant={shipment.customer_notified ? "default" : "outline"}>{shipment.customer_notified ? "Yes" : "No"}</Badge></TableCell>
                    <TableCell className="text-right"><div className="flex items-center justify-end gap-2"><Button variant="outline" size="sm" onClick={() => sendCustomerNotification(shipment)}><Send className="h-4 w-4 mr-1" />Notify</Button>{shipment.shipping_company?.tracking_url_template && <Button variant="ghost" size="icon" onClick={() => window.open(shipment.shipping_company!.tracking_url_template!.replace("{waybill}", shipment.waybill_number), "_blank")}><ExternalLink className="h-4 w-4" /></Button>}</div></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Waybill</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Select Order *</Label><Select value={form.order_id} onValueChange={(value) => setForm({ ...form, order_id: value })}><SelectTrigger><SelectValue placeholder="Select an order" /></SelectTrigger><SelectContent>{unshippedOrders.map((o) => <SelectItem key={o.id} value={o.id}>{o.customer_name} — {o.product?.name || "Order"}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Shipping Company *</Label><Select value={form.shipping_company_id} onValueChange={(value) => setForm({ ...form, shipping_company_id: value })}><SelectTrigger><SelectValue placeholder="Select company" /></SelectTrigger><SelectContent>{shippingCompanies.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Waybill Number *</Label><Input placeholder="e.g., TCG123456789" value={form.waybill_number} onChange={(e) => setForm({ ...form, waybill_number: e.target.value })} /></div>
            <div className="space-y-2"><Label>Estimated Delivery</Label><Input type="date" value={form.estimated_delivery} onChange={(e) => setForm({ ...form, estimated_delivery: e.target.value })} /></div>
            <div className="space-y-2"><Label>Notes</Label><Textarea placeholder="Optional delivery notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleCreateWaybill} disabled={saving}>{saving ? "Creating..." : "Create Waybill"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
