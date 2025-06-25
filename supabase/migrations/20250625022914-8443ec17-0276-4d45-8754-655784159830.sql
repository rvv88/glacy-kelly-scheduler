
-- Corrigir a função check_time_slot_availability para lidar corretamente com tipos TIME
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
    p_time::TEXT = ANY(blocked_times),
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
  SELECT public.check_appointment_conflict(p_date::TEXT, p_time::TEXT, p_duration) INTO has_conflict;
  
  RETURN NOT has_conflict;
END;
$$;

-- Corrigir a função get_available_time_slots
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

-- Corrigir a função check_appointment_conflict para aceitar parâmetros corretos
CREATE OR REPLACE FUNCTION public.check_appointment_conflict(
  appointment_date TEXT,
  appointment_time TEXT,
  appointment_duration INTEGER,
  exclude_appointment_id UUID DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  conflict_exists BOOLEAN := FALSE;
  end_time TIME;
  appt_time TIME;
  appt_date DATE;
BEGIN
  -- Converter strings para tipos apropriados
  appt_date := appointment_date::DATE;
  appt_time := appointment_time::TIME;
  end_time := appt_time + (appointment_duration || ' minutes')::INTERVAL;
  
  -- Verificar se existe conflito
  SELECT EXISTS (
    SELECT 1 FROM public.appointments 
    WHERE date = appt_date 
    AND status IN ('confirmed', 'pending')
    AND (exclude_appointment_id IS NULL OR id != exclude_appointment_id)
    AND (
      -- Novo agendamento começa durante um existente
      (appt_time >= time AND appt_time < time + (duration || ' minutes')::INTERVAL)
      OR
      -- Novo agendamento termina durante um existente
      (end_time > time AND end_time <= time + (duration || ' minutes')::INTERVAL)
      OR
      -- Novo agendamento engloba um existente
      (appt_time <= time AND end_time >= time + (duration || ' minutes')::INTERVAL)
    )
  ) INTO conflict_exists;
  
  RETURN conflict_exists;
END;
$$;
