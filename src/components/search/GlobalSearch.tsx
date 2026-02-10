import { useState, useEffect } from "react";
import { Search, User, Store, Video, Radio, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  name: string;
  subtitle?: string;
  image?: string | null;
  type: "user" | "store" | "content" | "channel";
  tier?: string;
  category?: string;
}

interface GlobalSearchProps {
  className?: string;
  size?: "sm" | "default";
}

export function GlobalSearch({ className, size = "default" }: GlobalSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [results, setResults] = useState<{
    users: SearchResult[];
    stores: SearchResult[];
    content: SearchResult[];
    channels: SearchResult[];
  }>({
    users: [],
    stores: [],
    content: [],
    channels: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults({ users: [], stores: [], content: [], channels: [] });
      return;
    }

    const debounce = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    const searchTerm = `%${searchQuery}%`;

    try {
      // Search users/profiles
      const { data: users } = await supabase
        .from("profiles")
        .select("id, display_name, full_name, username, avatar_url, subscription_tier")
        .or(`display_name.ilike.${searchTerm},full_name.ilike.${searchTerm},username.ilike.${searchTerm}`)
        .limit(10);

      // Search businesses/stores
      const { data: stores } = await supabase
        .from("businesses")
        .select("id, store_name, address, store_logo_url")
        .ilike("store_name", searchTerm)
        .limit(10);

      // Search content by title, category, genre
      const { data: content } = await supabase
        .from("content_assets")
        .select("id, title, main_category, sub_category, thumbnail_url, content_type")
        .or(`title.ilike.${searchTerm},main_category.ilike.${searchTerm},sub_category.ilike.${searchTerm}`)
        .eq("is_approved", true)
        .limit(10);

      // Search channels
      const { data: channels } = await supabase
        .from("channels")
        .select("id, name, branding")
        .ilike("name", searchTerm)
        .eq("is_private", false)
        .limit(10);

      setResults({
        users: (users || []).map((u) => ({
          id: u.id,
          name: u.display_name || u.full_name || u.username,
          subtitle: `@${u.username}`,
          image: u.avatar_url,
          type: "user" as const,
          tier: u.subscription_tier || "free",
        })),
        stores: (stores || []).map((s) => ({
          id: s.id,
          name: s.store_name,
          subtitle: s.address,
          image: s.store_logo_url,
          type: "store" as const,
        })),
        content: (content || []).map((c) => ({
          id: c.id,
          name: c.title,
          subtitle: c.content_type,
          image: c.thumbnail_url,
          type: "content" as const,
          category: c.main_category || c.sub_category,
        })),
        channels: (channels || []).map((ch) => ({
          id: ch.id,
          name: ch.name,
          subtitle: "Channel",
          image: null,
          type: "channel" as const,
        })),
      });
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setOpen(false);
    setQuery("");

    switch (result.type) {
      case "user":
        navigate(`/profile/${result.id}`);
        break;
      case "store":
        navigate(`/business-hub?store=${result.id}`);
        break;
      case "content":
        navigate(`/content/${result.id}`);
        break;
      case "channel":
        navigate(`/vod?channel=${result.id}`);
        break;
    }
  };

  const totalResults =
    results.users.length +
    results.stores.length +
    results.content.length +
    results.channels.length;

  const getFilteredResults = () => {
    switch (activeTab) {
      case "users":
        return results.users;
      case "stores":
        return results.stores;
      case "content":
        return results.content;
      case "channels":
        return results.channels;
      default:
        return [
          ...results.users,
          ...results.stores,
          ...results.content,
          ...results.channels,
        ];
    }
  };

  const ResultItem = ({ result }: { result: SearchResult }) => {
    const icons = {
      user: User,
      store: Store,
      content: Video,
      channel: Radio,
    };
    const Icon = icons[result.type];

    return (
      <button
        onClick={() => handleResultClick(result)}
        className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-secondary"
      >
        <Avatar className="h-10 w-10">
          {result.image ? (
            <AvatarImage src={result.image} alt={result.name} />
          ) : null}
          <AvatarFallback className="bg-muted">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{result.name}</p>
          {result.subtitle && (
            <p className="text-sm text-muted-foreground truncate">
              {result.subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {result.tier && (
            <Badge variant="outline" className="text-xs capitalize">
              {result.tier.replace("_", " ")}
            </Badge>
          )}
          {result.category && (
            <Badge variant="secondary" className="text-xs">
              {result.category}
            </Badge>
          )}
          <Badge
            variant="outline"
            className={cn(
              "text-xs capitalize",
              result.type === "user" && "border-blue-500/50 text-blue-500",
              result.type === "store" && "border-green-500/50 text-green-500",
              result.type === "content" && "border-purple-500/50 text-purple-500",
              result.type === "channel" && "border-orange-500/50 text-orange-500"
            )}
          >
            {result.type}
          </Badge>
        </div>
      </button>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-1 border-border/60 bg-card/30 text-muted-foreground hover:bg-secondary hover:text-foreground px-2 h-7",
            className
          )}
        >
          <Search className="h-3 w-3" />
          <span className="text-xs">Search</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle className="sr-only">Global Search</DialogTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users, stores, content, channels..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-10"
              autoFocus
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                onClick={() => setQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        {query && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b px-4">
              <TabsList className="h-10 w-full justify-start gap-2 bg-transparent p-0">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-3"
                >
                  All ({totalResults})
                </TabsTrigger>
                <TabsTrigger
                  value="users"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-3"
                >
                  <User className="mr-1.5 h-3.5 w-3.5" />
                  Users ({results.users.length})
                </TabsTrigger>
                <TabsTrigger
                  value="stores"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-3"
                >
                  <Store className="mr-1.5 h-3.5 w-3.5" />
                  Stores ({results.stores.length})
                </TabsTrigger>
                <TabsTrigger
                  value="content"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-3"
                >
                  <Video className="mr-1.5 h-3.5 w-3.5" />
                  Content ({results.content.length})
                </TabsTrigger>
                <TabsTrigger
                  value="channels"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-3"
                >
                  <Radio className="mr-1.5 h-3.5 w-3.5" />
                  Channels ({results.channels.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="p-2">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : getFilteredResults().length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    No results found for "{query}"
                  </div>
                ) : (
                  <div className="space-y-1">
                    {getFilteredResults().map((result) => (
                      <ResultItem key={`${result.type}-${result.id}`} result={result} />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </Tabs>
        )}

        {!query && (
          <div className="px-4 pb-4">
            <p className="text-center text-sm text-muted-foreground py-8">
              Start typing to search across users, stores, content, and channels
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}