
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

const AuthRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, needsPatientProfile, loading } = useAuth();
  const { userRole, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !roleLoading) {
      if (user && needsPatientProfile) {
        // Se o usuário está logado mas não tem perfil de paciente completo
        // e não está já na página de cadastro de paciente
        if (location.pathname !== '/patients/new') {
          navigate('/patients/new', { replace: true });
        }
      } else if (user && userRole) {
        // Verificar se o usuário está tentando acessar uma página restrita
        const restrictedPaths = ['/dashboard', '/services', '/clinics', '/history', '/settings'];
        const isRestrictedPath = restrictedPaths.some(path => 
          location.pathname.startsWith(path)
        );

        if (isRestrictedPath && userRole === 'user') {
          // Usuário comum tentando acessar área de admin
          navigate('/', { replace: true });
        }
      }
    }
  }, [user, needsPatientProfile, userRole, loading, roleLoading, navigate, location.pathname]);

  return <>{children}</>;
};

export default AuthRedirect;
