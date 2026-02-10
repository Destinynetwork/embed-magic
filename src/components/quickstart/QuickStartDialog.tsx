import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export interface GuideStep {
  id: string | number;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  tip?: string;
}

interface QuickStartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  steps: GuideStep[];
  initialStep?: number;
}

export function QuickStartDialog({ open, onOpenChange, steps, initialStep = 0 }: QuickStartDialogProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);

  useEffect(() => {
    if (!open) setCurrentStep(initialStep);
  }, [open, initialStep]);

  const safeIndex = useMemo(() => {
    if (currentStep < 0) return 0;
    if (currentStep > steps.length - 1) return steps.length - 1;
    return currentStep;
  }, [currentStep, steps.length]);

  const step = steps[safeIndex];
  const progress = steps.length ? ((safeIndex + 1) / steps.length) * 100 : 0;

  const close = () => {
    setCurrentStep(initialStep);
    onOpenChange(false);
  };

  const handleNext = () => {
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) close();
        else onOpenChange(true);
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="shrink-0">
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="flex items-center gap-3">
              {step?.icon}
              <div>
                <span className="block">{step?.title}</span>
                {step?.subtitle ? (
                  <span className="text-sm font-normal text-muted-foreground">{step.subtitle}</span>
                ) : null}
              </div>
            </DialogTitle>
            <Badge variant="outline" className="shrink-0">
              {safeIndex + 1} / {steps.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-1.5 mt-4" />
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {step?.content}

          {step?.tip ? (
            <div className="mt-4 bg-primary/5 border border-primary/20 rounded-lg p-3 flex gap-2">
              <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Pro Tip:</strong> {step.tip}
              </p>
            </div>
          ) : null}
        </div>

        <div className="shrink-0 flex items-center justify-between pt-4 border-t">
          <Button variant="ghost" onClick={handlePrev} disabled={safeIndex === 0} className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-1">
            {steps.map((_, idx) => (
              <button
                key={String(steps[idx]?.id ?? idx)}
                onClick={() => setCurrentStep(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === safeIndex ? "bg-primary" : "bg-muted-foreground/30"
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          {safeIndex === steps.length - 1 ? (
            <Button onClick={close} className="gap-2">
              Get Started
              <Sparkles className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleNext} className="gap-2">
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
