
-- Corrigir a política RLS para permitir que admins criem notificações para qualquer usuário
DROP POLICY IF EXISTS "Admins can create notifications" ON public.notifications;

CREATE POLICY "Admins can create notifications for any user"
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Adicionar política para permitir que o sistema crie notificações em contexto de serviço
CREATE POLICY "Service can create notifications"
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
