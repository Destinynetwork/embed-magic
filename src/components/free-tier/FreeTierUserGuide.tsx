import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export function FreeTierUserGuide() {
  return (
    <Card className="border-border/50">
      <CardContent className="p-8 text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-bold text-foreground mb-2">User Guide</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Coming soon — a comprehensive guide to help you get the most out of the Free Tier services.
        </p>
      </CardContent>
    </Card>
  );
}
