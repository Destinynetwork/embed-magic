
-- Add missing columns to playlists for PlaylistManager
ALTER TABLE public.playlists ADD COLUMN IF NOT EXISTS subscription_price NUMERIC DEFAULT 0;
ALTER TABLE public.playlists ADD COLUMN IF NOT EXISTS sell_separately BOOLEAN DEFAULT true;

-- Add is_private to channels for GlobalSearch
ALTER TABLE public.channels ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT false;
