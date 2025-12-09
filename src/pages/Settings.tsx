import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  History, 
  Bell, 
  BellOff, 
  ChevronRight,
  Shield,
  HelpCircle,
  Info
} from 'lucide-react';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('device_settings')
        .select('notifications_enabled')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (data) {
        setNotificationsEnabled(data.notifications_enabled ?? true);
      }
    };
    
    fetchSettings();
  }, [user]);

  const handleNotificationToggle = async (enabled: boolean) => {
    if (!user) return;
    
    setIsUpdating(true);
    setNotificationsEnabled(enabled);

    try {
      const { data: existing } = await supabase
        .from('device_settings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('device_settings')
          .update({ notifications_enabled: enabled })
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('device_settings')
          .insert({ 
            user_id: user.id, 
            device_id: 'ADUBA-001',
            notifications_enabled: enabled 
          });
      }

      toast({
        title: enabled ? 'Notificações ativadas' : 'Notificações desativadas',
        description: enabled 
          ? 'Você receberá alertas sobre sua composteira'
          : 'Você não receberá mais alertas',
      });
    } catch {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar as configurações',
        variant: 'destructive',
      });
      setNotificationsEnabled(!enabled);
    } finally {
      setIsUpdating(false);
    }
  };

  const menuItems = [
    {
      icon: User,
      label: 'Acessar detalhes da conta',
      onClick: () => navigate('/account'),
      chevron: true,
    },
    {
      icon: History,
      label: 'Acessar Histórico',
      onClick: () => navigate('/history'),
      chevron: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Configurações" />

      <main className="px-4 -mt-10 relative z-10">
        {/* User Info Card */}
        <div className="bg-card rounded-2xl p-5 shadow-card mb-6 animate-scale-in">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {user?.email?.split('@')[0] || 'Usuário'}
              </h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-card rounded-2xl shadow-card mb-6 overflow-hidden animate-fade-in" style={{ animationDelay: '100ms' }}>
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-b-0"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium text-foreground">{item.label}</span>
              </div>
              {item.chevron && (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          ))}
        </div>

        {/* Notifications Section */}
        <div className="bg-card rounded-2xl p-5 shadow-card mb-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <h3 className="text-lg font-bold text-foreground mb-4">Notificações</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-accent" />
                <div>
                  <p className="font-medium text-foreground">Permitir notificações</p>
                  <p className="text-xs text-muted-foreground">Receba alertas importantes</p>
                </div>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={handleNotificationToggle}
                disabled={isUpdating}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-3">
                <BellOff className="w-5 h-5 text-destructive" />
                <div>
                  <p className="font-medium text-foreground">Bloquear notificações</p>
                  <p className="text-xs text-muted-foreground">Desative todos os alertas</p>
                </div>
              </div>
              <Switch
                checked={!notificationsEnabled}
                onCheckedChange={(checked) => handleNotificationToggle(!checked)}
                disabled={isUpdating}
              />
            </div>
          </div>
        </div>

        {/* Additional Options */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden animate-fade-in" style={{ animationDelay: '300ms' }}>
          {[
            { icon: Shield, label: 'Privacidade e Segurança' },
            { icon: HelpCircle, label: 'Ajuda e Suporte' },
            { icon: Info, label: 'Sobre o App' },
          ].map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-b-0"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="font-medium text-foreground">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Settings;
