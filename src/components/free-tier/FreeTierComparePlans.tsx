import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Settings2 } from "lucide-react";

export function FreeTierComparePlans() {
  const navigate = useNavigate();

  return (
    <Card className="border-border/50">
      <CardContent className="p-8 text-center">
        <Settings2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-bold text-foreground mb-2">Compare Plans</h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          See how the Free Tier compares with Embed Pro and other premium plans.
        </p>
        <Button onClick={() => navigate("/pricing")} className="bg-primary hover:bg-primary/90">
          View Pricing
        </Button>
      </CardContent>
    </Card>
  );
}
