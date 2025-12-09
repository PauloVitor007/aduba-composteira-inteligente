import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LeafIcon } from './icons/LeafIcon';
import { LogOut, User } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  title?: string;
  showLogout?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title = 'ADUBA', showLogout = true }) => {
  const { user, signOut } = useAuth();

  return (
    <header className="gradient-hero text-primary-foreground px-6 pt-8 pb-16 rounded-b-3xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
            <LeafIcon className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Maria Composteira</h1>
            <p className="text-sm text-primary-foreground/70">{title}</p>
          </div>
        </div>
        
        {showLogout && user && (
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={signOut}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
      
      <div className="text-center">
        <p className="text-primary-foreground/80 text-sm">
          Monitoramento inteligente da sua composteira
        </p>
      </div>
    </header>
  );
};
