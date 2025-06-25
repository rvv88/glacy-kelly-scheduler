
-- Remover todas as políticas existentes de todas as tabelas
DROP POLICY IF EXISTS "Enable read access for all users" ON public.services;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.services;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.services;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.services;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.clinics;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.clinics;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.clinics;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.clinics;

-- Remover políticas de profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Remover políticas de patient_profiles
DROP POLICY IF EXISTS "Users can view own patient profile" ON public.patient_profiles;
DROP POLICY IF EXISTS "Users can update own patient profile" ON public.patient_profiles;
DROP POLICY IF EXISTS "Users can insert own patient profile" ON public.patient_profiles;
DROP POLICY IF EXISTS "Admins can view all patient profiles" ON public.patient_profiles;
DROP POLICY IF EXISTS "Admins can update all patient profiles" ON public.patient_profiles;
DROP POLICY IF EXISTS "Admins can insert patient profiles" ON public.patient_profiles;

-- Remover políticas de appointments
DROP POLICY IF EXISTS "Users can view own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can insert own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can update own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can view all appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can insert all appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can update all appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can delete all appointments" ON public.appointments;

-- Remover políticas de user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Criar políticas para profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Criar políticas para patient_profiles
CREATE POLICY "Users can view own patient profile" ON public.patient_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own patient profile" ON public.patient_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own patient profile" ON public.patient_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all patient profiles" ON public.patient_profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all patient profiles" ON public.patient_profiles
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert patient profiles" ON public.patient_profiles
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Criar políticas para appointments
CREATE POLICY "Users can view own appointments" ON public.appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.patient_profiles 
      WHERE patient_profiles.id = appointments.patient_id 
      AND patient_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own appointments" ON public.appointments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.patient_profiles 
      WHERE patient_profiles.id = appointments.patient_id 
      AND patient_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own appointments" ON public.appointments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.patient_profiles 
      WHERE patient_profiles.id = appointments.patient_id 
      AND patient_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all appointments" ON public.appointments
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert all appointments" ON public.appointments
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all appointments" ON public.appointments
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete all appointments" ON public.appointments
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Criar políticas para clinics
CREATE POLICY "Users can view clinics" ON public.clinics
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage clinics" ON public.clinics
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Criar políticas para services
CREATE POLICY "Users can view services" ON public.services
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage services" ON public.services
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Criar políticas para calendar_configurations
CREATE POLICY "Users can view calendar configurations" ON public.calendar_configurations
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage calendar configurations" ON public.calendar_configurations
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Criar políticas para user_roles
CREATE POLICY "Users can view own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage user roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));
