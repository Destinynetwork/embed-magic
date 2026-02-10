
-- ============================================
-- FREE EMBED RECORDS TABLE
-- ============================================
CREATE TABLE public.free_embed_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  title TEXT NOT NULL,
  provider TEXT NOT NULL,
  embed_url TEXT,
  embed_code_raw TEXT,
  embed_html_sanitized TEXT,
  status TEXT NOT NULL DEFAULT 'active'
);

ALTER TABLE public.free_embed_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own free embeds"
  ON public.free_embed_records FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.id = free_embed_records.user_id
  ));

CREATE POLICY "Users can insert own free embeds"
  ON public.free_embed_records FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.id = free_embed_records.user_id
  ));

CREATE POLICY "Users can delete own free embeds"
  ON public.free_embed_records FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.id = free_embed_records.user_id
  ));

-- ============================================
-- PRO MANAGED ASSETS TABLE
-- ============================================
CREATE TABLE public.pro_managed_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  title TEXT NOT NULL,
  cdn_provider TEXT NOT NULL DEFAULT 'GUMLET',
  external_asset_id TEXT,
  playback_url TEXT,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  status TEXT NOT NULL DEFAULT 'UPLOADING',
  metadata_json JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pro_managed_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pro assets"
  ON public.pro_managed_assets FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.id = pro_managed_assets.user_id
  ));

CREATE POLICY "Pro users can insert own assets"
  ON public.pro_managed_assets FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.id = pro_managed_assets.user_id
    AND (profiles.plan = 'Studio Pro' OR profiles.plan = 'pro' OR profiles.subscription_tier LIKE '%pro%' OR profiles.subscription_tier LIKE '%studio%')
  ));

CREATE POLICY "Pro users can update own assets"
  ON public.pro_managed_assets FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.id = pro_managed_assets.user_id
  ));

CREATE POLICY "Pro users can delete own assets"
  ON public.pro_managed_assets FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.id = pro_managed_assets.user_id
  ));

-- Add trigger for updated_at
CREATE TRIGGER update_pro_managed_assets_updated_at
  BEFORE UPDATE ON public.pro_managed_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
