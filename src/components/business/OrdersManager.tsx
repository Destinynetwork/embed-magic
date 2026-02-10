import { useState, useEffect } from "react";
import { ShoppingBag, Download, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { demoOrders } from "@/lib/demo/businessHubDemo";

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  quantity: number;
  total_amount: number;
  discount_amount: number;
  payment_status: string;
  download_count: number;
  created_at: string;
  product: { name: string; sku: string; is_digital: boolean } | null;
}

interface OrdersManagerProps {
  businessId: string | null;
  demoMode?: boolean;
}

export default function OrdersManager({ businessId, demoMode = false }: OrdersManagerProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (demoMode) {
      setOrders(demoOrders.map((o) => ({ ...o })) as unknown as Order[]);
      setLoading(false);
      return;
    }
    if (businessId) { loadOrders(); } else { setLoading(false); }
  }, [businessId, demoMode]);

  const loadOrders = async () => {
    if (demoMode || !businessId) return;
    const { data, error } = await (supabase as any)
      .from("business_orders")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });
    if (error) { console.error(error); toast.error("Failed to load orders"); }
    else { setOrders((data || []).map((d: any) => ({ ...d, quantity: 1, discount_amount: 0, download_count: 0, product: null }))); }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) { case "completed": return "default"; case "pending": return "secondary"; case "failed": return "destructive"; default: return "outline"; }
  };

  const sendWhatsAppMessage = (phone: string | null, customerName: string) => {
    if (!phone) { toast.error("No phone number available"); return; }
    const cleanPhone = phone.replace(/\D/g, "");
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${customerName}, thank you for your order!`)}`, "_blank");
  };

  const sendEmail = (email: string, customerName: string) => {
    window.open(`mailto:${email}?subject=${encodeURIComponent("Regarding your order")}&body=${encodeURIComponent(`Hi ${customerName},\n\nThank you for your order!\n\nBest regards`)}`, "_blank");
  };

  if (!businessId) {
    return (<Card className="bg-card/50 border-border/50"><CardContent className="p-8 text-center"><ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">Please set up your store settings first to view orders.</p></CardContent></Card>);
  }

  const totalRevenue = orders.filter((o) => o.payment_status === "completed").reduce((sum, o) => sum + o.total_amount, 0);
  const pendingOrders = orders.filter((o) => o.payment_status === "pending").length;
  const completedOrders = orders.filter((o) => o.payment_status === "completed").length;

  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-semibold">Orders</h2><p className="text-sm text-muted-foreground">View and manage customer orders</p></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border/50"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Revenue</p><p className="text-2xl font-bold text-green-500">R{totalRevenue.toFixed(2)}</p></CardContent></Card>
        <Card className="bg-card/50 border-border/50"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Completed Orders</p><p className="text-2xl font-bold text-primary">{completedOrders}</p></CardContent></Card>
        <Card className="bg-card/50 border-border/50"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Pending Orders</p><p className="text-2xl font-bold text-amber-500">{pendingOrders}</p></CardContent></Card>
      </div>
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-0">
          {loading ? (<div className="p-8 text-center text-muted-foreground">Loading orders...</div>) : orders.length === 0 ? (
            <div className="p-8 text-center"><ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">No orders yet.</p></div>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Order Date</TableHead><TableHead>Customer</TableHead><TableHead>Product</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="text-sm">{format(new Date(order.created_at), "MMM d, yyyy HH:mm")}</TableCell>
                    <TableCell><div className="font-medium">{order.customer_name}</div><div className="text-xs text-muted-foreground">{order.customer_email}</div></TableCell>
                    <TableCell><div className="font-medium">{order.product?.name || "—"}</div></TableCell>
                    <TableCell><div className="font-medium">R{order.total_amount.toFixed(2)}</div></TableCell>
                    <TableCell><Badge variant={getStatusColor(order.payment_status)}>{order.payment_status}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => sendEmail(order.customer_email, order.customer_name)} title="Send Email"><Mail className="h-4 w-4" /></Button>
                        {order.customer_phone && <Button variant="ghost" size="icon" onClick={() => sendWhatsAppMessage(order.customer_phone, order.customer_name)} title="Send WhatsApp"><MessageSquare className="h-4 w-4" /></Button>}
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
