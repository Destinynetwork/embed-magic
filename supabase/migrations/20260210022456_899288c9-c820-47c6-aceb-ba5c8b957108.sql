
-- Additional tables and columns needed

-- 1. Analytics table
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL,
  total_views INTEGER DEFAULT 0,
  unique_views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Analytics viewable by content owners" ON public.analytics FOR SELECT USING (true);

-- 2. Community events table (used by analytics)
CREATE TABLE IF NOT EXISTS public.community_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL,
  title TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.community_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creators can manage own community events" ON public.community_events FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = community_events.creator_id AND user_id = auth.uid())
);

-- 3. Businesses table
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  name TEXT,
  products_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners can manage own business" ON public.businesses FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = businesses.owner_id AND user_id = auth.uid())
);

-- 4. Audience subscriptions table
CREATE TABLE IF NOT EXISTS public.audience_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  tier_id UUID NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.audience_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscriptions" ON public.audience_subscriptions FOR SELECT USING (auth.uid() = user_id);

-- 5. Creator subscription tiers table
CREATE TABLE IF NOT EXISTS public.creator_subscription_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.creator_subscription_tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creators can manage tiers" ON public.creator_subscription_tiers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = creator_subscription_tiers.creator_id AND user_id = auth.uid())
);
CREATE POLICY "Tiers are viewable" ON public.creator_subscription_tiers FOR SELECT USING (true);

-- 6. Event tickets table (separate from creator_event_tickets for public use)
CREATE TABLE IF NOT EXISTS public.event_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL,
  buyer_name TEXT,
  buyer_email TEXT,
  ticket_type TEXT,
  price NUMERIC DEFAULT 0,
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.event_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Event tickets viewable by owners" ON public.event_tickets FOR SELECT USING (true);

-- 7. Playlist items table
CREATE TABLE IF NOT EXISTS public.playlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  content_asset_id UUID NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.playlist_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Playlist items managed by playlist owners" ON public.playlist_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.playlists p
    JOIN public.profiles pr ON pr.id = p.owner_id
    WHERE p.id = playlist_items.playlist_id AND pr.user_id = auth.uid()
  )
);

-- 8. Add missing columns to creator_cdn_usage
ALTER TABLE public.creator_cdn_usage ADD COLUMN IF NOT EXISTS storage_used_bytes BIGINT DEFAULT 0;
ALTER TABLE public.creator_cdn_usage ADD COLUMN IF NOT EXISTS storage_limit_bytes BIGINT DEFAULT 10737418240;

-- 9. Add missing columns to creator_payments
ALTER TABLE public.creator_payments ADD COLUMN IF NOT EXISTS notes TEXT;

-- 10. Add missing columns to creator_event_tickets
ALTER TABLE public.creator_event_tickets ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMPTZ;
ALTER TABLE public.creator_event_tickets ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT false;
ALTER TABLE public.creator_event_tickets ADD COLUMN IF NOT EXISTS payfast_reference TEXT;

-- 11. Add missing columns to admin_refund_requests
ALTER TABLE public.admin_refund_requests ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE public.admin_refund_requests ADD COLUMN IF NOT EXISTS requested_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.admin_refund_requests ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ;

-- 12. Add missing column to content_assets
ALTER TABLE public.content_assets ADD COLUMN IF NOT EXISTS duration_seconds INTEGER;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_playlist_items_playlist ON public.playlist_items(playlist_id);
CREATE INDEX IF NOT EXISTS idx_analytics_asset ON public.analytics(asset_id);
