import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Play } from "lucide-react";

export function FreeTierCreatorDashboard() {
  return (
    <Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-900/10 to-cyan-800/5">
      <CardContent className="p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-cyan-500/20 flex items-center justify-center">
            <BarChart3 className="h-7 w-7 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Creator Dashboard</h2>
            <p className="text-muted-foreground">Manage your creator business</p>
          </div>
        </div>

        <p className="text-muted-foreground mb-8 max-w-2xl">
          Manage events, track earnings, payouts, and your audience CRM. Sell up to 100 tickets per
          month with full analytics.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="font-semibold text-foreground mb-4">Features Included:</h4>
            <ul className="space-y-3">
              {["100 tickets/month", "Earnings & payouts", "Full CRM access", "Event management"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Analytics & Insights:</h4>
            <ul className="space-y-3">
              {["Revenue tracking", "Audience insights", "Performance reports"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Button className="gap-2 bg-cyan-600 hover:bg-cyan-700 text-white">
          <BarChart3 className="h-4 w-4" />
          Launch Creator Dashboard
        </Button>
      </CardContent>
    </Card>
  );
}
