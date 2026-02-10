import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Loader2, Crown, Sparkles, ShoppingBag, Heart, Video, Headphones, Antenna, Music2, Code2, Zap, ListVideo, Tv, Users, Briefcase, Calendar, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface CategoryData {
  main_category: string;
  sub_categories: string[];
  count: number;
}

// Channel filter types for viewer discovery
export type ChannelFilter = 
  | "vod_pro" | "elite_pro" | "music_pro" | "podcast_pro" | "radio_pro" | "embed_pro" | "supa_pro"
  | "free_embed" | "live_stream" | "podcast_studio" | "dj_studio" | "radio_studio" | "events_calendar" | "community_events_calendar" | "news_hub"
  | "my_store"
  | "open_mic" | "gbv_support" | "youth_jobs";

interface ChannelItem {
  label: string;
  icon: React.ElementType;
  filterKey: ChannelFilter;
}

interface CollapsibleSectionProps {
  title: string;
  titleBadge?: string;
  items: { label: string; count?: number; icon?: React.ElementType; filterKey?: ChannelFilter }[];
  defaultOpen?: boolean;
  onItemClick?: (item: string) => void;
  onChannelClick?: (filterKey: ChannelFilter) => void;
  activeItem?: string;
  activeChannel?: ChannelFilter | null;
  loading?: boolean;
  titleIcon?: React.ElementType;
  titleGradient?: string;
}

function CollapsibleSection({ 
  title, 
  titleBadge,
  items, 
  defaultOpen = false,
  onItemClick,
  onChannelClick,
  activeItem,
  activeChannel,
  loading = false,
  titleIcon: TitleIcon,
  titleGradient
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold uppercase tracking-wider text-foreground hover:bg-secondary/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {TitleIcon && (
            <div className={cn("w-5 h-5 rounded flex items-center justify-center", titleGradient)}>
              <TitleIcon className="h-3 w-3 text-white" />
            </div>
          )}
          <span>{title}</span>
          {titleBadge && (
            <span className="text-[9px] font-normal normal-case text-amber-400 ml-1">
              ({titleBadge})
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      
      {isOpen && (
        <div className="animate-fade-in">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
            <p className="px-4 py-2 text-xs text-muted-foreground">No content yet</p>
          ) : (
            items.map((item) => {
              const isActive = item.filterKey 
                ? activeChannel === item.filterKey 
                : activeItem === item.label;
              
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.filterKey && onChannelClick) {
                      onChannelClick(item.filterKey);
                    } else if (onItemClick) {
                      onItemClick(item.label);
                    }
                  }}
                  className={cn(
                    "w-full px-4 py-2.5 text-left text-sm transition-all flex items-center justify-between",
                    isActive
                      ? "bg-primary text-primary-foreground font-medium rounded-r-full mr-4"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {item.icon && <item.icon className="h-3.5 w-3.5" />}
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={cn(
                      "text-xs px-1.5 py-0.5 rounded-full",
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

interface SubCategorySectionProps {
  mainCategory: string;
  subCategories: string[];
  activeSubCategory?: string;
  onSubCategoryClick?: (subCategory: string) => void;
}

function SubCategorySection({ 
  mainCategory, 
  subCategories, 
  activeSubCategory,
  onSubCategoryClick 
}: SubCategorySectionProps) {
  if (subCategories.length === 0) return null;

  return (
    <div className="ml-4 mb-2 border-l border-border/50">
      {subCategories.map((sub) => (
        <button
          key={sub}
          onClick={() => onSubCategoryClick?.(sub)}
          className={cn(
            "w-full px-4 py-2 text-left text-xs transition-all",
            activeSubCategory === sub
              ? "bg-cyan-500/20 text-cyan-400 font-medium border-l-2 border-cyan-500"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/20"
          )}
        >
          └ {sub}
        </button>
      ))}
    </div>
  );
}

interface VODSidebarProps {
  activeCategory?: string;
  activeSubCategory?: string;
  activeChannel?: ChannelFilter | null;
  onCategoryChange?: (category: string) => void;
  onSubCategoryChange?: (subCategory: string) => void;
  onChannelChange?: (channel: ChannelFilter) => void;
}

// Channel data for sidebar navigation - now with filter keys instead of routes
const PRO_CHANNELS: ChannelItem[] = [
  { label: "VOD Pro", icon: Video, filterKey: "vod_pro" },
  { label: "Elite Pro", icon: Crown, filterKey: "elite_pro" },
  { label: "Music Pro", icon: Music2, filterKey: "music_pro" },
  { label: "Podcast Pro", icon: Headphones, filterKey: "podcast_pro" },
  { label: "Radio Pro", icon: Antenna, filterKey: "radio_pro" },
  { label: "Embed Pro", icon: Code2, filterKey: "embed_pro" },
  { label: "SUPA Pro", icon: Zap, filterKey: "supa_pro" },
  { label: "Live Stream", icon: Tv, filterKey: "live_stream" },
  { label: "Pro Events", icon: Calendar, filterKey: "events_calendar" },
];

const FREE_CHANNELS: ChannelItem[] = [
  { label: "Free Embed", icon: ListVideo, filterKey: "free_embed" },
  { label: "Live Stream", icon: Tv, filterKey: "live_stream" },
  { label: "Podcast Studio", icon: Headphones, filterKey: "podcast_studio" },
  { label: "Music Studio", icon: Music2, filterKey: "dj_studio" },
  { label: "Radio Station", icon: Antenna, filterKey: "radio_studio" },
  { label: "Events Calendar", icon: Calendar, filterKey: "community_events_calendar" },
  { label: "News Hub", icon: Newspaper, filterKey: "news_hub" },
];

const SHOPPING_CHANNELS: ChannelItem[] = [
  { label: "Shopping Channel", icon: ShoppingBag, filterKey: "my_store" },
];

const COMMUNITY_CHANNELS: ChannelItem[] = [
  { label: "Open Mic", icon: Users, filterKey: "open_mic" },
  { label: "GBV Support", icon: Heart, filterKey: "gbv_support" },
];

const JOBS_CHANNELS: ChannelItem[] = [
  { label: "Youth Jobs", icon: Briefcase, filterKey: "youth_jobs" },
];

export function VODSidebar({ 
  activeCategory = "Recently Added", 
  activeSubCategory,
  activeChannel,
  onCategoryChange,
  onSubCategoryChange,
  onChannelChange
}: VODSidebarProps) {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("content_assets")
        .select("main_category, sub_category")
        .eq("is_approved", true)
        .not("main_category", "is", null);

      if (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
        return;
      }

      const categoryMap = new Map<string, { subCategories: Set<string>; count: number }>();

      (data || []).forEach((item) => {
        if (item.main_category) {
          const existing = categoryMap.get(item.main_category) || { 
            subCategories: new Set<string>(), 
            count: 0 
          };
          existing.count++;
          if (item.sub_category) {
            existing.subCategories.add(item.sub_category);
          }
          categoryMap.set(item.main_category, existing);
        }
      });

      const categoriesArray: CategoryData[] = Array.from(categoryMap.entries())
        .map(([main, data]) => ({
          main_category: main,
          sub_categories: Array.from(data.subCategories).sort(),
          count: data.count
        }))
        .sort((a, b) => b.count - a.count);

      setCategories(categoriesArray);
    } catch (err) {
      console.error("Error:", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const staticCategories = [
    { label: "Recently Added", count: 0 },
    { label: "All Content", count: 0 },
  ];

  const staticCategoryItems = [
    "Music",
    "Food & Cooking",
    "Health & Fitness",
    "Technology",
    "Entertainment",
    "Documentaries",
    "Movies",
    "Podcast",
    "Education",
  ];

  const dynamicCategoryItems = staticCategoryItems.map(staticCat => {
    const dynamicCat = categories.find(c => c.main_category === staticCat);
    return {
      label: staticCat,
      count: dynamicCat?.count || 0
    };
  });

  const activeMainCategory = categories.find(c => c.main_category === activeCategory);
  const subCategories = activeMainCategory?.sub_categories || [];

  return (
    <aside className="hidden lg:block w-64 min-h-screen bg-sidebar border-r border-sidebar-border overflow-y-auto">
      <nav className="py-4">
        {/* Quick Filters */}
        <CollapsibleSection
          title="Browse"
          items={staticCategories}
          defaultOpen={true}
          activeItem={activeCategory}
          onItemClick={onCategoryChange}
        />

        {/* CHANNELS Section - Viewer discovery */}
        <div className="border-t border-border/30 mt-2 pt-2">
          <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Channels
          </p>
          
          <CollapsibleSection
            title="PRO Broadcast"
            titleBadge="7 day trial"
            items={PRO_CHANNELS}
            defaultOpen={true}
            activeChannel={activeChannel}
            onChannelClick={onChannelChange}
            titleIcon={Crown}
            titleGradient="bg-gradient-to-br from-amber-500 to-orange-600"
          />

          <CollapsibleSection
            title="FREE Channels"
            items={FREE_CHANNELS}
            defaultOpen={false}
            activeChannel={activeChannel}
            onChannelClick={onChannelChange}
            titleIcon={Sparkles}
            titleGradient="bg-gradient-to-br from-emerald-500 to-cyan-600"
          />

          <CollapsibleSection
            title="Shopping Hub"
            items={SHOPPING_CHANNELS}
            defaultOpen={false}
            activeChannel={activeChannel}
            onChannelClick={onChannelChange}
            titleIcon={ShoppingBag}
            titleGradient="bg-gradient-to-br from-violet-500 to-purple-600"
          />

          <CollapsibleSection
            title="Community"
            items={COMMUNITY_CHANNELS}
            defaultOpen={false}
            activeChannel={activeChannel}
            onChannelClick={onChannelChange}
            titleIcon={Heart}
            titleGradient="bg-gradient-to-br from-pink-500 to-rose-600"
          />

          <CollapsibleSection
            title="Youth Jobs"
            items={JOBS_CHANNELS}
            defaultOpen={false}
            activeChannel={activeChannel}
            onChannelClick={onChannelChange}
            titleIcon={Briefcase}
            titleGradient="bg-gradient-to-br from-blue-500 to-indigo-600"
          />
        </div>

        {/* Separator */}
        <div className="border-t border-border/30 mt-2 pt-2">
          <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Content Discovery
          </p>
        </div>

        {/* Dynamic Categories from Database */}
        <CollapsibleSection
          title="Categories"
          items={dynamicCategoryItems}
          defaultOpen={true}
          activeItem={activeCategory}
          onItemClick={onCategoryChange}
          loading={loading}
        />

        {/* Sub-categories for active main category */}
        {subCategories.length > 0 && (
          <div className="px-2 mb-4">
            <p className="px-2 py-2 text-xs font-semibold uppercase text-muted-foreground">
              {activeCategory} Sub-categories
            </p>
            <SubCategorySection
              mainCategory={activeCategory}
              subCategories={subCategories}
              activeSubCategory={activeSubCategory}
              onSubCategoryClick={onSubCategoryChange}
            />
          </div>
        )}

        {/* Genres Section */}
        <CollapsibleSection
          title="Genres"
          items={[
            { label: "Drama" },
            { label: "Comedy" },
            { label: "Documentary" },
            { label: "Action" },
            { label: "Thriller" },
            { label: "Sci-Fi" },
            { label: "Romance" },
            { label: "Horror" },
          ]}
          defaultOpen={false}
          activeItem={activeCategory}
          onItemClick={onCategoryChange}
        />
      </nav>
    </aside>
  );
}
