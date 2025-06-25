
-- Remover as políticas existentes que estão causando conflito
DROP POLICY IF EXISTS "Admins can create notifications for any user" ON public.notifications;
DROP POLICY IF EXISTS "Service can create notifications" ON public.notifications;

-- Criar uma política mais abrangente que permite aos admins criar notificações
CREATE POLICY "Allow authenticated users to create notifications"
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política para visualizar notificações (usuários só veem as próprias, admins veem todas)
CREATE POLICY "Users can view own notifications, admins can view all"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    public.has_role(auth.uid(), 'admin')
  );

-- Política para atualizar notificações (marcar como lida)
CREATE POLICY "Users can update own notifications"
  ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
