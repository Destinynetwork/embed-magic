import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GUIDE_SECTIONS, getTierColor } from "./guideData";

export function GuideOverview() {
  return (
    <div className="space-y-6 print:bg-white print:text-black">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 print:grid-cols-2">
        {GUIDE_SECTIONS.map((section) => (
          <Card key={section.part} className="bg-muted/30 border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  Part {section.part}
                </Badge>
                <Badge className={`text-xs ${getTierColor(section.tier.replace("+", ""))}`}>
                  {section.tier}
                </Badge>
              </div>
              <CardTitle className="text-sm text-foreground mt-2">
                {section.title}
              </CardTitle>
              <p className="text-xs text-foreground/60">Pages {section.pages}</p>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-1">
                {section.chapters.map((chapter, idx) => (
                  <li key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-foreground/80 truncate flex-1">
                      {chapter.title}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ml-2 shrink-0 ${getTierColor(chapter.tier)}`}
                    >
                      p.{chapter.page}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tier Legend */}
      <div className="flex flex-wrap gap-4 justify-center pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-sm text-foreground/80">Starter — Core store features</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-500" />
          <span className="text-sm text-foreground/80">Growth — Marketing & fulfilment</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-sm text-foreground/80">Scale — Analytics & advanced tools</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-muted-foreground/50" />
          <span className="text-sm text-foreground/80">All — Available to everyone</span>
        </div>
      </div>
    </div>
  );
}
