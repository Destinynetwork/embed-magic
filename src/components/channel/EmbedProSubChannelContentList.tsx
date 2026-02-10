import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  ChevronDown, 
  ChevronUp, 
  Film, 
  Play,
  Eye,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EmbedProContentItem {
  id: string;
  title: string;
  thumbnail_url: string | null;
  is_approved: boolean;
  content_type: string;
  embed_urls: string[] | null;
}

interface EmbedProSubChannelContentListProps {
  channelId: string;
  channelName: string;
  contentCount: number;
}

export function EmbedProSubChannelContentList({ 
  channelId, 
  channelName,
  contentCount,
}: EmbedProSubChannelContentListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState<EmbedProContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previewContent, setPreviewContent] = useState<EmbedProContentItem | null>(null);

  const fetchContent = async () => {
    if (content.length > 0) return; // Already fetched
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('embed_pro_content')
        .select('id, title, thumbnail_url, is_approved, content_type, embed_urls')
        .eq('channel_id', channelId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setContent(data || []);
    } catch (err) {
      console.error('Failed to fetch channel content:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
    if (!isExpanded && content.length === 0) {
      fetchContent();
    }
    setIsExpanded(!isExpanded);
  };

  const getPlayableUrl = (item: EmbedProContentItem): string | null => {
    if (item.embed_urls && item.embed_urls.length > 0) {
      return item.embed_urls[0];
    }
    return null;
  };

  const handlePreview = (item: EmbedProContentItem) => {
    const url = getPlayableUrl(item);
    if (url) {
      setPreviewContent(item);
    }
  };

  if (contentCount === 0) {
    return null;
  }

  return (
    <>
      <div className="mt-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
          onClick={handleToggle}
        >
          {isExpanded ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
          <Eye className="h-3 w-3" />
          {isExpanded ? 'Hide content' : 'View content'}
        </Button>

        {isExpanded && (
          <div className="mt-2 pl-2 border-l-2 border-primary/20 space-y-1">
            {isLoading ? (
              <div className="py-2 text-xs text-muted-foreground">Loading content...</div>
            ) : content.length === 0 ? (
              <div className="py-2 text-xs text-muted-foreground">No content found</div>
            ) : (
              content.map((item, index) => {
                const hasPlayableUrl = getPlayableUrl(item) !== null;
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center gap-2 py-1.5 px-2 rounded text-xs",
                      "hover:bg-accent/50 transition-colors group",
                      hasPlayableUrl && "cursor-pointer"
                    )}
                    onClick={() => hasPlayableUrl && handlePreview(item)}
                  >
                    <span className="text-muted-foreground w-4 text-right">
                      {index + 1}.
                    </span>
                    
                    {item.thumbnail_url ? (
                      <img 
                        src={item.thumbnail_url} 
                        alt="" 
                        className="w-8 h-5 object-cover rounded"
                      />
                    ) : (
                      <div className="w-8 h-5 bg-muted rounded flex items-center justify-center">
                        <Film className="h-3 w-3 text-muted-foreground" />
                      </div>
                    )}
                    
                    <span className="flex-1 truncate font-medium">
                      {item.title}
                    </span>
                    
                    {!item.is_approved && (
                      <Badge variant="outline" className="text-[10px] h-4 px-1 text-yellow-600 border-yellow-600/30">
                        Pending
                      </Badge>
                    )}
                    
                    {hasPlayableUrl && (
                      <Play className="h-3 w-3 opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
                    )}
                  </div>
                );
              })
            )}
            
            {content.length > 0 && contentCount > content.length && (
              <div className="py-1 text-xs text-muted-foreground text-center">
                +{contentCount - content.length} more items
              </div>
            )}
          </div>
        )}
      </div>

      {/* Preview Modal - Opens external embed in iframe */}
      <Dialog open={!!previewContent} onOpenChange={() => setPreviewContent(null)}>
        <DialogContent className="max-w-4xl h-[80vh] p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-4 pb-2 border-b bg-card">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg">
                  Preview
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {previewContent?.title}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {previewContent && !previewContent.is_approved && (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-600/30">
                    Pending Approval
                  </Badge>
                )}
                {previewContent && getPlayableUrl(previewContent) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(getPlayableUrl(previewContent)!, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Open Original
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 bg-black">
            {previewContent && getPlayableUrl(previewContent) && (
              <iframe
                src={getPlayableUrl(previewContent)!}
                className="w-full h-full"
                allowFullScreen
                allow="autoplay; encrypted-media; picture-in-picture"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
