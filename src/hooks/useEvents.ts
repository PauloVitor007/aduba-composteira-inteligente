import { useState, useEffect, useCallback } from 'react';
import { Event } from '@/types/sensor';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useEvents = (selectedDate?: Date) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      let query = supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (selectedDate) {
        const dateStr = selectedDate.toISOString().split('T')[0];
        query = query.eq('event_date', dateStr);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setEvents(
        (data || []).map((e) => ({
          id: e.id,
          event_type: e.event_type,
          description: e.description || '',
          event_date: e.event_date,
          created_at: e.created_at,
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar eventos');
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedDate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, isLoading, error, refreshEvents: fetchEvents };
};
