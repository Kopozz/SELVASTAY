/**
 * ConnectivityBanner — VALVE Edition
 */
import { Wifi, WifiOff, RefreshCw, Cloud, CloudOff } from 'lucide-react';
import { useConnectivity } from '../hooks/useConnectivity';

export default function ConnectivityBanner() {
  const { isOnline, isSupabaseReachable, isFullyConnected, lastSyncTime, recheckConnection } = useConnectivity();

  return (
    <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-medium transition-all duration-300 ${
      isFullyConnected
        ? 'bg-[var(--color-v-green)]/5 border border-[var(--color-v-green)]/10 text-[var(--color-v-green)]'
        : isOnline
        ? 'bg-[var(--color-v-amber)]/5 border border-[var(--color-v-amber)]/10 text-[var(--color-v-amber)]'
        : 'bg-[var(--color-v-red)]/5 border border-[var(--color-v-red)]/10 text-[var(--color-v-red)]'
    }`}>
      <div className={`connectivity-dot ${isFullyConnected ? 'online' : 'offline'}`} />

      {isFullyConnected ? <Cloud size={12} strokeWidth={1.5} /> : isOnline ? <CloudOff size={12} strokeWidth={1.5} /> : <WifiOff size={12} strokeWidth={1.5} />}

      <span>
        {isFullyConnected ? 'Conectado' : isOnline ? 'Sin acceso a Supabase' : 'Modo Offline'}
      </span>

      {lastSyncTime && (
        <span className="text-[var(--color-v-gray-500)] hidden sm:inline">
          · {lastSyncTime.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}

      {!isFullyConnected && (
        <button onClick={recheckConnection} className="ml-auto p-1 rounded-md hover:bg-white/5 transition-colors" title="Reintentar">
          <RefreshCw size={11} strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}
