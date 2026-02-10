import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Store, Play } from "lucide-react";

export function FreeTierBusinessHub() {
  const navigate = useNavigate();

  return (
    <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-900/10 to-emerald-800/5">
      <CardContent className="p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Store className="h-7 w-7 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">My Business Hub</h2>
            <p className="text-muted-foreground">Create and manage your online store</p>
          </div>
        </div>

        <p className="text-muted-foreground mb-8 max-w-2xl">
          Create your store in minutes. Add up to 500 products, customize your branding, and track
          everything via your dashboard.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="font-semibold text-foreground mb-4">Features Included:</h4>
            <ul className="space-y-3">
              {["500 products", "Custom branding", "Full dashboard", "Order management"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Business Tools:</h4>
            <ul className="space-y-3">
              {["Product catalog", "Discount codes", "Shipping management"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
          <Store className="h-4 w-4" />
          Launch Business Hub
        </Button>
      </CardContent>
    </Card>
  );
}
