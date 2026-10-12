-- ==============================================================
-- PIONEER BOOKS - COMPLETE SUPABASE SETUP SCRIPT
-- Run this entire script in your new Supabase Project -> SQL Editor
-- ==============================================================

-- 1. Create Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create Products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('physical', 'pdf')),
  image_url TEXT,
  pdf_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  items JSONB NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 5. Products Policies (Allows store visitors to view, and admin panel to manage)
DROP POLICY IF EXISTS "Allow all operations for products" ON public.products;
DROP POLICY IF EXISTS "Products are viewable by everyone." ON public.products;
DROP POLICY IF EXISTS "Admins can manage products." ON public.products;

CREATE POLICY "Allow all operations for products"
ON public.products
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 6. Orders Policies
DROP POLICY IF EXISTS "Allow all operations for orders" ON public.orders;
CREATE POLICY "Allow all operations for orders"
ON public.orders
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 7. Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);

-- 8. Storage Buckets (Creates 'product-images' and 'product-pdfs' if not exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-pdfs', 'product-pdfs', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 9. Storage Object Policies (Allow public uploads & reads)
DROP POLICY IF EXISTS "Allow public uploads product-images" ON storage.objects;
CREATE POLICY "Allow public uploads product-images"
ON storage.objects FOR ALL
TO anon, authenticated
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow public uploads product-pdfs" ON storage.objects;
CREATE POLICY "Allow public uploads product-pdfs"
ON storage.objects FOR ALL
TO anon, authenticated
USING (bucket_id = 'product-pdfs')
WITH CHECK (bucket_id = 'product-pdfs');

-- 10. Refresh schema cache
NOTIFY pgrst, 'reload schema';
