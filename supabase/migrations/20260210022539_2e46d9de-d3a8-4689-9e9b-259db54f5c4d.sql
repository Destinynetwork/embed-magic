
-- Add missing columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add missing columns to businesses
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS store_name TEXT;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS store_logo_url TEXT;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS address TEXT;

-- Add missing columns to channels
ALTER TABLE public.channels ADD COLUMN IF NOT EXISTS parent_id UUID;
ALTER TABLE public.channels ADD COLUMN IF NOT EXISTS package_price NUMERIC DEFAULT 0;
ALTER TABLE public.channels ADD COLUMN IF NOT EXISTS subscription_price NUMERIC DEFAULT 0;
ALTER TABLE public.channels ADD COLUMN IF NOT EXISTS sell_individually BOOLEAN DEFAULT true;
ALTER TABLE public.channels ADD COLUMN IF NOT EXISTS branding JSONB DEFAULT '{}';

-- Add missing columns to playlists
ALTER TABLE public.playlists ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.playlists ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE public.playlists ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;
ALTER TABLE public.playlists ADD COLUMN IF NOT EXISTS item_count INTEGER DEFAULT 0;
ALTER TABLE public.playlists ADD COLUMN IF NOT EXISTS total_duration_seconds INTEGER DEFAULT 0;
ALTER TABLE public.playlists ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'mixed';
