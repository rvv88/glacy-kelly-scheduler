
-- Primeiro, vamos verificar se a tabela calendar_configurations está correta
-- e adicionar qualquer constraint necessário

-- Adicionar constraint única para evitar duplicatas
ALTER TABLE public.calendar_configurations 
ADD CONSTRAINT calendar_configurations_clinic_date_unique 
UNIQUE (clinic_id, date);

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_calendar_configurations_clinic_date 
ON public.calendar_configurations (clinic_id, date);

-- Verificar se a função de upsert está funcionando corretamente
-- Vamos criar uma função específica para salvar configurações
CREATE OR REPLACE FUNCTION public.save_calendar_configuration(
  p_clinic_id UUID,
  p_date DATE,
  p_is_open BOOLEAN,
  p_start_time TIME,
  p_end_time TIME,
  p_interval_minutes INTEGER,
  p_blocked_times TEXT[],
  p_lunch_break_start TIME DEFAULT NULL,
  p_lunch_break_end TIME DEFAULT NULL
) RETURNS public.calendar_configurations
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_record public.calendar_configurations;
BEGIN
  -- Inserir ou atualizar configuração
  INSERT INTO public.calendar_configurations (
    clinic_id,
    date,
    is_open,
    start_time,
    end_time,
    interval_minutes,
    blocked_times,
    lunch_break_start,
    lunch_break_end
  )
  VALUES (
    p_clinic_id,
    p_date,
    p_is_open,
    p_start_time,
    p_end_time,
    p_interval_minutes,
    p_blocked_times,
    p_lunch_break_start,
    p_lunch_break_end
  )
  ON CONFLICT (clinic_id, date)
  DO UPDATE SET
    is_open = EXCLUDED.is_open,
    start_time = EXCLUDED.start_time,
    end_time = EXCLUDED.end_time,
    interval_minutes = EXCLUDED.interval_minutes,
    blocked_times = EXCLUDED.blocked_times,
    lunch_break_start = EXCLUDED.lunch_break_start,
    lunch_break_end = EXCLUDED.lunch_break_end,
    updated_at = NOW()
  RETURNING *;
  
  -- Buscar o registro inserido/atualizado
  SELECT * INTO result_record
  FROM public.calendar_configurations
  WHERE clinic_id = p_clinic_id AND date = p_date;
  
  RETURN result_record;
END;
$$;

-- Criar função para buscar configurações por clínica e período
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
  lunch_break_start TIME,
  lunch_break_end TIME,
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
    cc.lunch_break_start,
    cc.lunch_break_end,
    cc.created_at,
    cc.updated_at
  FROM public.calendar_configurations cc
  WHERE cc.clinic_id = p_clinic_id
    AND (p_start_date IS NULL OR cc.date >= p_start_date)
    AND (p_end_date IS NULL OR cc.date <= p_end_date)
  ORDER BY cc.date ASC;
END;
$$;
