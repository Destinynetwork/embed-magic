import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

export function FreeTierHelpSupport() {
  return (
    <Card className="border-border/50">
      <CardContent className="p-8 text-center">
        <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-bold text-foreground mb-2">Help & Support</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Need help? Our support team is here to assist you with any questions about the Free Tier services.
        </p>
      </CardContent>
    </Card>
  );
}
