
-- Criar políticas para acesso público aos serviços ativos na home
CREATE POLICY "Allow public read access to active services"
ON public.services
FOR SELECT
TO anon, authenticated
USING (active = true);

-- Criar políticas para acesso público às clínicas na home
CREATE POLICY "Allow public read access to clinics"
ON public.clinics
FOR SELECT
TO anon, authenticated
USING (true);
