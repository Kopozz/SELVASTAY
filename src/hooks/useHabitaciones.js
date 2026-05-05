/**
 * useHabitaciones — Hook de Habitaciones con Realtime (Fixed)
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useConnectivity } from './useConnectivity';
import { demoHabitaciones } from '../lib/demoData';

export function useHabitaciones(lodgeId) {
  const [habitaciones, setHabitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isFullyConnected, isSupabaseReachable } = useConnectivity();

  const fetchHabitaciones = useCallback(async () => {
    if (!navigator.onLine) {
      setHabitaciones(demoHabitaciones);
      setLoading(false);
      return;
    }

    // Esperar a que el estado de conexión sea definitivo
    if (isSupabaseReachable === null) return;

    if (isSupabaseReachable === false) {
      setHabitaciones(demoHabitaciones);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let query = supabase
        .from('habitaciones')
        .select('*')
        .order('numero', { ascending: true });

      if (lodgeId) {
        query = query.eq('lodge_id', lodgeId);
      }

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      
      // Sincronización exitosa
      setHabitaciones(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching habitaciones:', err);
      setError(err.message);
      setHabitaciones(demoHabitaciones);
    } finally {
      setLoading(false);
    }
  }, [lodgeId, isSupabaseReachable]);

  useEffect(() => {
    fetchHabitaciones();

    if (!isFullyConnected) return;

    // Build channel with callbacks BEFORE subscribing
    const channel = supabase
      .channel(`habitaciones-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'habitaciones',
          ...(lodgeId ? { filter: `lodge_id=eq.${lodgeId}` } : {}),
        },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              setHabitaciones((prev) => [...prev, payload.new]);
              break;
            case 'UPDATE':
              setHabitaciones((prev) =>
                prev.map((h) => (h.id === payload.new.id ? payload.new : h))
              );
              break;
            case 'DELETE':
              setHabitaciones((prev) =>
                prev.filter((h) => h.id !== payload.old.id)
              );
              break;
          }
        }
      );

    // Subscribe AFTER all callbacks are registered
    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchHabitaciones, lodgeId, isFullyConnected]);

  const updateEstado = useCallback(async (habitacionId, nuevoEstado) => {
    if (!isFullyConnected) {
      setHabitaciones((prev) =>
        prev.map((h) =>
          h.id === habitacionId ? { ...h, estado: nuevoEstado } : h
        )
      );
      return;
    }

    const { error: updateError } = await supabase
      .from('habitaciones')
      .update({ estado: nuevoEstado })
      .eq('id', habitacionId);

    if (updateError) {
      console.error('Error updating habitación:', updateError);
      throw updateError;
    }
  }, [isFullyConnected]);

  return {
    habitaciones,
    loading,
    error,
    refetch: fetchHabitaciones,
    updateEstado,
  };
}
