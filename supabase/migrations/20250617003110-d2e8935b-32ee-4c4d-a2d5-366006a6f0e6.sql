
-- Criar enum para os tipos de perfil de usuário
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Criar tabela para armazenar os roles dos usuários
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Habilitar Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Criar função para verificar se um usuário tem um role específico
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Criar função para obter o role do usuário
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Políticas RLS para user_roles
CREATE POLICY "Users can view their own roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roles" 
  ON public.user_roles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Função para criar role automaticamente quando um usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_role app_role := 'user';
BEGIN
  -- Se o email for rafa.vviera@gmail.com, definir como admin
  IF NEW.email = 'rafa.vviera@gmail.com' THEN
    user_role := 'admin';
  END IF;
  
  -- Inserir o role na tabela user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);
  
  RETURN NEW;
END;
$$;

-- Criar trigger para executar a função quando um novo usuário é criado
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Inserir role admin para o email rafa.vviera@gmail.com se já existir
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Buscar o ID do usuário com email rafa.vviera@gmail.com
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'rafa.vviera@gmail.com';
  
  -- Se o usuário existir, inserir o role admin
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
