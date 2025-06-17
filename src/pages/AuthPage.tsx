
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AuthModal from '@/components/auth/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const { user } = useAuth();

  // Se já estiver logado, redirecionar para home
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Acesso ao Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <AuthModal isOpen={true} onClose={() => {}} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
