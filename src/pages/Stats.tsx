import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';

interface ChartData {
  date: string;
  humidity: number;
  temperature: number;
  ph: number;
}

const Stats: React.FC = () => {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState<'humidity' | 'temperature' | 'ph'>('humidity');

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const sevenDaysAgo = subDays(new Date(), 7).toISOString();

      const { data } = await supabase
        .from('sensor_readings')
        .select('humidity, temperature, ph_level, recorded_at')
        .eq('user_id', user.id)
        .gte('recorded_at', sevenDaysAgo)
        .order('recorded_at', { ascending: true });

      if (data && data.length > 0) {
        const formattedData: ChartData[] = data.map(reading => ({
          date: format(new Date(reading.recorded_at), 'dd/MM', { locale: ptBR }),
          humidity: Number(reading.humidity) || 0,
          temperature: Number(reading.temperature) || 0,
          ph: Number(reading.ph_level) || 0,
        }));
        setChartData(formattedData);
      } else {
        // Generate sample data for demonstration
        const sampleData: ChartData[] = Array.from({ length: 7 }, (_, i) => ({
          date: format(subDays(new Date(), 6 - i), 'dd/MM', { locale: ptBR }),
          humidity: 55 + Math.random() * 10,
          temperature: 60 + Math.random() * 10,
          ph: 6.5 + Math.random() * 1.5,
        }));
        setChartData(sampleData);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [user]);

  const metricConfig = {
    humidity: { label: 'Umidade', color: 'hsl(200, 70%, 50%)', unit: '%' },
    temperature: { label: 'Temperatura', color: 'hsl(15, 85%, 55%)', unit: '°C' },
    ph: { label: 'pH', color: 'hsl(280, 60%, 55%)', unit: '' },
  };

  const currentConfig = metricConfig[activeMetric];

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Estatísticas" />

      <main className="px-4 -mt-10 relative z-10">
        {/* Metric Selector */}
        <div className="bg-card rounded-2xl p-4 shadow-card mb-6 animate-scale-in">
          <div className="flex gap-2">
            {Object.entries(metricConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setActiveMetric(key as typeof activeMetric)}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                  activeMetric === key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-card rounded-2xl p-5 shadow-card mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <h3 className="text-lg font-bold text-foreground mb-4">
            {currentConfig.label} - Últimos 7 dias
          </h3>

          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.75rem',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    formatter={(value: number) => [
                      `${value.toFixed(1)}${currentConfig.unit}`,
                      currentConfig.label
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey={activeMetric}
                    stroke={currentConfig.color}
                    strokeWidth={3}
                    dot={{ fill: currentConfig.color, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: currentConfig.color }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3 animate-fade-in" style={{ animationDelay: '200ms' }}>
          {['Mínimo', 'Média', 'Máximo'].map((label, index) => {
            const values = chartData.map(d => d[activeMetric]);
            let value = 0;
            if (values.length > 0) {
              if (label === 'Mínimo') value = Math.min(...values);
              else if (label === 'Máximo') value = Math.max(...values);
              else value = values.reduce((a, b) => a + b, 0) / values.length;
            }

            return (
              <div key={index} className="bg-card rounded-xl p-4 shadow-soft text-center">
                <p className="text-xs text-muted-foreground mb-1">{label}</p>
                <p className="text-xl font-bold text-foreground">
                  {value.toFixed(1)}{currentConfig.unit}
                </p>
              </div>
            );
          })}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Stats;
