
-- Criar tabela para configurações de agenda por clínica
CREATE TABLE public.calendar_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_open BOOLEAN NOT NULL DEFAULT true,
  start_time TIME NOT NULL DEFAULT '08:00',
  end_time TIME NOT NULL DEFAULT '18:00',
  interval_minutes INTEGER NOT NULL DEFAULT 30,
  lunch_break_start TIME,
  lunch_break_end TIME,
  blocked_times TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(clinic_id, date)
);

-- Adicionar RLS para calendar_configurations
ALTER TABLE public.calendar_configurations ENABLE ROW LEVEL SECURITY;

-- Política para admins verem todas as configurações
CREATE POLICY "Admins can manage all calendar configurations" 
  ON public.calendar_configurations 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Política para usuários verem apenas configurações de suas clínicas
CREATE POLICY "Users can view calendar configurations of their clinic" 
  ON public.calendar_configurations 
  FOR SELECT 
  USING (
    clinic_id IN (
      SELECT clinic_id::uuid 
      FROM public.patient_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Adicionar trigger para updated_at
CREATE TRIGGER update_calendar_configurations_updated_at
  BEFORE UPDATE ON public.calendar_configurations
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();

-- Adicionar coluna clinic_id nos appointments como referência foreign key
ALTER TABLE public.appointments 
ADD CONSTRAINT appointments_clinic_id_fkey 
FOREIGN KEY (clinic_id) REFERENCES public.clinics(id);

-- Função para verificar disponibilidade de horário baseado na configuração
CREATE OR REPLACE FUNCTION public.check_time_slot_availability(
  p_clinic_id UUID,
  p_date DATE,
  p_time TIME,
  p_duration INTEGER DEFAULT 30
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  config_exists BOOLEAN := FALSE;
  is_clinic_open BOOLEAN := FALSE;
  slot_end_time TIME;
  is_blocked BOOLEAN := FALSE;
  is_in_lunch BOOLEAN := FALSE;
  has_conflict BOOLEAN := FALSE;
BEGIN
  -- Calcular horário de fim
  slot_end_time := p_time + (p_duration || ' minutes')::INTERVAL;
  
  -- Verificar se existe configuração para a clínica nesta data
  SELECT 
    EXISTS(SELECT 1 FROM public.calendar_configurations WHERE clinic_id = p_clinic_id AND date = p_date),
    COALESCE(is_open, FALSE)
  INTO config_exists, is_clinic_open
  FROM public.calendar_configurations 
  WHERE clinic_id = p_clinic_id AND date = p_date;
  
  -- Se não há configuração ou clínica fechada, não disponível
  IF NOT config_exists OR NOT is_clinic_open THEN
    RETURN FALSE;
  END IF;
  
  -- Verificar se está dentro do horário de funcionamento
  SELECT 
    p_time >= start_time AND slot_end_time <= end_time,
    p_time = ANY(blocked_times),
    CASE 
      WHEN lunch_break_start IS NOT NULL AND lunch_break_end IS NOT NULL THEN
        p_time >= lunch_break_start AND p_time < lunch_break_end
      ELSE FALSE
    END
  INTO is_clinic_open, is_blocked, is_in_lunch
  FROM public.calendar_configurations 
  WHERE clinic_id = p_clinic_id AND date = p_date;
  
  -- Verificar se não está bloqueado ou no horário de almoço
  IF NOT is_clinic_open OR is_blocked OR is_in_lunch THEN
    RETURN FALSE;
  END IF;
  
  -- Verificar conflitos com agendamentos existentes
  SELECT public.check_appointment_conflict(p_date, p_time, p_duration) INTO has_conflict;
  
  RETURN NOT has_conflict;
END;
$$;

-- Função para obter horários disponíveis de uma clínica em uma data
CREATE OR REPLACE FUNCTION public.get_available_time_slots(
  p_clinic_id UUID,
  p_date DATE
) RETURNS TABLE(time_slot TIME)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  config_rec RECORD;
  slot_time TIME;
  end_time_limit TIME;
  slot_interval INTERVAL;
BEGIN
  -- Buscar configuração da clínica para a data
  SELECT * INTO config_rec
  FROM public.calendar_configurations 
  WHERE clinic_id = p_clinic_id AND date = p_date;
  
  -- Se não há configuração ou clínica fechada, retornar vazio
  IF NOT FOUND OR NOT config_rec.is_open THEN
    RETURN;
  END IF;
  
  -- Configurar variáveis
  slot_time := config_rec.start_time;
  end_time_limit := config_rec.end_time;
  slot_interval := (config_rec.interval_minutes || ' minutes')::INTERVAL;
  
  -- Gerar slots disponíveis
  WHILE slot_time < end_time_limit LOOP
    -- Verificar se o horário está disponível
    IF public.check_time_slot_availability(p_clinic_id, p_date, slot_time, config_rec.interval_minutes) THEN
      time_slot := slot_time;
      RETURN NEXT;
    END IF;
    
    slot_time := slot_time + slot_interval;
  END LOOP;
  
  RETURN;
END;
$$;
