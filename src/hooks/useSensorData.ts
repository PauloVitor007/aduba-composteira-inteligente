import { useState, useEffect, useCallback } from 'react';
import { SensorReading } from '@/types/sensor';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Simulated sensor data generator (represents Arduino readings)
const generateSimulatedReading = (): Omit<SensorReading, 'id' | 'device_id' | 'recorded_at'> => ({
  humidity: Math.round(55 + Math.random() * 10),
  temperature: Math.round(60 + Math.random() * 8),
  soil_humidity: Math.round(40 + Math.random() * 20),
  ph_level: parseFloat((7 + (Math.random() - 0.5)).toFixed(1)),
  composter_rotation: Math.round(15 + Math.random() * 10),
  reservoir_rotation: Math.round(1 + Math.random() * 4),
  capacity_status: Math.random() > 0.7 ? 'Alto' : Math.random() > 0.4 ? 'Médio' : 'Baixo',
});

export const useSensorData = () => {
  const { user } = useAuth();
  const [currentReading, setCurrentReading] = useState<SensorReading | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLatestReading = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('sensor_readings')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (data) {
        setCurrentReading({
          id: data.id,
          device_id: data.device_id,
          humidity: Number(data.humidity),
          temperature: Number(data.temperature),
          soil_humidity: Number(data.soil_humidity),
          ph_level: Number(data.ph_level),
          composter_rotation: Number(data.composter_rotation),
          reservoir_rotation: Number(data.reservoir_rotation),
          capacity_status: data.capacity_status || 'Normal',
          recorded_at: data.recorded_at,
        });
      } else {
        // Generate simulated data if none exists
        const simulated = generateSimulatedReading();
        setCurrentReading({
          id: 'simulated',
          device_id: 'SIM-001',
          ...simulated,
          recorded_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const simulateNewReading = useCallback(async () => {
    if (!user) return;

    const simulated = generateSimulatedReading();
    const newReading: SensorReading = {
      id: crypto.randomUUID(),
      device_id: 'ADUBA-001',
      ...simulated,
      recorded_at: new Date().toISOString(),
    };

    // Save to database
    const { error: insertError } = await supabase.from('sensor_readings').insert({
      device_id: newReading.device_id,
      user_id: user.id,
      humidity: newReading.humidity,
      temperature: newReading.temperature,
      soil_humidity: newReading.soil_humidity,
      ph_level: newReading.ph_level,
      composter_rotation: newReading.composter_rotation,
      reservoir_rotation: newReading.reservoir_rotation,
      capacity_status: newReading.capacity_status,
    });

    if (!insertError) {
      setCurrentReading(newReading);
    }

    return newReading;
  }, [user]);

  useEffect(() => {
    fetchLatestReading();

    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      simulateNewReading();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchLatestReading, simulateNewReading]);

  return {
    currentReading,
    isLoading,
    error,
    refreshData: fetchLatestReading,
    simulateReading: simulateNewReading,
  };
};
