import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { useEvents } from '@/hooks/useEvents';
import { ChevronLeft, ChevronRight, CalendarDays, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const History: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const { events, isLoading } = useEvents(selectedDate || undefined);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const firstDayOfWeek = monthStart.getDay();
  const emptyDays = Array(firstDayOfWeek).fill(null);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Histórico" />

      <main className="px-4 -mt-10 relative z-10">
        {/* Calendar Card */}
        <div className="bg-card rounded-2xl p-5 shadow-card mb-6 animate-scale-in">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => navigateMonth('prev')}
              className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            
            <h2 className="text-lg font-bold text-foreground capitalize">
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </h2>
            
            <button 
              onClick={() => navigateMonth('next')}
              className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {emptyDays.map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}
            
            {daysInMonth.map(day => {
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isCurrentDay = isToday(day);
              
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all",
                    isSelected 
                      ? "bg-primary text-primary-foreground scale-110 shadow-lg" 
                      : isCurrentDay
                      ? "bg-accent/20 text-accent"
                      : "hover:bg-muted text-foreground"
                  )}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>
        </div>

        {/* Events Section */}
        <div className="bg-card rounded-2xl p-5 shadow-card animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <CalendarDays className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">
              {selectedDate 
                ? format(selectedDate, "d 'de' MMMM", { locale: ptBR })
                : 'Selecione uma data'
              }
            </h3>
          </div>

          {!selectedDate ? (
            <p className="text-muted-foreground text-center py-8">
              Toque em uma data no calendário para ver os eventos
            </p>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">Nenhum evento registrado neste dia</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map(event => (
                <div 
                  key={event.id}
                  className="p-4 bg-muted/50 rounded-xl border border-border/50"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 bg-accent rounded-full" />
                    <span className="text-sm font-semibold text-foreground">
                      {event.event_type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-4">
                    {event.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default History;
