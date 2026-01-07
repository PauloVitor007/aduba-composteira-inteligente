import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  id?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, deviceId?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  session: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user_aduba');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // NOTE AQUI: Agora chamamos apenas '/api/signin'
      // O Vite vai transformar isso em 'http://localhost:3000/signin' automaticamente
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao entrar');

      const userData = { email, id: data.user?.id };
      setUser(userData);
      localStorage.setItem('user_aduba', JSON.stringify(userData));
      return { error: null };
    } catch (err: any) {
      console.error("Erro Login:", err);
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string, deviceId?: string) => {
    try {
      // AQUI TAMBÉM: '/api/signup'
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, deviceId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao cadastrar');

      const userData = { email };
      setUser(userData);
      localStorage.setItem('user_aduba', JSON.stringify(userData));
      return { error: null };
    } catch (err: any) {
      console.error("Erro Cadastro:", err);
      return { error: err };
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('user_aduba');
  };

  return (
    <AuthContext.Provider value={{ user, session: null, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};