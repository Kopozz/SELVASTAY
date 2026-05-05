/**
 * ConfigPage — Configuración del sistema
 */
import { Settings, Shield, Bell, Database, HardDrive, RefreshCw } from 'lucide-react';
import { useConnectivity } from '../hooks/useConnectivity';

export default function ConfigPage() {
  const { isOnline, isSupabaseReachable, lastSyncTime } = useConnectivity();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-[var(--color-v-white)] tracking-tight">Configuración</h1>
        <p className="text-[var(--color-v-gray-400)] text-sm mt-1">Preferencias del sistema y estado del backend.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Connection status */}
        <div className="v-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[var(--color-v-black-3)] text-[var(--color-v-green)]">
              <RefreshCw size={18} />
            </div>
            <h3 className="text-sm font-semibold text-[var(--color-v-white)] uppercase tracking-widest">Sincronización</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--color-v-gray-400)]">Estado de Internet</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isOnline ? 'bg-[rgba(0,230,118,0.1)] text-[var(--color-v-green)]' : 'bg-[rgba(255,23,68,0.1)] text-[var(--color-v-red)]'}`}>
                {isOnline ? 'CONECTADO' : 'DESCONECTADO'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--color-v-gray-400)]">Base de Datos (Supabase)</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isSupabaseReachable ? 'bg-[rgba(0,230,118,0.1)] text-[var(--color-v-green)]' : 'bg-[rgba(255,171,0,0.1)] text-[var(--color-v-amber)]'}`}>
                {isSupabaseReachable ? 'OPERATIVO' : 'ERROR DE CONEXIÓN'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--color-v-gray-400)]">Última sincronización</span>
              <span className="text-xs text-[var(--color-v-gray-200)]">
                {lastSyncTime ? lastSyncTime.toLocaleTimeString() : 'Nunca'}
              </span>
            </div>
          </div>
        </div>

        {/* System info */}
        <div className="v-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[var(--color-v-black-3)] text-[var(--color-v-blue)]">
              <Database size={18} />
            </div>
            <h3 className="text-sm font-semibold text-[var(--color-v-white)] uppercase tracking-widest">Sistema</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--color-v-gray-400)]">Versión del Software</span>
              <span className="text-xs text-[var(--color-v-gray-200)]">v2.4.0-VALVE</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--color-v-gray-400)]">Almacenamiento Local</span>
              <span className="text-xs text-[var(--color-v-green)]">Optimizado</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--color-v-gray-400)]">Logs de Auditoría</span>
              <button className="text-[10px] font-bold text-[var(--color-v-blue)] hover:underline uppercase tracking-wider">Ver Logs</button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="v-card overflow-hidden divide-y divide-[rgba(255,255,255,0.02)]">
        <div className="p-4 flex items-center justify-between hover:bg-[var(--color-v-black-3)] transition-colors cursor-pointer group">
          <div className="flex items-center gap-4">
            <Bell size={18} className="text-[var(--color-v-gray-500)] group-hover:text-[var(--color-v-green)] transition-colors" />
            <div>
              <p className="text-sm font-medium text-[var(--color-v-white)]">Notificaciones</p>
              <p className="text-xs text-[var(--color-v-gray-500)]">Gestionar alertas de check-in y limpieza.</p>
            </div>
          </div>
          <Settings size={14} className="text-[var(--color-v-gray-600)]" />
        </div>
        
        <div className="p-4 flex items-center justify-between hover:bg-[var(--color-v-black-3)] transition-colors cursor-pointer group">
          <div className="flex items-center gap-4">
            <Shield size={18} className="text-[var(--color-v-gray-500)] group-hover:text-[var(--color-v-blue)] transition-colors" />
            <div>
              <p className="text-sm font-medium text-[var(--color-v-white)]">Seguridad</p>
              <p className="text-xs text-[var(--color-v-gray-500)]">Permisos de usuario y llaves API.</p>
            </div>
          </div>
          <Settings size={14} className="text-[var(--color-v-gray-600)]" />
        </div>

        <div className="p-4 flex items-center justify-between hover:bg-[var(--color-v-black-3)] transition-colors cursor-pointer group">
          <div className="flex items-center gap-4">
            <HardDrive size={18} className="text-[var(--color-v-gray-500)] group-hover:text-[var(--color-v-amber)] transition-colors" />
            <div>
              <p className="text-sm font-medium text-[var(--color-v-white)]">Backup</p>
              <p className="text-xs text-[var(--color-v-gray-500)]">Exportar datos locales en formato CSV/JSON.</p>
            </div>
          </div>
          <Settings size={14} className="text-[var(--color-v-gray-600)]" />
        </div>
      </div>
    </div>
  );
}
