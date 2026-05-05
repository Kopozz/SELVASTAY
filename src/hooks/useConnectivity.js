/**
 * Guardia de Conectividad — SelvaStay Pro
 */
import { useState, useEffect, useCallback, useRef } from 'react';

const SB_URL = import.meta.env.VITE_SUPABASE_URL;
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const PING_INTERVAL = 30000;
const PING_TIMEOUT = 8000;

export function useConnectivity() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSupabaseReachable, setIsSupabaseReachable] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const intervalRef = useRef(null);

  const checkSupabaseConnection = useCallback(async () => {
    if (!SB_URL || !SB_KEY) return false;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), PING_TIMEOUT);

      const response = await fetch(`${SB_URL}/rest/v1/habitaciones?select=id&limit=1`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'apikey': SB_KEY,
          'Authorization': `Bearer ${SB_KEY}`,
          'Content-Type': 'application/json'
        },
      });

      clearTimeout(timeoutId);
      
      const reachable = response.status === 200 || response.status === 206;
      setIsSupabaseReachable(reachable);

      if (reachable) {
        setLastSyncTime(new Date());
      }

      return reachable;
    } catch {
      setIsSupabaseReachable(false);
      return false;
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => { setIsOnline(true); checkSupabaseConnection(); };
    const handleOffline = () => { setIsOnline(false); setIsSupabaseReachable(false); };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    checkSupabaseConnection();
    intervalRef.current = setInterval(checkSupabaseConnection, PING_INTERVAL);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [checkSupabaseConnection]);

  return {
    isOnline,
    isSupabaseReachable,
    isFullyConnected: isOnline && isSupabaseReachable,
    lastSyncTime,
    recheckConnection: checkSupabaseConnection,
  };
}
