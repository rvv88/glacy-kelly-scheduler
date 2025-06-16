
-- Create RLS policies for the services table
CREATE POLICY "Enable read access for all users" ON public.services
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.services
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.services
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.services
  FOR DELETE USING (true);
