
import React from 'react';
import { useUserRole, UserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRoles, 
  redirectTo = '/' 
}) => {
  const { user } = useAuth();
  const { userRole, loading } = useUserRole();

  // Se não estiver logado, redirecionar para home
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Se ainda estiver carregando o role, mostrar loading
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Verificar se o usuário tem permissão
  const hasPermission = allowedRoles.includes(userRole);

  if (!hasPermission) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;
