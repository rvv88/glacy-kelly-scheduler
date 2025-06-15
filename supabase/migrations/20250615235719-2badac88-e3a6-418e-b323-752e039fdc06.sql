
-- Drop existing table if it exists
DROP TABLE IF EXISTS public.clínica;

-- Create new clinics table with proper structure
CREATE TABLE public.clinics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_name TEXT NOT NULL,
  street TEXT NOT NULL,
  number TEXT NOT NULL,
  complement TEXT,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;

-- Create policies for full access (adjust based on your auth requirements)
CREATE POLICY "Enable read access for all users" ON public.clinics
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.clinics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.clinics
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.clinics
  FOR DELETE USING (true);
