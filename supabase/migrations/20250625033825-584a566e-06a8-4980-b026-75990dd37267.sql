
-- Primeiro, remover as funções existentes
DROP FUNCTION IF EXISTS public.get_calendar_configurations(UUID, DATE, DATE);
DROP FUNCTION IF EXISTS public.save_calendar_configuration(UUID, DATE, BOOLEAN, TIME, TIME, INTEGER, TEXT[], TIME, TIME);

-- Remover as colunas de lunch break da tabela calendar_configurations
ALTER TABLE public.calendar_configurations 
DROP COLUMN IF EXISTS lunch_break_start,
DROP COLUMN IF EXISTS lunch_break_end;

-- Recriar a função save_calendar_configuration sem lunch break
CREATE OR REPLACE FUNCTION public.save_calendar_configuration(
  p_clinic_id UUID,
  p_date DATE,
  p_is_open BOOLEAN,
  p_start_time TIME,
  p_end_time TIME,
  p_interval_minutes INTEGER,
  p_blocked_times TEXT[]
) RETURNS public.calendar_configurations
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_record public.calendar_configurations;
BEGIN
  -- Inserir ou atualizar configuração e capturar o resultado
  INSERT INTO public.calendar_configurations (
    clinic_id,
    date,
    is_open,
    start_time,
    end_time,
    interval_minutes,
    blocked_times
  )
  VALUES (
    p_clinic_id,
    p_date,
    p_is_open,
    p_start_time,
    p_end_time,
    p_interval_minutes,
    p_blocked_times
  )
  ON CONFLICT (clinic_id, date)
  DO UPDATE SET
    is_open = EXCLUDED.is_open,
    start_time = EXCLUDED.start_time,
    end_time = EXCLUDED.end_time,
    interval_minutes = EXCLUDED.interval_minutes,
    blocked_times = EXCLUDED.blocked_times,
    updated_at = NOW()
  RETURNING * INTO result_record;
  
  -- Retornar o registro
  RETURN result_record;
END;
$$;

-- Recriar a função get_calendar_configurations sem lunch break
CREATE OR REPLACE FUNCTION public.get_calendar_configurations(
  p_clinic_id UUID,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
) RETURNS TABLE (
  id UUID,
  clinic_id UUID,
  date DATE,
  is_open BOOLEAN,
  start_time TIME,
  end_time TIME,
  interval_minutes INTEGER,
  blocked_times TEXT[],
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cc.id,
    cc.clinic_id,
    cc.date,
    cc.is_open,
    cc.start_time,
    cc.end_time,
    cc.interval_minutes,
    cc.blocked_times,
    cc.created_at,
    cc.updated_at
  FROM public.calendar_configurations cc
  WHERE cc.clinic_id = p_clinic_id
    AND (p_start_date IS NULL OR cc.date >= p_start_date)
    AND (p_end_date IS NULL OR cc.date <= p_end_date)
  ORDER BY cc.date ASC;
END;
$$;

-- Atualizar a função check_time_slot_availability para remover verificação de lunch break
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
    p_time::TEXT = ANY(blocked_times)
  INTO is_clinic_open, is_blocked
  FROM public.calendar_configurations 
  WHERE clinic_id = p_clinic_id AND date = p_date;
  
  -- Verificar se não está bloqueado
  IF NOT is_clinic_open OR is_blocked THEN
    RETURN FALSE;
  END IF;
  
  -- Verificar conflitos com agendamentos existentes
  SELECT public.check_appointment_conflict(p_date::TEXT, p_time::TEXT, p_duration) INTO has_conflict;
  
  RETURN NOT has_conflict;
END;
$$;
