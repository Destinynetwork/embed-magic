import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GUIDE_SECTIONS, getTierColor } from "./guideData";
import { BookOpen, ChevronRight } from "lucide-react";

export function GuideOverview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-amber-900/30 to-cyan-900/30 border border-amber-500/30">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-cyan-500/20 border border-amber-500/30">
            <BookOpen className="h-8 w-8 text-amber-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Complete Embed Pro Guide</h3>
            <p className="text-muted-foreground">
              108 pages covering every feature. Download the PDF to use as a second-screen reference 
              while embedding your professional content.
            </p>
          </div>
        </div>
      </div>

      {/* Tier Legend */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted-foreground">Experience Tiers:</span>
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">Beginner</Badge>
        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">Intermediate</Badge>
        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">Professional</Badge>
      </div>

      {/* Sections Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {GUIDE_SECTIONS.map((section) => (
          <Card key={section.part} className="border-border hover:border-amber-500/50 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">
                    {section.part}
                  </span>
                  {section.title}
                </CardTitle>
                <Badge variant="outline" className={getTierColor(section.tier.replace("+", ""))}>
                  {section.tier}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Pages {section.pages}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5">
                {section.chapters.map((chapter) => (
                  <li 
                    key={chapter.page} 
                    className="flex items-center justify-between text-sm group"
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-amber-400 transition-colors" />
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                        {chapter.title}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">p.{chapter.page}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Summary */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardHeader>
          <CardTitle className="text-base text-amber-400">Embed Pro Features Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-semibold text-foreground">250</div>
              <div className="text-muted-foreground text-xs">Content Items</div>
            </div>
            <div>
              <div className="font-semibold text-foreground">25/mo</div>
              <div className="text-muted-foreground text-xs">AI Generations</div>
            </div>
            <div>
              <div className="font-semibold text-foreground">13+</div>
              <div className="text-muted-foreground text-xs">Platforms</div>
            </div>
            <div>
              <div className="font-semibold text-foreground">12</div>
              <div className="text-muted-foreground text-xs">Live Guests</div>
            </div>
            <div>
              <div className="font-semibold text-foreground">DRM</div>
              <div className="text-muted-foreground text-xs">Protection</div>
            </div>
            <div>
              <div className="font-semibold text-foreground">Watermark</div>
              <div className="text-muted-foreground text-xs">Dynamic</div>
            </div>
            <div>
              <div className="font-semibold text-foreground">Analytics</div>
              <div className="text-muted-foreground text-xs">Deep Insights</div>
            </div>
            <div>
              <div className="font-semibold text-foreground">Events</div>
              <div className="text-muted-foreground text-xs">Ticket Sales</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
