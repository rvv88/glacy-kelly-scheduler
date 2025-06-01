
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AuthRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, needsPatientProfile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user && needsPatientProfile) {
      // Se o usuário está logado mas não tem perfil de paciente completo
      // e não está já na página de cadastro de paciente
      if (location.pathname !== '/patients/new') {
        navigate('/patients/new', { replace: true });
      }
    }
  }, [user, needsPatientProfile, loading, navigate, location.pathname]);

  return <>{children}</>;
};

export default AuthRedirect;
