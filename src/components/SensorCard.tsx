import React from 'react';
import { cn } from '@/lib/utils';

interface SensorCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  colorClass: string;
  delay?: number;
}

export const SensorCard: React.FC<SensorCardProps> = ({
  title,
  value,
  unit,
  icon,
  colorClass,
  delay = 0,
}) => {
  return (
    <div 
      className={cn(
        "card-sensor animate-fade-in group cursor-pointer",
        "hover:shadow-glow"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div 
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            "transition-transform duration-300 group-hover:scale-110",
            colorClass
          )}
        >
          {icon}
        </div>
        <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
          Ao vivo
        </div>
      </div>
      
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
      
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-foreground">{value}</span>
        {unit && <span className="text-lg font-medium text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
};
