import { useEffect, useState } from "react";
import { UnifiedAdminLayout } from "@/components/admin/UnifiedAdminLayout";
import { ProductFilter } from "@/components/admin/ProductFilter";
import { adminApi } from "@/lib/admin-api";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Search } from "lucide-react";

export default function AdminProAssets() {
  const [assets, setAssets] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [productFilter, setProductFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const loadData = (product?: string, searchVal?: string) => {
    setLoading(true);
    const p = product === "all" ? undefined : product;
    adminApi.proAssets(p, searchVal || undefined)
      .then((d) => setAssets(d.assets || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    adminApi.overview().then((d) => setProducts(d.products || [])).catch(() => {});
    loadData();
  }, []);

  useEffect(() => { loadData(productFilter, search); }, [productFilter]);

  const handleSearch = () => loadData(productFilter, search);

  return (
    <UnifiedAdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-2xl font-bold">Pro Assets</h2>
          <ProductFilter products={products} value={productFilter} onChange={setProductFilter} />
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search assets..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
          </div>
        </div>

        {error && <p className="text-destructive">{error}</p>}

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : (
          <div className="rounded-lg border border-border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>CDN</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-10">No assets found</TableCell></TableRow>
                ) : assets.map((a: any, i: number) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{a.title}</TableCell>
                    <TableCell>{a.cdn_provider}</TableCell>
                    <TableCell><Badge variant="outline">{a.product_name}</Badge></TableCell>
                    <TableCell><Badge variant={a.status === "ready" ? "default" : "secondary"}>{a.status}</Badge></TableCell>
                    <TableCell className="text-muted-foreground text-xs">{new Date(a.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </UnifiedAdminLayout>
  );
}
