
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'user' | null;

export const useUserRole = () => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserRole();
    } else {
      setUserRole(null);
      setLoading(false);
    }
  }, [user]);

  const loadUserRole = async () => {
    if (!user) return;

    try {
      console.log('Loading user role for user:', user.id);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user role:', error);
      }

      if (data) {
        console.log('User role found:', data.role);
        setUserRole(data.role as UserRole);
      } else {
        console.log('No user role found, defaulting to user');
        setUserRole('user');
      }
    } catch (error) {
      console.error('Error loading user role:', error);
      setUserRole('user');
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (role: 'admin' | 'user'): boolean => {
    if (role === 'admin') {
      return userRole === 'admin';
    }
    return userRole === 'admin' || userRole === 'user';
  };

  const isAdmin = (): boolean => userRole === 'admin';
  const isUser = (): boolean => userRole === 'user' || userRole === 'admin';

  return {
    userRole,
    loading,
    hasRole,
    isAdmin,
    isUser,
    refreshRole: loadUserRole,
  };
};
