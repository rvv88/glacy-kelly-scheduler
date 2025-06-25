
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ProfileChecker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { userRole, isAdmin } = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkProfile = async () => {
      if (!user || !userRole || isAdmin()) return;
      
      // Verificar se é uma rota que requer perfil completo
      const requiresProfile = ['/calendar', '/appointment'].some(path => 
        location.pathname.startsWith(path)
      );
      
      if (!requiresProfile) return;

      try {
        // Verificar se o usuário tem perfil de paciente completo
        const { data: profile, error } = await supabase
          .from('patient_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking patient profile:', error);
          return;
        }

        // Se não tem perfil ou está incompleto, redirecionar
        if (!profile || !profile.name || !profile.cpf || !profile.phone) {
          toast.error('Complete seu cadastro em "Meus Dados" antes de agendar consultas.');
          navigate('/patients/new');
        }
      } catch (error) {
        console.error('Error checking profile:', error);
      }
    };

    checkProfile();
  }, [user, userRole, location.pathname, isAdmin, navigate]);

  return <>{children}</>;
};

export default ProfileChecker;
