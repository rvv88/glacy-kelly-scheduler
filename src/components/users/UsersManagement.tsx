
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Shield, User, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserData {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
  created_at: string;
}

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log('Loading all users...');

      // Get all profiles - sem filtros para carregar todos os usuários
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error loading profiles:', profilesError);
        toast.error('Erro ao carregar perfis de usuários');
        return;
      }

      // Get user roles - sem filtros para carregar todos os roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) {
        console.error('Error loading user roles:', rolesError);
        toast.error('Erro ao carregar roles dos usuários');
        return;
      }

      // Combine data
      const usersData: UserData[] = profiles.map(profile => {
        const userRole = roles.find(role => role.user_id === profile.id);
        return {
          id: profile.id,
          email: profile.email || 'Email não informado',
          full_name: profile.full_name || 'Nome não informado',
          role: userRole?.role || 'user',
          created_at: profile.created_at
        };
      });

      console.log('All users loaded:', usersData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      console.log('Updating user role:', userId, newRole);

      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: newRole
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error updating user role:', error);
        throw error;
      }

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast.success(`Perfil do usuário alterado para ${newRole === 'admin' ? 'Administrador' : 'Usuário'}`);
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Erro ao alterar perfil do usuário');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando todos os usuários...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gerenciamento de Usuários</h2>
          <p className="text-muted-foreground">
            Gerencie todos os usuários do sistema e seus perfis de acesso ({users.length} usuários cadastrados)
          </p>
        </div>
        <Button onClick={loadUsers} variant="outline">
          Atualizar Lista
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                {user.role === 'admin' ? (
                  <Shield className="h-5 w-5 text-blue-600" />
                ) : (
                  <User className="h-5 w-5 text-gray-600" />
                )}
                <div>
                  <CardTitle className="text-lg">{user.full_name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Cadastrado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Alterar perfil:</label>
                  <Select
                    value={user.role}
                    onValueChange={(value: 'admin' | 'user') => updateUserRole(user.id, value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum usuário encontrado.</p>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
