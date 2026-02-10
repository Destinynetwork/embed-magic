import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EmbedProTemplateWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: {
    id: string;
    name: string;
    description: string;
    steps: { title: string; description: string }[];
    category?: string;
    [key: string]: unknown;
  };
  profileId?: string;
  onChannelCreated?: () => void;
}

export function EmbedProTemplateWizard({
  open,
  onOpenChange,
  template,
  profileId,
  onChannelCreated,
}: EmbedProTemplateWizardProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Setup: {template.name}
            <Badge variant="secondary">Template</Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-muted-foreground">{template.description}</p>
          <div className="space-y-3">
            {template.steps.map((step, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                  {i + 1}
                </div>
                <div>
                  <p className="font-medium text-sm">{step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground italic">
            Full wizard functionality coming soon. Use the Channel Manager to set up your content.
          </p>
          <Button className="w-full" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
