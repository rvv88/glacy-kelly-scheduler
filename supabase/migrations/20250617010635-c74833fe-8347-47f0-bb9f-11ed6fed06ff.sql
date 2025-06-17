
-- Adicionar políticas RLS para a tabela appointments baseadas no perfil do usuário
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Política para usuários admin: podem ver todos os agendamentos
CREATE POLICY "Admins can view all appointments" 
  ON public.appointments 
  FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Política para usuários comuns: só podem ver seus próprios agendamentos
CREATE POLICY "Users can view their own appointments" 
  ON public.appointments 
  FOR SELECT 
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'user') AND 
    patient_id IN (
      SELECT id FROM public.patient_profiles WHERE user_id = auth.uid()
    )
  );

-- Política para inserção de agendamentos por usuários comuns (sempre como pending)
CREATE POLICY "Users can create appointments for themselves" 
  ON public.appointments 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'user') AND 
    patient_id IN (
      SELECT id FROM public.patient_profiles WHERE user_id = auth.uid()
    ) AND
    status = 'pending'
  );

-- Política para admins criarem agendamentos para qualquer paciente
CREATE POLICY "Admins can create appointments for any patient" 
  ON public.appointments 
  FOR INSERT 
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Política para usuários atualizarem apenas seus próprios agendamentos (cancelar)
CREATE POLICY "Users can cancel their own appointments" 
  ON public.appointments 
  FOR UPDATE 
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'user') AND 
    patient_id IN (
      SELECT id FROM public.patient_profiles WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'user') AND 
    patient_id IN (
      SELECT id FROM public.patient_profiles WHERE user_id = auth.uid()
    ) AND
    status = 'cancelled'
  );

-- Política para admins atualizarem qualquer agendamento
CREATE POLICY "Admins can update any appointment" 
  ON public.appointments 
  FOR UPDATE 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Política para deletar agendamentos (apenas admins)
CREATE POLICY "Admins can delete any appointment" 
  ON public.appointments 
  FOR DELETE 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Adicionar RLS para patient_profiles se ainda não existir
ALTER TABLE public.patient_profiles ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas seu próprio perfil
CREATE POLICY "Users can view their own profile" 
  ON public.patient_profiles 
  FOR SELECT 
  TO authenticated
  USING (user_id = auth.uid());

-- Política para admins verem todos os perfis
CREATE POLICY "Admins can view all profiles" 
  ON public.patient_profiles 
  FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Política para usuários criarem/atualizarem seu próprio perfil
CREATE POLICY "Users can manage their own profile" 
  ON public.patient_profiles 
  FOR ALL 
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Política para admins gerenciarem qualquer perfil
CREATE POLICY "Admins can manage any profile" 
  ON public.patient_profiles 
  FOR ALL 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Função para verificar conflitos de horário
CREATE OR REPLACE FUNCTION public.check_appointment_conflict(
  appointment_date DATE,
  appointment_time TIME,
  appointment_duration INTEGER,
  exclude_appointment_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  conflict_exists BOOLEAN := FALSE;
  end_time TIME;
BEGIN
  -- Calcular horário de fim do agendamento
  end_time := appointment_time + (appointment_duration || ' minutes')::INTERVAL;
  
  -- Verificar se existe conflito
  SELECT EXISTS (
    SELECT 1 FROM public.appointments 
    WHERE date = appointment_date 
    AND status IN ('confirmed', 'pending')
    AND (exclude_appointment_id IS NULL OR id != exclude_appointment_id)
    AND (
      -- Novo agendamento começa durante um existente
      (appointment_time >= time AND appointment_time < time + (duration || ' minutes')::INTERVAL)
      OR
      -- Novo agendamento termina durante um existente
      (end_time > time AND end_time <= time + (duration || ' minutes')::INTERVAL)
      OR
      -- Novo agendamento engloba um existente
      (appointment_time <= time AND end_time >= time + (duration || ' minutes')::INTERVAL)
    )
  ) INTO conflict_exists;
  
  RETURN conflict_exists;
END;
$$;
