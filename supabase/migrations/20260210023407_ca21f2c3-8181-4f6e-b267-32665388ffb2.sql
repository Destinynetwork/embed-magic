
-- Business Products table
CREATE TABLE IF NOT EXISTS public.business_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL,
  name TEXT NOT NULL,
  sku TEXT,
  base_price NUMERIC DEFAULT 0,
  customer_price NUMERIC DEFAULT 0,
  stock INTEGER DEFAULT 0,
  product_type TEXT DEFAULT 'physical',
  status TEXT DEFAULT 'active',
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.business_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage products" ON public.business_products FOR ALL
  USING (EXISTS (SELECT 1 FROM businesses b JOIN profiles p ON p.id = b.owner_id WHERE b.id = business_products.business_id AND p.user_id = auth.uid()));
CREATE POLICY "Products viewable" ON public.business_products FOR SELECT USING (status = 'active');

-- Business Orders table
CREATE TABLE IF NOT EXISTS public.business_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL,
  customer_name TEXT,
  customer_email TEXT,
  total_amount NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.business_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage orders" ON public.business_orders FOR ALL
  USING (EXISTS (SELECT 1 FROM businesses b JOIN profiles p ON p.id = b.owner_id WHERE b.id = business_orders.business_id AND p.user_id = auth.uid()));

-- Business Discount Codes table
CREATE TABLE IF NOT EXISTS public.business_discount_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL,
  code TEXT NOT NULL,
  discount_type TEXT DEFAULT 'percentage',
  discount_value NUMERIC DEFAULT 0,
  max_uses INTEGER,
  uses_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.business_discount_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage discounts" ON public.business_discount_codes FOR ALL
  USING (EXISTS (SELECT 1 FROM businesses b JOIN profiles p ON p.id = b.owner_id WHERE b.id = business_discount_codes.business_id AND p.user_id = auth.uid()));

-- Shipping Companies table
CREATE TABLE IF NOT EXISTS public.business_shipping_companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL,
  name TEXT NOT NULL,
  tracking_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.business_shipping_companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage shipping" ON public.business_shipping_companies FOR ALL
  USING (EXISTS (SELECT 1 FROM businesses b JOIN profiles p ON p.id = b.owner_id WHERE b.id = business_shipping_companies.business_id AND p.user_id = auth.uid()));

-- Waybills table
CREATE TABLE IF NOT EXISTS public.business_waybills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL,
  order_id UUID,
  shipping_company_id UUID,
  tracking_number TEXT,
  status TEXT DEFAULT 'awaiting_shipment',
  customer_name TEXT,
  customer_email TEXT,
  customer_address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.business_waybills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage waybills" ON public.business_waybills FOR ALL
  USING (EXISTS (SELECT 1 FROM businesses b JOIN profiles p ON p.id = b.owner_id WHERE b.id = business_waybills.business_id AND p.user_id = auth.uid()));

-- Business Support Tickets table
CREATE TABLE IF NOT EXISTS public.business_support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL,
  customer_name TEXT,
  customer_email TEXT,
  subject TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'open',
  priority TEXT DEFAULT 'normal',
  admin_response TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.business_support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage support tickets" ON public.business_support_tickets FOR ALL
  USING (EXISTS (SELECT 1 FROM businesses b JOIN profiles p ON p.id = b.owner_id WHERE b.id = business_support_tickets.business_id AND p.user_id = auth.uid()));

-- Business Store Settings (extended)
CREATE TABLE IF NOT EXISTS public.business_store_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL UNIQUE,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  physical_address TEXT,
  latitude TEXT,
  longitude TEXT,
  vendor_id TEXT,
  policies_accepted BOOLEAN DEFAULT false,
  policies_accepted_at TIMESTAMPTZ,
  terms_text TEXT,
  refund_policy TEXT,
  returns_policy TEXT,
  privacy_policy TEXT,
  shipping_policy TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.business_store_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage store settings" ON public.business_store_settings FOR ALL
  USING (EXISTS (SELECT 1 FROM businesses b JOIN profiles p ON p.id = b.owner_id WHERE b.id = business_store_settings.business_id AND p.user_id = auth.uid()));

-- Add triggers for updated_at
CREATE TRIGGER update_business_products_updated_at BEFORE UPDATE ON public.business_products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_business_orders_updated_at BEFORE UPDATE ON public.business_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_business_waybills_updated_at BEFORE UPDATE ON public.business_waybills FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_business_support_tickets_updated_at BEFORE UPDATE ON public.business_support_tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_business_store_settings_updated_at BEFORE UPDATE ON public.business_store_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
