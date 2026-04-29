import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type Role = 'customer' | 'admin';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: Role | null;
  points: number;
  rank: string;
  phone: string;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [points, setPoints] = useState(0);
  const [rank, setRank] = useState('Bronze');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const calculateRank = (pts: number) => {
    if (pts < 500) return 'Bronze';
    if (pts < 1500) return 'Silver';
    if (pts < 3000) return 'Gold';
    if (pts < 6000) return 'Platinum';
    return 'Diamond';
  };

  const fetchProfile = useCallback(async (userId: string, currentUser?: User | null) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, loyalty_points, rank, phone')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setRole(data.role as Role);
        const pts = data.loyalty_points || 0;
        setPoints(pts);
        setPhone(data.phone || '');
        
        setRank(calculateRank(pts));
      } else {
        const metadataRole = currentUser?.user_metadata?.role as Role;
        setRole(metadataRole || 'customer');
      }

    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      setRole(null);
    }
  }, []);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user);
      }
      setIsLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id, session.user);
        } else {
          setRole(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        role,
        points,
        rank,
        phone,
        isLoading,
        signOut,
        refreshProfile,
      }}

    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
