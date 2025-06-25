
-- Criar tabela para notificações
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id),
  type TEXT NOT NULL CHECK (type IN ('confirmed', 'cancelled')),
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para notificações
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas suas próprias notificações
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  TO authenticated
  USING (user_id = auth.uid());

-- Política para usuários atualizarem suas próprias notificações (marcar como lida)
CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Política para admins criarem notificações
CREATE POLICY "Admins can create notifications"
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Modificar a política de appointments para usuários sempre verem seus agendamentos (incluindo cancelados)
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;

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
