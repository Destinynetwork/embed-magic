
-- =============================================
-- Comprehensive migration for EmbedPro platform
-- =============================================

-- 1. Add 'guest' to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'guest';

-- 2. Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  email TEXT,
  username TEXT,
  full_name TEXT,
  is_creator BOOLEAN DEFAULT false,
  plan TEXT DEFAULT 'free',
  subscription_tier TEXT DEFAULT 'free',
  player_settings JSONB DEFAULT '{}',
  protection_settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- 3. Guest preferences table
CREATE TABLE IF NOT EXISTS public.guest_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  interests TEXT[] DEFAULT '{}',
  email_promotions BOOLEAN DEFAULT false,
  email_alerts BOOLEAN DEFAULT false,
  agreed_to_marketing BOOLEAN DEFAULT false,
  agreed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.guest_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own preferences" ON public.guest_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own preferences" ON public.guest_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON public.guest_preferences FOR UPDATE USING (auth.uid() = user_id);

-- 4. Embed Pro channels table
CREATE TABLE IF NOT EXISTS public.embed_pro_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  category TEXT,
  is_free BOOLEAN DEFAULT true,
  subscription_price NUMERIC DEFAULT 0,
  package_price NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'ZAR',
  subscriber_count INTEGER DEFAULT 0,
  content_count INTEGER DEFAULT 0,
  is_private BOOLEAN DEFAULT false,
  sell_individually BOOLEAN DEFAULT true,
  parent_id UUID REFERENCES public.embed_pro_channels(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.embed_pro_channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage own channels" ON public.embed_pro_channels FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = embed_pro_channels.owner_id AND user_id = auth.uid())
);
CREATE POLICY "Public channels are viewable" ON public.embed_pro_channels FOR SELECT USING (is_private = false);

-- 5. Embed Pro content table
CREATE TABLE IF NOT EXISTS public.embed_pro_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  content_type TEXT NOT NULL DEFAULT 'video',
  embed_urls TEXT[],
  embed_provider TEXT,
  is_ppv BOOLEAN DEFAULT false,
  price NUMERIC DEFAULT 0,
  is_approved BOOLEAN DEFAULT true,
  is_archived BOOLEAN DEFAULT false,
  channel_id UUID REFERENCES public.embed_pro_channels(id) ON DELETE SET NULL,
  qa_status TEXT DEFAULT 'pending',
  rejection_reason TEXT,
  qa_notes TEXT,
  creator_notes TEXT,
  moderation_flags JSONB,
  age_restriction TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.embed_pro_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage own content" ON public.embed_pro_content FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = embed_pro_content.owner_id AND user_id = auth.uid())
);
CREATE POLICY "Approved content is viewable" ON public.embed_pro_content FOR SELECT USING (is_approved = true AND is_archived = false);

-- 6. Content assets table (VOD Pro)
CREATE TABLE IF NOT EXISTS public.content_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id TEXT UNIQUE,
  owner_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  content_type TEXT NOT NULL DEFAULT 'video',
  embed_urls TEXT[],
  embed_provider TEXT,
  is_ppv BOOLEAN DEFAULT false,
  price NUMERIC DEFAULT 0,
  is_approved BOOLEAN DEFAULT true,
  channel_id UUID,
  main_category TEXT,
  sub_category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.content_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage own assets" ON public.content_assets FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = content_assets.owner_id AND user_id = auth.uid())
);
CREATE POLICY "Approved assets are viewable" ON public.content_assets FOR SELECT USING (is_approved = true);

-- 7. Content metadata table
CREATE TABLE IF NOT EXISTS public.content_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL,
  director TEXT,
  cast_members TEXT[],
  producer TEXT,
  studio TEXT,
  country TEXT,
  year_of_release INTEGER,
  writer TEXT,
  language TEXT,
  content_rating TEXT,
  genres TEXT[],
  music_composer TEXT,
  cinematographer TEXT,
  editor TEXT,
  subtitles TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.content_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Metadata viewable by all" ON public.content_metadata FOR SELECT USING (true);
CREATE POLICY "Owners can manage metadata" ON public.content_metadata FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.embed_pro_content epc
    JOIN public.profiles p ON p.id = epc.owner_id
    WHERE epc.id = content_metadata.asset_id AND p.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.content_assets ca
    JOIN public.profiles p ON p.id = ca.owner_id
    WHERE ca.id = content_metadata.asset_id AND p.user_id = auth.uid()
  )
);

-- 8. Free embed content table
CREATE TABLE IF NOT EXISTS public.free_embed_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  title TEXT NOT NULL,
  thumbnail_url TEXT,
  content_type TEXT NOT NULL DEFAULT 'video',
  main_category TEXT,
  channel_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.free_embed_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage free content" ON public.free_embed_content FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = free_embed_content.owner_id AND user_id = auth.uid())
);
CREATE POLICY "Free content is viewable" ON public.free_embed_content FOR SELECT USING (true);

-- 9. Creator CDN usage table
CREATE TABLE IF NOT EXISTS public.creator_cdn_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE,
  ai_generations_used INTEGER DEFAULT 0,
  ai_generations_limit INTEGER DEFAULT 25,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.creator_cdn_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view own usage" ON public.creator_cdn_usage FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = creator_cdn_usage.profile_id AND user_id = auth.uid())
);
CREATE POLICY "Owners can update own usage" ON public.creator_cdn_usage FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = creator_cdn_usage.profile_id AND user_id = auth.uid())
);

-- 10. Channels table (general)
CREATE TABLE IF NOT EXISTS public.channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage channels" ON public.channels FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = channels.owner_id AND user_id = auth.uid())
);
CREATE POLICY "Channels are viewable" ON public.channels FOR SELECT USING (true);

-- 11. Playlists table
CREATE TABLE IF NOT EXISTS public.playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  name TEXT NOT NULL,
  channel_id UUID,
  items JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage playlists" ON public.playlists FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = playlists.owner_id AND user_id = auth.uid())
);
CREATE POLICY "Playlists are viewable" ON public.playlists FOR SELECT USING (true);

-- 12. Creator events table
CREATE TABLE IF NOT EXISTS public.creator_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  location TEXT,
  adult_price NUMERIC DEFAULT 0,
  child_price NUMERIC DEFAULT 0,
  senior_price NUMERIC DEFAULT 0,
  max_attendees INTEGER,
  attendee_count INTEGER DEFAULT 0,
  event_type TEXT,
  is_virtual BOOLEAN DEFAULT true,
  is_vvip BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft',
  thumbnail_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  contact_whatsapp TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.creator_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can manage own events" ON public.creator_events FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = creator_events.creator_id AND user_id = auth.uid())
);
CREATE POLICY "Published events are viewable" ON public.creator_events FOR SELECT USING (status = 'published' OR status = 'active');

-- 13. Creator event tickets table
CREATE TABLE IF NOT EXISTS public.creator_event_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.creator_events(id) ON DELETE CASCADE,
  buyer_name TEXT,
  buyer_email TEXT,
  ticket_type TEXT,
  ticket_tier TEXT,
  price NUMERIC DEFAULT 0,
  payment_status TEXT DEFAULT 'pending',
  checked_in BOOLEAN DEFAULT false,
  tracking_number TEXT,
  purchased_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.creator_event_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event owners can manage tickets" ON public.creator_event_tickets FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.creator_events ce
    JOIN public.profiles p ON p.id = ce.creator_id
    WHERE ce.id = creator_event_tickets.event_id AND p.user_id = auth.uid()
  )
);

-- 14. Creator payments table
CREATE TABLE IF NOT EXISTS public.creator_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL,
  amount NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'ZAR',
  payment_type TEXT,
  status TEXT DEFAULT 'completed',
  reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.creator_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can view own payments" ON public.creator_payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = creator_payments.creator_id AND user_id = auth.uid())
);

-- 15. Admin refund requests table
CREATE TABLE IF NOT EXISTS public.admin_refund_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL,
  creator_id UUID NOT NULL,
  reason TEXT,
  amount NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_refund_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can manage own refund requests" ON public.admin_refund_requests FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = admin_refund_requests.creator_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can manage all refund requests" ON public.admin_refund_requests FOR ALL USING (
  public.has_role(auth.uid(), 'admin')
);

-- 16. Embed Pro support tickets table
CREATE TABLE IF NOT EXISTS public.embed_pro_support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  embed_profile_id UUID NOT NULL,
  ticket_number TEXT NOT NULL DEFAULT 'TKT-' || substr(gen_random_uuid()::text, 1, 8),
  subject TEXT NOT NULL,
  description TEXT,
  message TEXT,
  category TEXT DEFAULT 'general',
  status TEXT DEFAULT 'open',
  priority TEXT DEFAULT 'normal',
  admin_response TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.embed_pro_support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own tickets" ON public.embed_pro_support_tickets FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = embed_pro_support_tickets.embed_profile_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can manage all tickets" ON public.embed_pro_support_tickets FOR ALL USING (
  public.has_role(auth.uid(), 'admin')
);

-- 17. Updated_at trigger function (reusable)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_embed_pro_channels_updated_at BEFORE UPDATE ON public.embed_pro_channels FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_embed_pro_content_updated_at BEFORE UPDATE ON public.embed_pro_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_content_assets_updated_at BEFORE UPDATE ON public.content_assets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_content_metadata_updated_at BEFORE UPDATE ON public.content_metadata FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_creator_cdn_usage_updated_at BEFORE UPDATE ON public.creator_cdn_usage FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_playlists_updated_at BEFORE UPDATE ON public.playlists FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_creator_events_updated_at BEFORE UPDATE ON public.creator_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_embed_pro_content_owner ON public.embed_pro_content(owner_id);
CREATE INDEX IF NOT EXISTS idx_embed_pro_content_channel ON public.embed_pro_content(channel_id);
CREATE INDEX IF NOT EXISTS idx_embed_pro_channels_owner ON public.embed_pro_channels(owner_id);
CREATE INDEX IF NOT EXISTS idx_content_assets_owner ON public.content_assets(owner_id);
CREATE INDEX IF NOT EXISTS idx_content_metadata_asset ON public.content_metadata(asset_id);
CREATE INDEX IF NOT EXISTS idx_creator_events_creator ON public.creator_events(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_event_tickets_event ON public.creator_event_tickets(event_id);
