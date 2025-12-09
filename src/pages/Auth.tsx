import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LeafIcon } from '@/components/icons/LeafIcon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  deviceId: z.string().optional(),
});

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const validateForm = () => {
    try {
      loginSchema.parse({ email, password, deviceId });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: { email?: string; password?: string } = {};
        err.errors.forEach((e) => {
          if (e.path[0] === 'email') fieldErrors.email = e.message;
          if (e.path[0] === 'password') fieldErrors.password = e.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: 'Erro ao entrar',
            description: error.message === 'Invalid login credentials' 
              ? 'Email ou senha incorretos' 
              : error.message,
            variant: 'destructive',
          });
        } else {
          toast({ title: 'Bem-vindo!', description: 'Login realizado com sucesso' });
        }
      } else {
        const { error } = await signUp(email, password, deviceId);
        if (error) {
          toast({
            title: 'Erro ao cadastrar',
            description: error.message.includes('already registered')
              ? 'Este email já está cadastrado'
              : error.message,
            variant: 'destructive',
          });
        } else {
          toast({ 
            title: 'Conta criada!', 
            description: 'Sua conta foi criada com sucesso' 
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="gradient-hero px-6 pt-16 pb-24 rounded-b-[3rem] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-primary-foreground rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-accent rounded-full blur-2xl" />
        </div>
        
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-primary-foreground/20 rounded-2xl flex items-center justify-center animate-scale-in">
            <LeafIcon className="w-12 h-12 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-primary-foreground mb-2 animate-fade-in">
            Maria Composteira
          </h1>
          <p className="text-primary-foreground/80 animate-fade-in" style={{ animationDelay: '100ms' }}>
            Inteligente ADUBA
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 px-6 -mt-12 relative z-20">
        <div className="bg-card rounded-3xl shadow-card p-6 animate-slide-up">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                isLogin 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                !isLogin 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Cadastrar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="deviceId" className="text-foreground font-medium">
                  ID do Dispositivo
                </Label>
                <Input
                  id="deviceId"
                  type="text"
                  placeholder="Ex: ADUBA-001"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  className="input-field"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`input-field ${errors.email ? 'border-destructive' : ''}`}
                required
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`input-field pr-12 ${errors.password ? 'border-destructive' : ''}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary h-12 text-lg"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isLogin ? (
                'Entrar'
              ) : (
                'Criar Conta'
              )}
            </Button>
          </form>

          {isLogin && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              Esqueceu a senha?{' '}
              <button className="text-primary font-medium hover:underline">
                Recuperar
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          © 2024 Maria Composteira ADUBA
        </p>
      </div>
    </div>
  );
};

export default Auth;
