import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { toast } from "sonner";

export function FreeTierHelpSupport() {
  const handleOpenHelp = () => {
    toast.info("Help Center is coming soon. For now, check the User Guide tab for detailed guides and FAQ.");
  };

  return (
    <Card className="border-cyan-500/20 bg-gradient-to-r from-cyan-900/10 to-cyan-800/5">
      <CardContent className="p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <HelpCircle className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Need Help with Free Tier?</h2>
              <p className="text-sm text-muted-foreground">Guides for embedding, streaming, monetization & more</p>
            </div>
          </div>
          <Button onClick={handleOpenHelp} className="gap-2 bg-cyan-600 hover:bg-cyan-700 text-white">
            <HelpCircle className="h-4 w-4" />
            Open Help Center
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
