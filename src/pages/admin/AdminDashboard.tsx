import { useEffect, useState } from "react";
import { UnifiedAdminLayout } from "@/components/admin/UnifiedAdminLayout";
import { ProductFilter } from "@/components/admin/ProductFilter";
import { adminApi } from "@/lib/admin-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, FileText, Video, Activity } from "lucide-react";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [productFilter, setProductFilter] = useState("all");

  useEffect(() => {
    adminApi.overview().then(setData).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const filteredProducts = productFilter === "all"
    ? data?.per_product || []
    : (data?.per_product || []).filter((p: any) => p.product_key === productFilter);

  const filteredRecent = productFilter === "all"
    ? data?.recent || []
    : (data?.recent || []).filter((r: any) => r.product_key === productFilter);

  const globalStats = productFilter === "all"
    ? data?.global
    : filteredProducts.reduce(
        (acc: any, p: any) => ({
          total_users: acc.total_users + (p.stats?.total_users || 0),
          free_embed_count: acc.free_embed_count + (p.stats?.free_embed_count || 0),
          pro_asset_count: acc.pro_asset_count + (p.stats?.pro_asset_count || 0),
        }),
        { total_users: 0, free_embed_count: 0, pro_asset_count: 0 }
      );

  return (
    <UnifiedAdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-2xl font-bold">Global Dashboard</h2>
          {data?.products && (
            <ProductFilter products={data.products} value={productFilter} onChange={setProductFilter} />
          )}
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && <p className="text-destructive">{error}</p>}

        {globalStats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" /> Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{globalStats.total_users.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Free Embeds
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{globalStats.free_embed_count.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <Video className="h-4 w-4" /> Pro Assets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{globalStats.pro_asset_count.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Per-product breakdown */}
        {filteredProducts.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Per Product</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((p: any) => (
                <Card key={p.product_key}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      {p.name}
                      {p.error && <Badge variant="destructive">Error</Badge>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-1">
                    {p.stats ? (
                      <>
                        <p>Users: {p.stats.total_users}</p>
                        <p>Free Embeds: {p.stats.free_embed_count}</p>
                        <p>Pro Assets: {p.stats.pro_asset_count}</p>
                      </>
                    ) : (
                      <p className="text-destructive text-xs">{p.error}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Recent activity */}
        {filteredRecent.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4" /> Recent Activity
            </h3>
            <div className="bg-card rounded-lg border border-border divide-y divide-border">
              {filteredRecent.slice(0, 20).map((ev: any, i: number) => (
                <div key={i} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Badge variant={ev.type === "PRO_ASSET_CREATED" ? "default" : "secondary"} className="text-xs">
                      {ev.type === "PRO_ASSET_CREATED" ? "Pro" : "Free"}
                    </Badge>
                    <span className="text-muted-foreground">{ev.product_name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(ev.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </UnifiedAdminLayout>
  );
}
