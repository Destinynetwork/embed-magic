import { useEffect, useState } from "react";
import { UnifiedAdminLayout } from "@/components/admin/UnifiedAdminLayout";
import { ProductFilter } from "@/components/admin/ProductFilter";
import { adminApi } from "@/lib/admin-api";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Search } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [productFilter, setProductFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const loadData = (product?: string, searchVal?: string) => {
    setLoading(true);
    const p = product === "all" ? undefined : product;
    adminApi.users(p, searchVal || undefined)
      .then((d) => setUsers(d.users || []))
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
          <h2 className="text-2xl font-bold">Users</h2>
          <ProductFilter products={products} value={productFilter} onChange={setProductFilter} />
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users by email..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
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
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Free Embeds</TableHead>
                  <TableHead>Pro Assets</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-10">No users found</TableCell></TableRow>
                ) : users.map((u: any, i: number) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{u.email}</TableCell>
                    <TableCell>{u.full_name || u.display_name || "—"}</TableCell>
                    <TableCell><Badge variant="outline">{u.plan || "free"}</Badge></TableCell>
                    <TableCell><Badge variant="secondary">{u.product_name}</Badge></TableCell>
                    <TableCell>{u.free_embed_count ?? "—"}</TableCell>
                    <TableCell>{u.pro_asset_count ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{new Date(u.created_at).toLocaleDateString()}</TableCell>
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
