-- ====================================================================
-- TIYANA'S SUKOON - SUPABASE DATABASE SCHEMA
-- Handmade Art, Craft & Islamic Calligraphy E-Commerce Platform
-- ====================================================================

-- 1. ARTWORKS TABLE
CREATE TABLE IF NOT EXISTS public.artworks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    title_bangla TEXT,
    category TEXT NOT NULL DEFAULT 'calligraphy',
    price NUMERIC NOT NULL DEFAULT 0,
    original_price NUMERIC,
    description TEXT,
    spiritual_message TEXT,
    dimensions TEXT NOT NULL DEFAULT '12x12 inch',
    medium TEXT NOT NULL DEFAULT 'Heavy Textured Acrylic on Canvas',
    finish TEXT DEFAULT 'Varnished Semi-Gloss',
    image TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    in_stock BOOLEAN DEFAULT true,
    badge TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for category and featured filtering
CREATE INDEX IF NOT EXISTS idx_artworks_category ON public.artworks(category);
CREATE INDEX IF NOT EXISTS idx_artworks_featured ON public.artworks(is_featured);

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    delivery_zone TEXT NOT NULL DEFAULT 'inside_dhaka',
    items JSONB NOT NULL DEFAULT '[]'::JSONB,
    subtotal NUMERIC NOT NULL DEFAULT 0,
    delivery_fee NUMERIC NOT NULL DEFAULT 70,
    total_amount NUMERIC NOT NULL DEFAULT 0,
    payment_method TEXT NOT NULL DEFAULT 'cod',
    payment_trx_id TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for searching orders
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);

-- 3. CUSTOM COMMISSIONS & INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.inquiries (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    art_type TEXT NOT NULL,
    custom_verse_or_text TEXT,
    canvas_size TEXT,
    frame_type TEXT,
    estimated_price NUMERIC DEFAULT 0,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SITE SETTINGS & BRAND MEDIA TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'current',
    settings JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES (Allow public storefront read and admin operations with anon key)
-- Artworks policies
DROP POLICY IF EXISTS "Public can view artworks" ON public.artworks;
CREATE POLICY "Public can view artworks" ON public.artworks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon manage artworks" ON public.artworks;
CREATE POLICY "Allow anon manage artworks" ON public.artworks FOR ALL USING (true);

-- Orders policies
DROP POLICY IF EXISTS "Public can create orders" ON public.orders;
CREATE POLICY "Public can create orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon manage orders" ON public.orders;
CREATE POLICY "Allow anon manage orders" ON public.orders FOR ALL USING (true);

-- Inquiries policies
DROP POLICY IF EXISTS "Public can submit inquiries" ON public.inquiries;
CREATE POLICY "Public can submit inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon manage inquiries" ON public.inquiries;
CREATE POLICY "Allow anon manage inquiries" ON public.inquiries FOR ALL USING (true);

-- Site settings policies
DROP POLICY IF EXISTS "Public can read site settings" ON public.site_settings;
CREATE POLICY "Public can read site settings" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon manage site settings" ON public.site_settings;
CREATE POLICY "Allow anon manage site settings" ON public.site_settings FOR ALL USING (true);

-- 7. CLOUD STORAGE BUCKET FOR PERMANENT ARTWORK & MEDIA UPLOADS
INSERT INTO storage.buckets (id, name, public)
VALUES ('artwork-uploads', 'artwork-uploads', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS policies
DROP POLICY IF EXISTS "Public can view uploaded artworks" ON storage.objects;
CREATE POLICY "Public can view uploaded artworks" ON storage.objects
    FOR SELECT USING (bucket_id = 'artwork-uploads');

DROP POLICY IF EXISTS "Allow anon upload artworks" ON storage.objects;
CREATE POLICY "Allow anon upload artworks" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'artwork-uploads');

DROP POLICY IF EXISTS "Allow anon update artworks" ON storage.objects;
CREATE POLICY "Allow anon update artworks" ON storage.objects
    FOR UPDATE USING (bucket_id = 'artwork-uploads');
