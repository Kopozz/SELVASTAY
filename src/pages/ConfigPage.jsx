/**
 * ConfigPage — Ajustes del Sistema & Personalización de Negocio (Motor SaaS)
 * Incluye bitácora de auditoría y control de módulos activos.
 */
import { useState } from 'react';
import { 
  Settings, 
  Shield, 
  Bell, 
  Database, 
  HardDrive, 
  RefreshCw, 
  Sliders, 
  Eye, 
  ClipboardList, 
  Trash2, 
  Download,
  CheckCircle,
  HelpCircle,
  Briefcase,
  Trees,
  Hotel,
  Activity,
  Car
} from 'lucide-react';
import { useConnectivity } from '../hooks/useConnectivity';
import { useBusinessConfig, BUSINESS_TYPES } from '../hooks/useBusinessConfig';
import toast from 'react-hot-toast';

const bizTypeIcons = {
  lodge: Trees,
  hotel: Hotel,
  coworking: Briefcase,
  canchas: Activity,
  alquiler: Car
};

export default function ConfigPage() {
  const { isOnline, isSupabaseReachable, lastSyncTime } = useConnectivity();
  const { 
    businessName, 
    businessType, 
    currency, 
    activeModules, 
    auditLogs, 
    toggleModule, 
    updateBusinessSettings, 
    clearAuditLogs 
  } = useBusinessConfig();

  // Estados locales para la edición
  const [tempName, setTempName] = useState(businessName);
  const [tempType, setTempType] = useState(businessType);
  const [tempCurrency, setTempCurrency] = useState(currency);
  const [logSearch, setLogSearch] = useState('');

  // Guardar configuración general
  const handleSaveSettings = (e) => {
    e.preventDefault();
    if (!tempName.trim()) {
      toast.error('El nombre del negocio no puede estar vacío.');
      return;
    }
    updateBusinessSettings(tempName, tempType, tempCurrency);
    toast.success('Configuración del negocio guardada y aplicada.');
  };

  // Exportar Logs a JSON
  const handleExportLogs = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `auditoria_selvastay_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success('Historial de trazabilidad exportado con éxito.');
    } catch {
      toast.error('Error al exportar logs.');
    }
  };

  // Filtrar logs de auditoría
  const filteredLogs = auditLogs.filter(log => 
    log.action.toLowerCase().includes(logSearch.toLowerCase()) || 
    log.details.toLowerCase().includes(logSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-[var(--color-v-white)] tracking-tight">Ajustes & Personalización</h1>
        <p className="text-[var(--color-v-gray-400)] text-sm mt-1">
          Adapta el sistema a cualquier tipo de negocio y monitorea la bitácora de auditoría ágil.
        </p>
      </header>

      {/* Grid: Conectividad y Ajustes de Motor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Conectividad y Info del Software */}
        <div className="lg:col-span-1 space-y-6">
          {/* Connection status */}
          <div className="v-card p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-[var(--color-v-black-3)] text-[var(--color-v-green)]">
                <RefreshCw size={16} />
              </div>
              <h3 className="text-xs font-bold text-[var(--color-v-white)] uppercase tracking-widest">Sincronización</h3>
            </div>
            
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--color-v-gray-400)]">Red Internet</span>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded ${isOnline ? 'bg-[rgba(0,230,118,0.08)] text-[var(--color-v-green)]' : 'bg-[rgba(255,23,68,0.08)] text-[var(--color-v-red)]'}`}>
                  {isOnline ? 'CONECTADO' : 'DESCONECTADO'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--color-v-gray-400)]">Base de Datos (Supabase)</span>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded ${isSupabaseReachable ? 'bg-[rgba(0,230,118,0.08)] text-[var(--color-v-green)]' : 'bg-[rgba(255,171,0,0.08)] text-[var(--color-v-amber)]'}`}>
                  {isSupabaseReachable ? 'OPERATIVO' : 'DESCONECTADO'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--color-v-gray-400)]">Sincronizado</span>
                <span className="text-xs text-[var(--color-v-gray-200)]">
                  {lastSyncTime ? lastSyncTime.toLocaleTimeString() : 'Nunca'}
                </span>
              </div>
            </div>
          </div>

          {/* System info */}
          <div className="v-card p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-[var(--color-v-black-3)] text-[var(--color-v-blue)]">
                <Database size={16} />
              </div>
              <h3 className="text-xs font-bold text-[var(--color-v-white)] uppercase tracking-widest">Tecnología</h3>
            </div>
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--color-v-gray-400)]">Edición del Software</span>
                <span className="text-xs text-[var(--color-v-gray-200)]">v2.5.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--color-v-gray-400)]">Persistencia Local</span>
                <span className="text-xs text-[var(--color-v-green)] font-semibold">localStorage Híbrido</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--color-v-gray-400)]">Capacidad Operativa</span>
                <span className="text-xs text-[var(--color-v-gray-200)]">100% Offline-First</span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha (2/3): Motor de Adaptabilidad de Negocio */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSaveSettings} className="v-card p-6 space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-[rgba(255,255,255,0.03)]">
              <div className="p-2 rounded-lg bg-[var(--color-v-black-3)] text-[var(--color-v-green)]">
                <Sliders size={16} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[var(--color-v-white)] uppercase tracking-widest">Configuración de Adaptabilidad</h3>
                <p className="text-[10px] text-[var(--color-v-gray-500)] mt-0.5">Define las reglas semánticas y de moneda para tu negocio.</p>
              </div>
            </div>

            {/* Inputs generales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-v-gray-400)] mb-1">Nombre Comercial del Negocio</label>
                <input 
                  type="text" 
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="input-field" 
                  placeholder="Ej. San Martín Padel Club"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-v-gray-400)] mb-1">Símbolo de Moneda</label>
                <select 
                  value={tempCurrency}
                  onChange={(e) => setCurrency(e.target.value)} // También actualiza el state del hook
                  onBlur={(e) => setTempCurrency(e.target.value)}
                  className="input-field py-2"
                >
                  <option value="S/">Soles Peruanos (S/)</option>
                  <option value="$">Dólares Americanos ($)</option>
                  <option value="€">Euros (€)</option>
                </select>
              </div>
            </div>

            {/* Selector de Categoría con tarjetas interactivas */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-v-gray-400)]">Giro / Categoría del Negocio</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {Object.values(BUSINESS_TYPES).map(type => {
                  const Icon = bizTypeIcons[type.id] || Trees;
                  const isSelected = tempType === type.id;
                  return (
                    <div 
                      key={type.id}
                      onClick={() => setTempType(type.id)}
                      className={`v-card p-3 flex flex-col justify-between cursor-pointer text-left transition-all ${
                        isSelected 
                          ? 'border-[var(--color-v-green)] bg-[rgba(0,230,118,0.03)] scale-[1.02] shadow-[0_0_15px_rgba(0,230,118,0.1)]' 
                          : 'border-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.1)]'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1.5 rounded ${isSelected ? 'bg-[var(--color-v-green)] text-black' : 'bg-[var(--color-v-black-4)] text-[var(--color-v-gray-400)]'}`}>
                          <Icon size={14} />
                        </div>
                        <h4 className="text-xs font-bold text-[var(--color-v-white)]">{type.name}</h4>
                      </div>
                      
                      {/* Vocabulary Preview */}
                      <div className="text-xs text-[var(--color-v-gray-500)] space-y-0.5 border-t border-[rgba(255,255,255,0.02)] pt-2 mt-1">
                        <div>Unidad: <span className="text-[var(--color-v-gray-300)] font-semibold">{type.unit}</span></div>
                        <div>Usuario: <span className="text-[var(--color-v-gray-300)] font-semibold">{type.client}</span></div>
                        <div>Trámite: <span className="text-[var(--color-v-gray-300)] font-semibold">{type.booking}</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Módulos Activos Switches */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-v-gray-400)]">Módulos Habilitados (Modular MVP)</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="v-card p-3.5 bg-[var(--color-v-black-3)] flex items-center justify-between border-[rgba(255,255,255,0.02)]">
                  <div>
                    <h5 className="text-xs font-bold text-[var(--color-v-white)]">Clientes</h5>
                    <p className="text-xs text-[var(--color-v-gray-500)] mt-0.5">Directorio e historial de usuarios.</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => toggleModule('clients')}
                    className={`text-xs px-2 py-1 rounded font-bold uppercase tracking-wider ${
                      activeModules.clients 
                        ? 'bg-[rgba(0,230,118,0.1)] text-[var(--color-v-green)]' 
                        : 'bg-[var(--color-v-black-4)] text-[var(--color-v-gray-500)]'
                    }`}
                  >
                    {activeModules.clients ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div className="v-card p-3.5 bg-[var(--color-v-black-3)] flex items-center justify-between border-[rgba(255,255,255,0.02)]">
                  <div>
                    <h5 className="text-xs font-bold text-[var(--color-v-white)]">Servicios</h5>
                    <p className="text-xs text-[var(--color-v-gray-500)] mt-0.5">Consumos y cobros adicionales.</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => toggleModule('services')}
                    className={`text-xs px-2 py-1 rounded font-bold uppercase tracking-wider ${
                      activeModules.services 
                        ? 'bg-[rgba(0,230,118,0.1)] text-[var(--color-v-green)]' 
                        : 'bg-[var(--color-v-black-4)] text-[var(--color-v-gray-500)]'
                    }`}
                  >
                    {activeModules.services ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div className="v-card p-3.5 bg-[var(--color-v-black-3)] flex items-center justify-between border-[rgba(255,255,255,0.02)]">
                  <div>
                    <h5 className="text-xs font-bold text-[var(--color-v-white)]">Proyectos</h5>
                    <p className="text-xs text-[var(--color-v-gray-500)] mt-0.5">Gestor Kanban y Scrum del equipo.</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => toggleModule('projects')}
                    className={`text-xs px-2 py-1 rounded font-bold uppercase tracking-wider ${
                      activeModules.projects 
                        ? 'bg-[rgba(0,230,118,0.1)] text-[var(--color-v-green)]' 
                        : 'bg-[var(--color-v-black-4)] text-[var(--color-v-gray-500)]'
                    }`}
                  >
                    {activeModules.projects ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            </div>

            {/* Guardar */}
            <div className="flex justify-end pt-3 border-t border-[rgba(255,255,255,0.02)]">
              <button type="submit" className="btn-primary flex items-center gap-1.5 text-xs">
                <CheckCircle size={14} />
                <span>Aplicar Personalización</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bitácora de Auditoría y Trazabilidad (Tópico de Gestión de Proyectos / Calidad) */}
      <div className="v-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.03)] mb-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="text-[var(--color-v-green)]" size={16} />
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-v-white)] uppercase tracking-wider">Bitácora de Auditoría y Trazabilidad</h3>
              <p className="text-[10px] text-[var(--color-v-gray-500)] mt-0.5">
                Historial cronológico de cambios para control de calidad, aseguramiento y auditoría (ISO 25010).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              placeholder="Buscar acción/detalle..." 
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              className="input-field py-1.5 px-3 w-48 text-[11px]"
            />
            <button 
              onClick={handleExportLogs}
              className="p-2 rounded bg-[var(--color-v-black-3)] hover:bg-[var(--color-v-black-4)] border border-[rgba(255,255,255,0.04)] text-[var(--color-v-gray-300)] flex items-center justify-center gap-1 text-[10px] font-bold"
              title="Exportar bitácora en JSON"
            >
              <Download size={12} />
              <span>JSON</span>
            </button>
            <button 
              onClick={() => {
                if (window.confirm('¿Seguro que deseas vaciar el historial de auditoría?')) {
                  clearAuditLogs();
                  toast.success('Bitácora vaciada.');
                }
              }}
              className="p-2 rounded bg-[rgba(255,23,68,0.05)] hover:bg-[rgba(255,23,68,0.1)] border border-[rgba(255,23,68,0.1)] text-[var(--color-v-red)] flex items-center justify-center gap-1 text-[10px] font-bold cursor-pointer"
              title="Limpiar historial"
            >
              <Trash2 size={12} />
              <span>Vaciar</span>
            </button>
          </div>
        </div>

        {/* Listado de Logs */}
        <div className="overflow-x-auto max-h-[300px] scrollbar-none pr-1">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-[var(--color-v-black-3)] text-[var(--color-v-gray-500)] sticky top-0">
              <tr>
                <th className="px-4 py-2 font-bold uppercase tracking-wider">Fecha / Hora</th>
                <th className="px-4 py-2 font-bold uppercase tracking-wider">Operación / Acción</th>
                <th className="px-4 py-2 font-bold uppercase tracking-wider">Detalles Técnicos del Evento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.02)] text-[var(--color-v-gray-300)] font-mono text-[10px]">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-[var(--color-v-black-3)]/30 transition-colors">
                  <td className="px-4 py-2 text-[var(--color-v-gray-500)]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-1.5 py-0.5 rounded font-black ${
                      log.action.includes('PROYECTO') ? 'bg-[rgba(68,138,255,0.08)] text-[var(--color-v-blue)]' :
                      log.action.includes('MODULO') ? 'bg-[rgba(179,136,255,0.08)] text-[var(--color-v-purple)]' :
                      log.action.includes('AUDITORIA') ? 'bg-[rgba(255,23,68,0.08)] text-[var(--color-v-red)]' :
                      'bg-[rgba(0,230,118,0.08)] text-[var(--color-v-green)]'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-2 max-w-xs sm:max-w-md truncate" title={log.details}>
                    {log.details}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-[var(--color-v-gray-500)] italic">
                    Sin registros cargados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
