import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Store, Package, Tag, ShoppingCart, Truck, FileText, Settings, HelpCircle,
  Plus, Trash2, Edit, Search, Clock, AlertCircle, CheckCircle, Headphones,
  TrendingUp, Eye, Rocket, ChevronRight, BookOpen, Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EmbedProBusinessHubSectionProps {
  profileId: string;
  onBack: () => void;
}

export function EmbedProBusinessHubSection({ profileId, onBack }: EmbedProBusinessHubSectionProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("getting-started");
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [shippingCompanies, setShippingCompanies] = useState<any[]>([]);
  const [waybills, setWaybills] = useState<any[]>([]);
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [storeSettings, setStoreSettings] = useState<any>(null);

  // Modals
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddDiscount, setShowAddDiscount] = useState(false);
  const [showAddShipping, setShowAddShipping] = useState(false);
  const [showCreateWaybill, setShowCreateWaybill] = useState(false);

  // Store settings form
  const [settingsForm, setSettingsForm] = useState({
    storeName: "", email: "", phone: "", whatsapp: "", address: "",
    latitude: "", longitude: "", vendorId: "",
  });

  // Policies accepted
  const [policiesAccepted, setPoliciesAccepted] = useState(false);

  useEffect(() => {
    loadBusiness();
  }, [profileId]);

  const loadBusiness = async () => {
    try {
      const { data } = await supabase
        .from("businesses")
        .select("*")
        .eq("owner_id", profileId)
        .maybeSingle();

      if (data) {
        setBusiness(data);
        setSettingsForm({
          storeName: data.store_name || "",
          email: "", phone: "", whatsapp: "", address: data.address || "",
          latitude: "", longitude: "", vendorId: "",
        });
        await loadAllData(data.id);
      }
    } catch (err) {
      console.error("Error loading business:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadAllData = async (businessId: string) => {
    const [productsRes, ordersRes, discountsRes, shippingRes, waybillsRes, ticketsRes, settingsRes] = await Promise.all([
      supabase.from("business_products" as any).select("*").eq("business_id", businessId).order("created_at", { ascending: false }),
      supabase.from("business_orders" as any).select("*").eq("business_id", businessId).order("created_at", { ascending: false }),
      supabase.from("business_discount_codes" as any).select("*").eq("business_id", businessId).order("created_at", { ascending: false }),
      supabase.from("business_shipping_companies" as any).select("*").eq("business_id", businessId),
      supabase.from("business_waybills" as any).select("*").eq("business_id", businessId).order("created_at", { ascending: false }),
      supabase.from("business_support_tickets" as any).select("*").eq("business_id", businessId).order("created_at", { ascending: false }),
      supabase.from("business_store_settings" as any).select("*").eq("business_id", businessId).maybeSingle(),
    ]);
    setProducts((productsRes.data as any[]) || []);
    setOrders((ordersRes.data as any[]) || []);
    setDiscounts((discountsRes.data as any[]) || []);
    setShippingCompanies((shippingRes.data as any[]) || []);
    setWaybills((waybillsRes.data as any[]) || []);
    setSupportTickets((ticketsRes.data as any[]) || []);
    if (settingsRes.data) {
      setStoreSettings(settingsRes.data);
      const s = settingsRes.data as any;
      setSettingsForm({
        storeName: business?.store_name || "",
        email: s.email || "", phone: s.phone || "", whatsapp: s.whatsapp || "",
        address: s.physical_address || "", latitude: s.latitude || "",
        longitude: s.longitude || "", vendorId: s.vendor_id || "",
      });
      setPoliciesAccepted(s.policies_accepted || false);
    }
  };

  const createBusiness = async () => {
    try {
      const { data, error } = await supabase
        .from("businesses")
        .insert({ owner_id: profileId, store_name: "My Store" })
        .select()
        .single();
      if (error) throw error;
      setBusiness(data);
      toast.success("Business created!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create business");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="text-center py-12 space-y-4">
        <Store className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
        <h2 className="text-2xl font-bold">No Business Yet</h2>
        <p className="text-muted-foreground">Create your business to start selling products</p>
        <Button onClick={createBusiness} className="gap-2">
          <Plus className="h-4 w-4" />Create Business
        </Button>
      </div>
    );
  }

  const completedOrders = orders.filter((o: any) => o.status === "completed");
  const pendingOrders = orders.filter((o: any) => o.status === "pending");
  const totalRevenue = completedOrders.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);
  const openTickets = supportTickets.filter((t: any) => t.status === "open");
  const inProgressTickets = supportTickets.filter((t: any) => t.status === "in_progress");
  const resolvedTickets = supportTickets.filter((t: any) => t.status === "resolved");

  const waybillsByStatus = {
    awaiting: waybills.filter((w: any) => w.status === "awaiting_shipment").length,
    pending: waybills.filter((w: any) => w.status === "pending").length,
    transit: waybills.filter((w: any) => w.status === "in_transit").length,
    delivered: waybills.filter((w: any) => w.status === "delivered").length,
  };

  const saveStoreSettings = async () => {
    try {
      await supabase.from("businesses").update({ store_name: settingsForm.storeName, address: settingsForm.address }).eq("id", business.id);
      const settingsData = {
        business_id: business.id,
        email: settingsForm.email, phone: settingsForm.phone, whatsapp: settingsForm.whatsapp,
        physical_address: settingsForm.address, latitude: settingsForm.latitude,
        longitude: settingsForm.longitude, vendor_id: settingsForm.vendorId,
      };
      if (storeSettings) {
        await supabase.from("business_store_settings" as any).update(settingsData).eq("business_id", business.id);
      } else {
        await supabase.from("business_store_settings" as any).insert(settingsData);
      }
      toast.success("Store settings saved!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings");
    }
  };

  const acceptPolicies = async () => {
    try {
      const data = { business_id: business.id, policies_accepted: true, policies_accepted_at: new Date().toISOString() };
      if (storeSettings) {
        await supabase.from("business_store_settings" as any).update(data).eq("business_id", business.id);
      } else {
        await supabase.from("business_store_settings" as any).insert(data);
      }
      setPoliciesAccepted(true);
      toast.success("Platform policies accepted!");
    } catch (err) {
      toast.error("Failed to accept policies");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-bold">My Business Hub</h1>
          <p className="text-muted-foreground">Your complete business command center for managing products, customers, and growth</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <HelpCircle className="h-4 w-4" />Help & Support
          </Button>
          <Badge variant="outline" className="border-amber-500/50 text-amber-400 gap-1">
            <AlertCircle className="h-3 w-3" />Support Mode
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto gap-1 bg-card/50 p-1">
          <TabsTrigger value="getting-started" className="gap-1 text-xs sm:text-sm">
            <Rocket className="h-3.5 w-3.5" />Getting Started
          </TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="discounts">Discounts</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="waybills">Waybills</TabsTrigger>
          <TabsTrigger value="support-tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="store-settings">Store Settings</TabsTrigger>
          <TabsTrigger value="user-guide" className="gap-1">
            <BookOpen className="h-3.5 w-3.5" />User Guide
          </TabsTrigger>
        </TabsList>

        {/* Getting Started */}
        <TabsContent value="getting-started" className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
              <Rocket className="h-7 w-7 text-emerald-400" />Getting Started Guide
            </h2>
            <p className="text-muted-foreground">Your complete guide to setting up and managing your store</p>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Step-by-step instructions for beginners</Badge>
          </div>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400" />Quick Start Checklist
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {["Upload your logo", "Set contact details", "Add your first product", "Share your store link"].map((item, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${i === 1 ? "border-emerald-500/50 bg-emerald-500/10" : "border-border/50"}`}>
                    <CheckCircle className={`h-5 w-5 ${i === 1 ? "text-emerald-400" : "text-muted-foreground"}`} />
                    <span className={i === 1 ? "text-emerald-400" : ""}>{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Accordion type="single" collapsible defaultValue="workflow">
            <AccordionItem value="workflow">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />Business Hub Workflow Overview
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                <p className="text-muted-foreground mb-4">Your journey from setup to selling - follow these steps in order:</p>
                {[
                  { title: "Brand Your Store", desc: "Logo, name & contact details", color: "from-teal-500/20 to-teal-500/5 border-teal-500/30" },
                  { title: "Add Products", desc: "Upload up to 500 products", color: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30" },
                  { title: "Set Policies", desc: "Returns, refunds & privacy", color: "from-blue-500/20 to-blue-500/5 border-blue-500/30" },
                  { title: "Configure Shipping", desc: "Delivery partners & rates", color: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30" },
                  { title: "Create Discounts", desc: "Promo codes & sales", color: "from-amber-500/20 to-amber-500/5 border-amber-500/30" },
                  { title: "Start Selling", desc: "Manage orders & customers", color: "from-purple-500/20 to-purple-500/5 border-purple-500/30" },
                ].map((step, i) => (
                  <div key={i} className={`flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r ${step.color}`}>
                    <div className="flex items-center gap-3">
                      <Store className="h-5 w-5" />
                      <div>
                        <p className="font-medium">{step.title}</p>
                        <p className="text-sm text-muted-foreground">{step.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary/20 text-primary">{i + 1}</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        {/* Dashboard */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "Monthly Sales", value: `R${totalRevenue.toFixed(2)}`, sub: `${orders.length} orders this month`, color: "text-teal-400", icon: TrendingUp },
              { label: "Products Sold", value: `${completedOrders.length}`, sub: "This month", icon: Package },
              { label: "Inventory Value", value: `R${products.reduce((s: number, p: any) => s + (p.base_price || 0) * (p.stock || 0), 0)}`, sub: `${products.length} active products`, icon: Package },
              { label: "Open Tickets", value: `${openTickets.length}`, sub: "Support requests", color: "text-amber-400", icon: Headphones },
              { label: "Cart Items", value: "0", sub: "Ready to checkout", icon: ShoppingCart },
            ].map((stat, i) => (
              <Card key={i} className="bg-card/50 border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color || "text-foreground"}`}>{stat.value}</p>
                      <p className={`text-xs ${stat.color || "text-muted-foreground"}`}>{stat.sub}</p>
                    </div>
                    <stat.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "My Store", desc: "Manage your storefront", icon: Store, color: "from-teal-500/20 to-teal-500/5 border-teal-500/30", action: "Manage" },
              { title: "Products", desc: "Your product catalog", icon: Package, color: "from-purple-500/20 to-purple-500/5 border-purple-500/30", action: `${products.length} View` },
              { title: "Support", desc: "Customer support dashboard", icon: Headphones, color: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30", action: `${openTickets.length} Open Tickets` },
              { title: "Cart", desc: "Shopping cart", icon: ShoppingCart, color: "from-amber-500/20 to-amber-500/5 border-amber-500/30", action: "0 View" },
            ].map((card, i) => (
              <Card key={i} className={`bg-gradient-to-br ${card.color} cursor-pointer hover:opacity-90 transition`}
                onClick={() => setActiveTab(i === 0 ? "store-settings" : i === 1 ? "products" : i === 2 ? "support-tickets" : "orders")}>
                <CardContent className="p-6 text-center space-y-3">
                  <card.icon className="h-10 w-10 mx-auto" />
                  <div>
                    <p className="font-semibold">{card.title}</p>
                    <p className="text-sm text-muted-foreground">{card.desc}</p>
                  </div>
                  <Button size="sm" variant="secondary" className="gap-1">
                    <Settings className="h-3 w-3" />{card.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-bold">Free Tier Limits</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Products</span><span>{products.length} / 500</span></div>
                <Progress value={(products.length / 500) * 100} className="h-2" />
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">AI Category Images (Monthly)</span><span>0 / 50</span></div>
                <Progress value={0} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products */}
        <TabsContent value="products" className="space-y-6">
          <Card className="bg-primary/10 border-primary/30">
            <CardContent className="p-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Pricing Structure</p>
                <p className="text-sm text-muted-foreground">All prices include <strong className="text-foreground">15% VAT</strong> and <strong className="text-foreground">6% platform commission</strong>. The customer sees the final inclusive price. On refunds, the 6% commission is non-refundable.</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Products</h2>
              <p className="text-sm text-muted-foreground">Manage your product catalog</p>
            </div>
            <Button onClick={() => setShowAddProduct(true)} className="gap-2 bg-primary">
              <Plus className="h-4 w-4" />Add Product
            </Button>
          </div>

          {products.length === 0 ? (
            <Card className="bg-card/50 border-border/50">
              <CardContent className="py-12 text-center text-muted-foreground">
                <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>No products yet. Add your first product to get started.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left p-3">Product</th>
                    <th className="text-left p-3">SKU</th>
                    <th className="text-left p-3">Base Price</th>
                    <th className="text-left p-3">Customer Price</th>
                    <th className="text-left p-3">Stock</th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p: any) => (
                    <tr key={p.id} className="border-b border-border/50">
                      <td className="p-3 font-medium">{p.name}</td>
                      <td className="p-3 font-mono text-xs">{p.sku || "-"}</td>
                      <td className="p-3">R{(p.base_price || 0).toFixed(2)}</td>
                      <td className="p-3 text-primary">R{(p.customer_price || 0).toFixed(2)}</td>
                      <td className="p-3">{p.product_type === "digital" ? "∞" : p.stock}</td>
                      <td className="p-3 capitalize">{p.product_type}</td>
                      <td className="p-3"><Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 capitalize">{p.status}</Badge></td>
                      <td className="p-3 flex gap-2">
                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={async () => {
                          await supabase.from("business_products" as any).delete().eq("id", p.id);
                          setProducts(products.filter((x: any) => x.id !== p.id));
                          toast.success("Product deleted");
                        }}><Trash2 className="h-4 w-4" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        {/* Discounts */}
        <TabsContent value="discounts" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Discount Codes</h2>
              <p className="text-sm text-muted-foreground">Create and manage promotional codes</p>
            </div>
            <Button onClick={() => setShowAddDiscount(true)} className="gap-2 bg-primary">
              <Plus className="h-4 w-4" />Create Code
            </Button>
          </div>
          {discounts.length === 0 ? (
            <Card className="bg-card/50 border-border/50">
              <CardContent className="py-12 text-center text-muted-foreground">
                <Tag className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>No discount codes yet. Create your first promotional code.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {discounts.map((d: any) => (
                <Card key={d.id} className="bg-card/50 border-border/50">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-mono font-bold">{d.code}</p>
                      <p className="text-sm text-muted-foreground">{d.discount_type === "percentage" ? `${d.discount_value}% off` : `R${d.discount_value} off`} • {d.uses_count}/{d.max_uses || "∞"} uses</p>
                    </div>
                    <Badge className={d.is_active ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}>{d.is_active ? "Active" : "Inactive"}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Orders */}
        <TabsContent value="orders" className="space-y-6">
          <h2 className="text-xl font-bold">Orders</h2>
          <p className="text-sm text-muted-foreground">View and manage customer orders</p>
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-card/50 border-border/50"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Revenue</p><p className="text-2xl font-bold text-primary">R{totalRevenue.toFixed(2)}</p></CardContent></Card>
            <Card className="bg-card/50 border-border/50"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Completed Orders</p><p className="text-2xl font-bold text-emerald-400">{completedOrders.length}</p></CardContent></Card>
            <Card className="bg-card/50 border-border/50"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Pending Orders</p><p className="text-2xl font-bold text-purple-400">{pendingOrders.length}</p></CardContent></Card>
          </div>
          {orders.length === 0 ? (
            <Card className="bg-card/50 border-border/50">
              <CardContent className="py-12 text-center text-muted-foreground">
                <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>No orders yet. Orders will appear here when customers make purchases.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {orders.map((o: any) => (
                <Card key={o.id} className="bg-card/50 border-border/50">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{o.customer_name || "Customer"}</p>
                      <p className="text-sm text-muted-foreground">R{(o.total_amount || 0).toFixed(2)}</p>
                    </div>
                    <Badge className="capitalize">{o.status}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Shipping */}
        <TabsContent value="shipping" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Shipping Companies</h2>
              <p className="text-sm text-muted-foreground">Manage your shipping providers for waybill creation</p>
            </div>
            <Button onClick={() => setShowAddShipping(true)} className="gap-2 bg-primary">
              <Plus className="h-4 w-4" />Add Shipping Company
            </Button>
          </div>
          {shippingCompanies.length === 0 ? (
            <Card className="bg-card/50 border-border/50">
              <CardContent className="py-12 text-center text-muted-foreground">
                <Truck className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>No shipping companies yet. Add your first shipping provider.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {shippingCompanies.map((s: any) => (
                <Card key={s.id} className="bg-card/50 border-border/50">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-sm text-muted-foreground">{s.contact_email}</p>
                    </div>
                    <Badge className={s.is_active ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}>{s.is_active ? "Active" : "Inactive"}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Waybills */}
        <TabsContent value="waybills" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Waybills & Shipping</h2>
              <p className="text-sm text-muted-foreground">Create waybills and notify customers of shipments</p>
            </div>
            <div className="flex items-center gap-2">
              <Input placeholder="Search waybills..." className="w-48" />
              <Button onClick={() => setShowCreateWaybill(true)} className="gap-2 bg-primary">
                <Truck className="h-4 w-4" />Create Waybill
              </Button>
            </div>
          </div>

          {shippingCompanies.length === 0 && (
            <Card className="bg-amber-500/10 border-amber-500/30">
              <CardContent className="p-4 text-amber-400">
                You need to add shipping companies before creating waybills. Go to the Shipping tab to add your shipping providers.
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Awaiting Shipment", value: waybillsByStatus.awaiting, color: "text-foreground" },
              { label: "Pending", value: waybillsByStatus.pending, color: "text-amber-400" },
              { label: "In Transit", value: waybillsByStatus.transit, color: "text-primary" },
              { label: "Delivered", value: waybillsByStatus.delivered, color: "text-emerald-400" },
            ].map((s, i) => (
              <Card key={i} className="bg-card/50 border-border/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {waybills.length === 0 ? (
            <Card className="bg-card/50 border-border/50">
              <CardContent className="py-12 text-center text-muted-foreground">
                <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>No waybills yet. Create your first waybill for a physical order.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {waybills.map((w: any) => (
                <Card key={w.id} className="bg-card/50 border-border/50">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{w.tracking_number || "No tracking"}</p>
                      <p className="text-sm text-muted-foreground">{w.customer_name}</p>
                    </div>
                    <Badge className="capitalize">{w.status?.replace("_", " ")}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Support Tickets */}
        <TabsContent value="support-tickets" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Open Tickets", value: openTickets.length, color: "text-foreground", icon: Clock },
              { label: "In Progress", value: inProgressTickets.length, color: "text-amber-400", icon: AlertCircle },
              { label: "Resolved", value: resolvedTickets.length, color: "text-emerald-400", icon: CheckCircle },
              { label: "Total Tickets", value: supportTickets.length, icon: Headphones },
            ].map((s, i) => (
              <Card key={i} className="bg-card/50 border-border/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className={`text-2xl font-bold ${s.color || "text-foreground"}`}>{s.value}</p>
                  </div>
                  <s.icon className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Headphones className="h-5 w-5" />Support Tickets
              </h3>
              <div className="flex items-center gap-3">
                <Input placeholder="Search tickets..." className="flex-1" />
                <Select defaultValue="all">
                  <SelectTrigger className="w-32"><SelectValue placeholder="All Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {supportTickets.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No support tickets yet</p>
              ) : (
                <div className="space-y-3">
                  {supportTickets.map((t: any) => (
                    <Card key={t.id} className="bg-card border-border">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium">{t.subject}</p>
                          <p className="text-sm text-muted-foreground">{t.customer_name || t.customer_email}</p>
                        </div>
                        <Badge className="capitalize">{t.status?.replace("_", " ")}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Policies */}
        <TabsContent value="policies" className="space-y-6">
          {!policiesAccepted && (
            <Card className="bg-amber-500/10 border-amber-500/30">
              <CardContent className="p-4">
                <p className="font-medium text-amber-400">Step 1: Accept Platform Policies</p>
                <p className="text-sm text-muted-foreground">Before you can sell, you must review and accept our Seller Agreement, Platform Terms, and Data Processing Agreement.</p>
              </CardContent>
            </Card>
          )}

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <FileText className="h-5 w-5" />Store Policies
                </h3>
                <p className="text-sm text-muted-foreground">Manage platform agreements and your customer-facing policies.</p>
              </div>

              <Tabs defaultValue="platform">
                <TabsList className="flex-wrap h-auto gap-1 bg-muted/30 p-1">
                  <TabsTrigger value="platform" className="gap-1"><FileText className="h-3.5 w-3.5" />Platform Policies</TabsTrigger>
                  <TabsTrigger value="terms">Terms</TabsTrigger>
                  <TabsTrigger value="refund">Refund</TabsTrigger>
                  <TabsTrigger value="returns">Returns</TabsTrigger>
                  <TabsTrigger value="privacy">Privacy</TabsTrigger>
                  <TabsTrigger value="shipping-policy">Shipping</TabsTrigger>
                </TabsList>

                <TabsContent value="platform" className="space-y-4 mt-4">
                  {[
                    { title: "Seller Agreement", desc: "Your agreement to sell products on our platform. Covers commission, payments, seller obligations, and prohibited items.", action: "Read Full Agreement", icon: FileText, color: "text-blue-400" },
                    { title: "Platform Terms of Service", desc: "General terms governing use of the platform for all users. Covers accounts, rules, fees, and content policies.", action: "Read Full Terms", icon: AlertCircle, color: "text-purple-400" },
                    { title: "Data Processing Agreement", desc: "POPIA-compliant agreement for processing customer personal information. Covers data protection, security, and your obligations.", action: "Read Full DPA", icon: Eye, color: "text-emerald-400" },
                  ].map((policy, i) => (
                    <Card key={i} className="bg-card border-border">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <policy.icon className={`h-5 w-5 ${policy.color}`} />
                          <div>
                            <p className="font-medium">{policy.title}</p>
                            <p className="text-sm text-muted-foreground">{policy.desc}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Eye className="h-3.5 w-3.5" />{policy.action}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}

                  {!policiesAccepted && (
                    <Card className="bg-card border-border">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start gap-2">
                          <Checkbox id="accept-policies" />
                          <div>
                            <label htmlFor="accept-policies" className="text-sm font-medium cursor-pointer">
                              I have read and agree to the Seller Agreement, Platform Terms of Service, and Data Processing Agreement
                            </label>
                            <p className="text-xs text-muted-foreground">By accepting, you agree to comply with all platform policies and South African e-commerce regulations including the CPA, ECTA, and POPIA.</p>
                          </div>
                        </div>
                        <Button onClick={acceptPolicies} className="gap-2 bg-purple-500 hover:bg-purple-600">
                          <CheckCircle className="h-4 w-4" />Accept Platform Policies
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {["terms", "refund", "returns", "privacy", "shipping-policy"].map((tab) => (
                  <TabsContent key={tab} value={tab} className="mt-4">
                    <Card className="bg-card/50 border-border/50">
                      <CardContent className="py-8 text-center text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="capitalize">{tab.replace("-", " ")} policy editor</p>
                        <p className="text-sm">Customize your store's {tab.replace("-", " ")} policy</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Store Settings */}
        <TabsContent value="store-settings" className="space-y-6">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-xl font-bold">Store Settings</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Store Name *</Label>
                  <Input value={settingsForm.storeName} onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Store Logo</Label>
                  <Input type="file" />
                </div>
                <div className="space-y-2">
                  <Label>Email Address *</Label>
                  <Input value={settingsForm.email} onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input value={settingsForm.phone} onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>WhatsApp Number * (for customer inquiries)</Label>
                <Input value={settingsForm.whatsapp} onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })} />
                <p className="text-xs text-muted-foreground">Customers can ask questions via WhatsApp using this number</p>
              </div>

              <div className="space-y-2">
                <Label>Physical Address *</Label>
                <Textarea value={settingsForm.address} onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })} rows={3} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Latitude (Google Maps)</Label>
                  <Input value={settingsForm.latitude} onChange={(e) => setSettingsForm({ ...settingsForm, latitude: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Longitude (Google Maps)</Label>
                  <Input value={settingsForm.longitude} onChange={(e) => setSettingsForm({ ...settingsForm, longitude: e.target.value })} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Get coordinates from <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-primary hover:underline">Google Maps</a> by right-clicking your business location</p>

              <div className="space-y-2">
                <Label>Vendor ID</Label>
                <Input value={settingsForm.vendorId} onChange={(e) => setSettingsForm({ ...settingsForm, vendorId: e.target.value })} disabled />
                <p className="text-xs text-muted-foreground">This is your unique identifier for multi-vendor support.</p>
              </div>

              <div className="flex gap-3">
                <Button onClick={saveStoreSettings} className="bg-primary">Save Changes</Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Guide */}
        <TabsContent value="user-guide" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />Business Hub User Guide
              </h2>
              <p className="text-sm text-muted-foreground">Step-by-step guide to setting up and running your store</p>
            </div>
            <Button className="gap-2 bg-primary">
              <Download className="h-4 w-4" />Download PDF Guide
            </Button>
          </div>

          <Tabs defaultValue="templates">
            <TabsList className="grid w-full grid-cols-6 bg-card/50">
              <TabsTrigger value="templates" className="gap-1"><Rocket className="h-3.5 w-3.5" />Templates</TabsTrigger>
              <TabsTrigger value="guide-products">Products</TabsTrigger>
              <TabsTrigger value="guide-orders">Orders</TabsTrigger>
              <TabsTrigger value="guide-marketing">Marketing</TabsTrigger>
              <TabsTrigger value="guide-full">Full Guide</TabsTrigger>
              <TabsTrigger value="guide-faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Starter</Badge>
                <span className="text-sm text-muted-foreground ml-2">— Get your store running</span>
              </div>
              {[
                { name: "Solo Vendor", badge: "Starter", desc: "Single product store with basic settings. Perfect first store.", time: "10 min", color: "border-teal-500/30" },
                { name: "Product Catalogue", badge: "Starter", desc: "Multi-product store with categories and organised listings.", time: "20 min", color: "border-teal-500/30" },
              ].map((t, i) => (
                <Card key={i} className={`bg-card/50 ${t.color} cursor-pointer hover:opacity-90`}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Store className="h-5 w-5" />
                      <div>
                        <p className="font-medium">{t.name} <Badge className="ml-2 bg-emerald-500/20 text-emerald-400">{t.badge}</Badge></p>
                        <p className="text-sm text-muted-foreground">{t.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />{t.time}
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="space-y-2 mt-6">
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Growth</Badge>
                <span className="text-sm text-muted-foreground ml-2">— Drive sales and streamline fulfilment</span>
              </div>
              {[
                { name: "Discount Marketer", badge: "Growth", desc: "Drive sales with coupon codes, seasonal promotions, and loyalty rewards.", time: "15 min", color: "border-amber-500/30" },
                { name: "Fulfilment Pro", badge: "Growth", desc: "Streamlined order processing with shipping partners and waybills.", time: "25 min", color: "border-amber-500/30" },
              ].map((t, i) => (
                <Card key={i} className={`bg-card/50 ${t.color} cursor-pointer hover:opacity-90`}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Tag className="h-5 w-5" />
                      <div>
                        <p className="font-medium">{t.name} <Badge className="ml-2 bg-amber-500/20 text-amber-400">{t.badge}</Badge></p>
                        <p className="text-sm text-muted-foreground">{t.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />{t.time}
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="space-y-2 mt-6">
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Scale</Badge>
                <span className="text-sm text-muted-foreground ml-2">— Full e-commerce operation</span>
              </div>
              <Card className="bg-card/50 border-purple-500/30 cursor-pointer hover:opacity-90">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Business Empire <Badge className="ml-2 bg-purple-500/20 text-purple-400">Scale</Badge></p>
                      <p className="text-sm text-muted-foreground">Full-scale e-commerce operation with analytics and customer management.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />45 min
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {["guide-products", "guide-orders", "guide-marketing", "guide-full", "guide-faq"].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-4">
                <Card className="bg-card/50 border-border/50">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="capitalize">{tab.replace("guide-", "")} guide content</p>
                    <p className="text-sm">Detailed documentation coming soon</p>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>
      </Tabs>

      {/* Add Product Modal */}
      <AddProductModal
        open={showAddProduct}
        onOpenChange={setShowAddProduct}
        businessId={business?.id}
        onAdded={(p) => { setProducts([p, ...products]); setShowAddProduct(false); }}
      />

      {/* Add Discount Modal */}
      <AddDiscountModal
        open={showAddDiscount}
        onOpenChange={setShowAddDiscount}
        businessId={business?.id}
        onAdded={(d) => { setDiscounts([d, ...discounts]); setShowAddDiscount(false); }}
      />

      {/* Add Shipping Modal */}
      <AddShippingModal
        open={showAddShipping}
        onOpenChange={setShowAddShipping}
        businessId={business?.id}
        onAdded={(s) => { setShippingCompanies([...shippingCompanies, s]); setShowAddShipping(false); }}
      />
    </div>
  );
}

// --- Add Product Modal ---
function AddProductModal({ open, onOpenChange, businessId, onAdded }: { open: boolean; onOpenChange: (v: boolean) => void; businessId: string; onAdded: (p: any) => void }) {
  const [form, setForm] = useState({ name: "", sku: "", basePrice: "", stock: "", type: "physical", description: "" });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const basePrice = parseFloat(form.basePrice) || 0;
      const customerPrice = basePrice * 1.21; // 15% VAT + 6% commission
      const { data, error } = await supabase.from("business_products" as any).insert({
        business_id: businessId, name: form.name, sku: form.sku || null,
        base_price: basePrice, customer_price: parseFloat(customerPrice.toFixed(2)),
        stock: parseInt(form.stock) || 0, product_type: form.type, description: form.description,
      }).select().single();
      if (error) throw error;
      onAdded(data);
      toast.success("Product added!");
      setForm({ name: "", sku: "", basePrice: "", stock: "", type: "physical", description: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Product</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>SKU</Label><Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} /></div>
            <div className="space-y-2"><Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="physical">Physical</SelectItem><SelectItem value="digital">Digital</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Base Price (R)</Label><Input type="number" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: e.target.value })} /></div>
            <div className="space-y-2"><Label>Stock</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
          </div>
          <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
          <Button onClick={handleSave} disabled={saving} className="w-full">{saving ? "Saving..." : "Add Product"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- Add Discount Modal ---
function AddDiscountModal({ open, onOpenChange, businessId, onAdded }: { open: boolean; onOpenChange: (v: boolean) => void; businessId: string; onAdded: (d: any) => void }) {
  const [form, setForm] = useState({ code: "", type: "percentage", value: "", maxUses: "" });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.code.trim()) { toast.error("Code is required"); return; }
    setSaving(true);
    try {
      const { data, error } = await supabase.from("business_discount_codes" as any).insert({
        business_id: businessId, code: form.code.toUpperCase(), discount_type: form.type,
        discount_value: parseFloat(form.value) || 0, max_uses: parseInt(form.maxUses) || null,
      }).select().single();
      if (error) throw error;
      onAdded(data);
      toast.success("Discount code created!");
      setForm({ code: "", type: "percentage", value: "", maxUses: "" });
    } catch (err) {
      toast.error("Failed to create discount");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Discount Code</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Code *</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. SUMMER20" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="percentage">Percentage</SelectItem><SelectItem value="fixed">Fixed Amount</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Value</Label><Input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} /></div>
          </div>
          <div className="space-y-2"><Label>Max Uses (optional)</Label><Input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} /></div>
          <Button onClick={handleSave} disabled={saving} className="w-full">{saving ? "Creating..." : "Create Code"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- Add Shipping Company Modal ---
function AddShippingModal({ open, onOpenChange, businessId, onAdded }: { open: boolean; onOpenChange: (v: boolean) => void; businessId: string; onAdded: (s: any) => void }) {
  const [form, setForm] = useState({ name: "", trackingUrl: "", email: "", phone: "" });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const { data, error } = await supabase.from("business_shipping_companies" as any).insert({
        business_id: businessId, name: form.name, tracking_url: form.trackingUrl,
        contact_email: form.email, contact_phone: form.phone,
      }).select().single();
      if (error) throw error;
      onAdded(data);
      toast.success("Shipping company added!");
      setForm({ name: "", trackingUrl: "", email: "", phone: "" });
    } catch (err) {
      toast.error("Failed to add shipping company");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Shipping Company</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Company Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="space-y-2"><Label>Tracking URL</Label><Input value={form.trackingUrl} onChange={(e) => setForm({ ...form, trackingUrl: e.target.value })} placeholder="https://track.example.com/{tracking_number}" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full">{saving ? "Adding..." : "Add Company"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}