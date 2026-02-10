import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Edit, Trash2, Film } from "lucide-react";
import { formatPrice } from "@/lib/currency";

interface ContentItem {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  content_type: string;
  embed_urls: string[] | null;
  embed_provider: string | null;
  is_ppv?: boolean | null;
  price?: number | null;
  is_approved?: boolean;
  channel_id?: string | null;
  qa_status?: string | null;
}

interface EmbedProCategoryRowProps {
  title: string;
  items: ContentItem[];
  channelPrice?: number | null;
  selectedId?: string;
  onPlay?: (item: ContentItem) => void;
  onEdit?: (item: ContentItem) => void;
  onDelete?: (id: string) => void;
}

export function EmbedProCategoryRow({ 
  title, 
  items, 
  channelPrice,
  selectedId,
  onPlay, 
  onEdit, 
  onDelete 
}: EmbedProCategoryRowProps) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Badge variant="secondary" className="text-xs">
            {items.length} items
          </Badge>
          {channelPrice != null && channelPrice > 0 && (
            <Badge variant="outline" className="text-xs">
              {formatPrice(channelPrice)}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {items.map((item) => (
          <Card
            key={item.id}
            className="min-w-[200px] max-w-[200px] bg-card/50 border-border/50 group cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => onPlay?.(item)}
          >
            <div className="relative aspect-video overflow-hidden rounded-t-lg">
              {item.thumbnail_url ? (
                <img
                  src={item.thumbnail_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Film className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <Play className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {item.qa_status === "rejected" && (
                <Badge className="absolute top-1 right-1 bg-red-500/80 text-xs">Rejected</Badge>
              )}
              {!item.is_approved && item.qa_status !== "rejected" && (
                <Badge className="absolute top-1 right-1 bg-yellow-500/80 text-xs">Pending</Badge>
              )}
            </div>
            <CardContent className="p-3">
              <p className="text-sm font-medium truncate">{item.title}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground">{item.content_type}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive"
                      onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
