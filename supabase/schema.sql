-- ============================================================
-- QUINCHO TABOLANGO - SaaS Database Schema (Supabase / PostgreSQL)
-- ============================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Quincho Configuration / Settings Table
CREATE TABLE IF NOT EXISTS public.quincho_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL DEFAULT 'Quincho Tabolango',
  address TEXT NOT NULL DEFAULT 'Km 9, Tabolango, Limache, Región de Valparaíso',
  phone TEXT NOT NULL DEFAULT '56912345678',
  email TEXT NOT NULL DEFAULT 'contacto@quinchotabolango.cl',
  base_rate_min_2_nights INTEGER NOT NULL DEFAULT 90000,
  base_rate_single_weekend_night INTEGER NOT NULL DEFAULT 110000,
  base_guests_included INTEGER NOT NULL DEFAULT 8,
  max_guests INTEGER NOT NULL DEFAULT 10,
  extra_guest_price INTEGER NOT NULL DEFAULT 8000,
  hot_tub_price INTEGER NOT NULL DEFAULT 50000,
  extra_hour_price INTEGER NOT NULL DEFAULT 5000,
  guarantee_price INTEGER NOT NULL DEFAULT 30000,
  deposit_percentage INTEGER NOT NULL DEFAULT 50,
  check_in_time TEXT NOT NULL DEFAULT '14:00',
  check_out_time TEXT NOT NULL DEFAULT '12:00',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY, -- e.g. 'TAB-2026-4821'
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_rut TEXT,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  nights_count INTEGER NOT NULL CHECK (nights_count > 0),
  guests_count INTEGER NOT NULL CHECK (guests_count > 0),
  extra_guests INTEGER NOT NULL DEFAULT 0,
  event_type TEXT NOT NULL DEFAULT 'Descanso familiar',
  include_hot_tub BOOLEAN NOT NULL DEFAULT false,
  extra_hours INTEGER NOT NULL DEFAULT 0,
  rate_per_night INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  deposit_required INTEGER NOT NULL,
  deposit_paid BOOLEAN NOT NULL DEFAULT false,
  deposit_paid_at TIMESTAMP WITH TIME ZONE,
  balance_paid BOOLEAN NOT NULL DEFAULT false,
  balance_paid_at TIMESTAMP WITH TIME ZONE,
  guarantee_amount INTEGER NOT NULL DEFAULT 30000,
  guarantee_status TEXT NOT NULL DEFAULT 'pending' CHECK (guarantee_status IN ('pending', 'received', 'refunded')),
  status TEXT NOT NULL DEFAULT 'pending_deposit' CHECK (status IN ('pending_deposit', 'confirmed', 'checked_in', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Check-Ins Table (Linked with Bookings & Gate Access Control)
CREATE TABLE IF NOT EXISTS public.checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id TEXT UNIQUE NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  vehicle_plate TEXT NOT NULL, -- Crucial for plate recognition gate camera
  estimated_arrival TEXT NOT NULL,
  guest_list JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of { name, rutOrDoc, age }
  rules_accepted BOOLEAN NOT NULL DEFAULT true,
  rules_accepted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  checked_in_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Blocked Dates (Maintenance, Private use, Holidays)
CREATE TABLE IF NOT EXISTS public.blocked_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE UNIQUE NOT NULL,
  reason TEXT NOT NULL DEFAULT 'Bloqueado',
  booking_id TEXT REFERENCES public.bookings(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Indexes for High Performance Queries
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings(check_in_date, check_out_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_checkins_plate ON public.checkins(vehicle_plate);
CREATE INDEX IF NOT EXISTS idx_blocked_dates_date ON public.blocked_dates(date);

-- 7. Row Level Security (RLS)
ALTER TABLE public.quincho_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;

-- Public can read blocked dates to know availability
CREATE POLICY "Public can view blocked dates" ON public.blocked_dates
  FOR SELECT USING (true);

-- Public can insert new bookings
CREATE POLICY "Public can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (true);

-- Client can view their own booking by ID
CREATE POLICY "Clients can view booking by id" ON public.bookings
  FOR SELECT USING (true);

-- Client can submit their checkin
CREATE POLICY "Clients can submit checkin" ON public.checkins
  FOR ALL USING (true);
