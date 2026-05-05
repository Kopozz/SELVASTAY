/**
 * useReservas — Hook de Reservas con Realtime (Fixed)
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useConnectivity } from './useConnectivity';
import { demoReservas } from '../lib/demoData';

export function useReservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isFullyConnected, isSupabaseReachable } = useConnectivity();

  const fetchReservas = useCallback(async () => {
    if (!navigator.onLine) {
      setReservas(demoReservas);
      setLoading(false);
      return;
    }

    if (isSupabaseReachable === null) return;

    if (isSupabaseReachable === false) {
      setReservas(demoReservas);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('reservas')
        .select(`
          *,
          cliente:clientes(*),
          habitacion:habitaciones(*)
        `)
        .order('fecha_ingreso', { ascending: false });

      if (fetchError) throw fetchError;
      setReservas(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching reservas:', err);
      setError(err.message);
      setReservas(demoReservas);
    } finally {
      setLoading(false);
    }
  }, [isSupabaseReachable]);

  useEffect(() => {
    fetchReservas();

    if (!isFullyConnected) return;

    const channel = supabase
      .channel(`reservas-${Date.now()}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reservas' },
        async (payload) => {
          if (payload.eventType === 'UPDATE') {
            setReservas((prev) =>
              prev.map((r) => (r.id === payload.new.id ? { ...r, ...payload.new } : r))
            );
          } else if (payload.eventType === 'INSERT') {
            // Fetch only the new record with its relations to be efficient
            const { data } = await supabase
              .from('reservas')
              .select('*, cliente:clientes(*), habitacion:habitaciones(*)')
              .eq('id', payload.new.id)
              .single();
            if (data) setReservas((prev) => [data, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setReservas((prev) => prev.filter((r) => r.id !== payload.old.id));
          }
        }
      );

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchReservas, isFullyConnected]);

  const createReservaConCheckin = useCallback(async (clienteData, reservaData) => {
    if (!isFullyConnected) {
      const newReserva = {
        id: crypto.randomUUID(),
        ...reservaData,
        estado: 'checkin',
        cliente: { id: crypto.randomUUID(), ...clienteData },
        habitacion: null,
        created_at: new Date().toISOString(),
      };
      setReservas((prev) => [newReserva, ...prev]);
      return newReserva;
    }

    try {
      let clienteId;
      const { data: existingCliente } = await supabase
        .from('clientes')
        .select('id')
        .eq('documento_id', clienteData.documento_id)
        .single();

      if (existingCliente) {
        clienteId = existingCliente.id;
        await supabase.from('clientes').update(clienteData).eq('id', clienteId);
      } else {
        const { data: newCliente, error: clienteError } = await supabase
          .from('clientes')
          .insert(clienteData)
          .select()
          .single();

        if (clienteError) throw clienteError;
        clienteId = newCliente.id;
      }

      const { data: newReserva, error: reservaError } = await supabase
        .from('reservas')
        .insert({
          ...reservaData,
          cliente_id: clienteId,
          estado: 'checkin',
        })
        .select(`*, cliente:clientes(*), habitacion:habitaciones(*)`)
        .single();

      if (reservaError) throw reservaError;
      return newReserva;
    } catch (err) {
      console.error('Error creating reserva:', err);
      throw err;
    }
  }, [isFullyConnected]);

  const updateEstadoReserva = useCallback(async (reservaId, nuevoEstado) => {
    if (!isFullyConnected) {
      setReservas((prev) =>
        prev.map((r) => (r.id === reservaId ? { ...r, estado: nuevoEstado } : r))
      );
      return;
    }

    const { error: updateError } = await supabase
      .from('reservas')
      .update({ estado: nuevoEstado })
      .eq('id', reservaId);

    if (updateError) throw updateError;
  }, [isFullyConnected]);

  return {
    reservas,
    loading,
    error,
    refetch: fetchReservas,
    createReservaConCheckin,
    updateEstadoReserva,
  };
}
