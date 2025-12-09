import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { SensorCard } from '@/components/SensorCard';
import { useSensorData } from '@/hooks/useSensorData';
import { Button } from '@/components/ui/button';
import { 
  Droplets, 
  Thermometer, 
  FlaskConical, 
  RefreshCcw, 
  Container,
  Lightbulb,
  RefreshCw,
  Loader2
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentReading, isLoading, simulateReading } = useSensorData();

  const sensors = currentReading
    ? [
        {
          title: 'Umidade do Ar',
          value: currentReading.humidity,
          unit: '%',
          icon: <Droplets className="w-6 h-6 text-sensor-humidity" />,
          colorClass: 'bg-sensor-humidity/20',
          delay: 100,
        },
        {
          title: 'Temperatura',
          value: currentReading.temperature,
          unit: '°C',
          icon: <Thermometer className="w-6 h-6 text-sensor-temperature" />,
          colorClass: 'bg-sensor-temperature/20',
          delay: 200,
        },
        {
          title: 'pH do Solo',
          value: currentReading.ph_level,
          unit: '',
          icon: <FlaskConical className="w-6 h-6 text-sensor-ph" />,
          colorClass: 'bg-sensor-ph/20',
          delay: 300,
        },
        {
          title: 'Rotação Composteira',
          value: currentReading.composter_rotation,
          unit: '%',
          icon: <RefreshCcw className="w-6 h-6 text-sensor-rotation" />,
          colorClass: 'bg-sensor-rotation/20',
          delay: 400,
        },
        {
          title: 'Rotação Reservatório',
          value: currentReading.reservoir_rotation,
          unit: '%',
          icon: <Container className="w-6 h-6 text-sensor-capacity" />,
          colorClass: 'bg-sensor-capacity/20',
          delay: 500,
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Dashboard" />

      <main className="px-4 -mt-10 relative z-10">
        {/* Status Card */}
        <div className="bg-card rounded-2xl p-5 shadow-card mb-6 animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">Status Geral</h2>
              <p className="text-sm text-muted-foreground">
                Dispositivo: {currentReading?.device_id || 'Carregando...'}
              </p>
            </div>
            <button 
              onClick={() => simulateReading()}
              className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent hover:bg-accent/30 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-xl">
            <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
            <span className="text-sm font-medium text-foreground">
              Sistema operando normalmente
            </span>
          </div>
        </div>

        {/* Sensor Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {sensors.map((sensor, index) => (
              <SensorCard key={index} {...sensor} />
            ))}
            
            {/* Capacity Status - Full Width */}
            {currentReading && (
              <div className="col-span-2 card-sensor animate-fade-in" style={{ animationDelay: '600ms' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Status de Lotação
                    </h3>
                    <span className="text-2xl font-bold text-foreground">
                      {currentReading.capacity_status}
                    </span>
                  </div>
                  <div className={`px-4 py-2 rounded-xl font-semibold ${
                    currentReading.capacity_status === 'Alto' 
                      ? 'bg-destructive/20 text-destructive' 
                      : currentReading.capacity_status === 'Médio'
                      ? 'bg-sensor-capacity/20 text-sensor-capacity'
                      : 'bg-accent/20 text-accent'
                  }`}>
                    {currentReading.capacity_status === 'Alto' ? 'Atenção' : 'Normal'}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tips Button */}
        <Button 
          onClick={() => navigate('/tips')}
          className="w-full btn-secondary h-14 text-lg gap-3 animate-fade-in"
          style={{ animationDelay: '700ms' }}
        >
          <Lightbulb className="w-6 h-6" />
          Acessar Dicas
        </Button>
      </main>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
