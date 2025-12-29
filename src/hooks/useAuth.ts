import { useState, useCallback } from 'react';

interface User {
  id: string;
  email: string;
}

interface Profile {
  id: string;
  role: string;
  organization_name: string;
  registration_number: string;
  email: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  const signUp = useCallback(async (
    email: string, 
    password: string, 
    role: string, 
    organizationName: string, 
    registrationNumber: string
  ) => {
    setLoading(true);
    try {
      // Mock signup - frontend only
      const mockUser: User = {
        id: crypto.randomUUID(),
        email,
      };
      const mockProfile: Profile = {
        id: mockUser.id,
        role,
        organization_name: organizationName,
        registration_number: registrationNumber,
        email,
      };
      setUser(mockUser);
      setProfile(mockProfile);
      return { user: mockUser, error: null };
    } catch (error: any) {
      return { user: null, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock signin - frontend only
      const mockUser: User = {
        id: crypto.randomUUID(),
        email,
      };
      const mockProfile: Profile = {
        id: mockUser.id,
        role: 'generator',
        organization_name: 'Demo Organization',
        registration_number: 'REG-001',
        email,
      };
      setUser(mockUser);
      setProfile(mockProfile);
      return { user: mockUser, error: null };
    } catch (error: any) {
      return { user: null, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
    setProfile(null);
    return { error: null };
  }, []);

  return {
    user,
    profile,
    session: user ? { user } : null,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };
}
