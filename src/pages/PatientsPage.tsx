
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Edit, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { usePatientProfile } from '@/hooks/usePatientProfile';
import { Badge } from '@/components/ui/badge';

const PatientsPage: React.FC = () => {
  const { user } = useAuth();
  const { patientProfile, hasProfile, loading } = usePatientProfile();

  if (!user) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Meus Dados</h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Você precisa estar logado para ver seus dados.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Meus Dados</h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Carregando...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Meus Dados</h2>
        <Button asChild>
          <Link to="/patients/new">
            <Edit className="mr-2 h-4 w-4" />
            {hasProfile ? 'Editar Dados' : 'Completar Cadastro'}
          </Link>
        </Button>
      </div>

      {hasProfile && patientProfile ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>{patientProfile.name}</CardTitle>
                <CardDescription>{patientProfile.email}</CardDescription>
              </div>
              <Badge className="ml-auto">Ativo</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">INFORMAÇÕES PESSOAIS</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">CPF:</span>
                    <span className="text-sm ml-2">{patientProfile.cpf}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Telefone:</span>
                    <span className="text-sm ml-2">{patientProfile.phone}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Data de Nascimento:</span>
                    <span className="text-sm ml-2">
                      {new Date(patientProfile.birthdate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">ENDEREÇO E CLÍNICA</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Endereço:</span>
                    <span className="text-sm ml-2">{patientProfile.address}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Clínica:</span>
                    <span className="text-sm ml-2">{patientProfile.clinicId}</span>
                  </div>
                </div>
              </div>
            </div>

            {patientProfile.notes && (
              <div className="mt-6">
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">OBSERVAÇÕES</h3>
                <p className="text-sm">{patientProfile.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Complete seu Cadastro</CardTitle>
            <CardDescription>
              Você ainda não completou suas informações pessoais.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/patients/new">
                <User className="mr-2 h-4 w-4" />
                Completar Cadastro
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PatientsPage;
