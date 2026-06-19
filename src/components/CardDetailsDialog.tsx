import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { ReactNode } from "react";

export interface CardDetails {
  title: string;
  category?: string;
  description: string;
  image?: string;
  imageBg?: string;
  features?: string[];
  url?: string;
  icon?: ReactNode;
}

interface Props {
  details: CardDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CardDetailsDialog = ({ details, open, onOpenChange }: Props) => {
  if (!details) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {details.category && (
            <span className="text-primary text-sm font-medium text-right">{details.category}</span>
          )}
          <DialogTitle className="text-2xl text-right flex items-center gap-3 justify-end">
            {details.title}
            {details.icon}
          </DialogTitle>
        </DialogHeader>

        {details.image && (
          <div className={`rounded-xl overflow-hidden ${details.imageBg || "bg-muted"}`}>
            <img
              src={details.image}
              alt={details.title}
              className="w-full h-56 object-contain p-6"
            />
          </div>
        )}

        <DialogDescription className="text-base leading-relaxed text-right text-foreground/80">
          {details.description}
        </DialogDescription>

        {details.features && details.features.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-end">
            {details.features.map((f, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-muted text-xs text-muted-foreground">
                {f}
              </span>
            ))}
          </div>
        )}

        {details.url && (
          <Button asChild variant="hero" className="w-full mt-2">
            <a href={details.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
              زيارة الموقع
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CardDetailsDialog;
