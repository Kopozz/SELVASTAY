/**
 * useClientes — Hook para gestión de Huéspedes con Anti-Flicker
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useConnectivity } from './useConnectivity';
import { demoClientes } from '../lib/demoData';

export function useClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isSupabaseReachable, isFullyConnected } = useConnectivity();

  const fetchClientes = useCallback(async () => {
    // Si no hay internet, vamos directo a demo para no dejar la pantalla en blanco
    if (!navigator.onLine) {
      setClientes(demoClientes);
      setLoading(false);
      return;
    }

    // Si Supabase no es alcanzable aún, esperamos (evita parpadeo de datos demo)
    if (isSupabaseReachable === null) return; 

    // Si Supabase es definitivamente inalcanzable, usamos demo
    if (isSupabaseReachable === false) {
      setClientes(demoClientes);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('nombre_completo', { ascending: true });

      if (error) throw error;

      // Si la base de datos real tiene datos, los usamos.
      // Si está vacía, para la presentación "viva" que pide el usuario, 
      // podemos mostrar demo, pero lo ideal es respetar el vacío si es intencional.
      // Sin embargo, para evitar el parpadeo de "sale y desaparece", 
      // si Supabase responde [], seteamos [] y listo.
      setClientes(data || []);
    } catch (err) {
      console.error('Error fetching clientes:', err);
      setClientes(demoClientes);
    } finally {
      setLoading(false);
    }
  }, [isSupabaseReachable]);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const updateCliente = useCallback(async (id, updateData) => {
    if (!isFullyConnected) {
      setClientes(prev => prev.map(c => c.id === id ? { ...c, ...updateData } : c));
      return;
    }

    const { error } = await supabase.from('clientes').update(updateData).eq('id', id);
    if (error) throw error;
    setClientes(prev => prev.map(c => c.id === id ? { ...c, ...updateData } : c));
  }, [isFullyConnected]);

  return { clientes, loading, updateCliente, refetch: fetchClientes };
}
