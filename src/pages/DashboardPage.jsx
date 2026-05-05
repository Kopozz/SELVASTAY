/**
 * DashboardPage — VALVE Edition
 * Bento grid, zero emojis, Lucide icons, green/black/white palette
 */
import { useState, useMemo } from 'react';
import { Plus, QrCode, Users, CheckCircle2, Clock, TrendingUp, Map as MapIcon, LayoutGrid, ArrowUpRight } from 'lucide-react';
import { useHabitaciones } from '../hooks/useHabitaciones';
import { useReservas } from '../hooks/useReservas';
import HabitacionCard from '../components/HabitacionCard';
import LodgeMap from '../components/LodgeMap';
import WeatherWidget from '../components/WeatherWidget';
import CarbonFootprint from '../components/CarbonFootprint';
import QRCheckin from '../components/QRCheckin';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { habitaciones, updateEstado } = useHabitaciones();
  const { reservas } = useReservas();
  const [viewMode, setViewMode] = useState('map');
  const [showQR, setShowQR] = useState(false);

  const handleNuevoCheckin = () => {
    setViewMode('map');

    toast('Seleccione una habitación libre en el mapa', {
      icon: '🏨',
      style: { background: '#111', color: '#fff', fontSize: '12px', border: '1px solid #222' }
    });
  };

  const stats = useMemo(() => {
    const total = habitaciones.length;
    const disponibles = habitaciones.filter(h => h.estado === 'disponible').length;
    const ocupadas = habitaciones.filter(h => h.estado === 'ocupada').length;
    const reservadas = habitaciones.filter(h => h.estado === 'reservada').length;
    const ocupacion = total > 0 ? Math.round((ocupadas / total) * 100) : 0;
    const ingresoDia = habitaciones.filter(h => ['ocupada','reservada'].includes(h.estado)).reduce((s, h) => s + Number(h.precio_noche || 0), 0);
    return { total, disponibles, ocupadas, reservadas, ocupacion, ingresoDia };
  }, [habitaciones]);

  const handleStatusChange = async (id, nuevoEstado) => {
    try {
      await updateEstado(id, nuevoEstado);
    } catch (err) {
      console.error('Error actualizando estado:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-v-white)] tracking-tight">Dashboard</h1>
          <p className="text-[var(--color-v-gray-400)] text-sm mt-1">Ocupación y estado del eco-lodge en tiempo real.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowQR(true)} className="btn-secondary flex items-center gap-2">
            <QrCode size={16} />
            <span>Check-in QR</span>
          </button>
          <button 
            onClick={handleNuevoCheckin}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Nuevo Check-in</span>
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="v-stat p-5 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:scale-110 transition-transform">
            <CheckCircle2 size={64} className="text-[var(--color-v-green)]" />
          </div>
          <div className="w-12 h-12 rounded-xl bg-[rgba(0,230,118,0.1)] flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={22} className="text-[var(--color-v-green)]" />
          </div>
          <div>
            <p className="text-[var(--color-v-gray-400)] text-[10px] font-bold uppercase tracking-widest">Disponibles</p>
            <h3 className="text-2xl font-black text-[var(--color-v-white)] mt-1 animate-counter">{stats.disponibles}</h3>
          </div>
        </div>

        <div className="v-stat p-5 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:scale-110 transition-transform">
            <Users size={64} className="text-[var(--color-v-amber)]" />
          </div>
          <div className="w-12 h-12 rounded-xl bg-[rgba(255,171,0,0.1)] flex items-center justify-center flex-shrink-0">
            <Users size={22} className="text-[var(--color-v-amber)]" />
          </div>
          <div>
            <p className="text-[var(--color-v-gray-400)] text-[10px] font-bold uppercase tracking-widest">Ocupadas</p>
            <h3 className="text-2xl font-black text-[var(--color-v-white)] mt-1 animate-counter">{stats.ocupadas}</h3>
          </div>
        </div>

        <div className="v-stat p-5 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:scale-110 transition-transform">
            <Clock size={64} className="text-[var(--color-v-blue)]" />
          </div>
          <div className="w-12 h-12 rounded-xl bg-[rgba(68,138,255,0.1)] flex items-center justify-center flex-shrink-0">
            <Clock size={22} className="text-[var(--color-v-blue)]" />
          </div>
          <div>
            <p className="text-[var(--color-v-gray-400)] text-[10px] font-bold uppercase tracking-widest">Reservadas</p>
            <h3 className="text-2xl font-black text-[var(--color-v-white)] mt-1 animate-counter">{stats.reservadas}</h3>
          </div>
        </div>

        <div className="v-stat p-5 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:scale-110 transition-transform">
            <TrendingUp size={64} className="text-[var(--color-v-green)]" />
          </div>
          <div className="w-12 h-12 rounded-xl bg-[rgba(0,230,118,0.06)] flex items-center justify-center flex-shrink-0">
            <TrendingUp size={22} className="text-[var(--color-v-green)]" />
          </div>
          <div>
            <p className="text-[var(--color-v-gray-400)] text-[10px] font-bold uppercase tracking-widest">Ocupación</p>
            <h3 className="text-2xl font-black text-[var(--color-v-white)] mt-1 animate-counter">{stats.ocupacion}%</h3>
          </div>
        </div>
      </div>

      {/* Main Content: Map/Grid + Sidebar Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Distribution */}
          <div className="v-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-bold text-[var(--color-v-white)] uppercase tracking-widest">Estado de Inventario</h3>
                <p className="text-[9px] text-[var(--color-v-gray-500)] font-medium mt-0.5">Control de habitaciones sobre {stats.total} unidades</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-v-green)]" />
                  <span className="text-[10px] text-[var(--color-v-gray-400)] font-medium">Libre</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-v-amber)]" />
                  <span className="text-[10px] text-[var(--color-v-gray-400)] font-medium">Ocupada</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-v-blue)]" />
                  <span className="text-[10px] text-[var(--color-v-gray-400)] font-medium">Reserva</span>
                </div>
              </div>
            </div>
            <div className="flex h-3 rounded-full overflow-hidden bg-[var(--color-v-black-4)] p-0.5 border border-[rgba(255,255,255,0.02)]">
              {stats.disponibles > 0 && <div className="bg-[var(--color-v-green)] rounded-full mr-0.5 transition-all duration-1000 shadow-[0_0_10px_rgba(0,230,118,0.3)]" style={{ width: `${(stats.disponibles / stats.total) * 100}%` }} />}
              {stats.ocupadas > 0 && <div className="bg-[var(--color-v-amber)] rounded-full mr-0.5 transition-all duration-1000" style={{ width: `${(stats.ocupadas / stats.total) * 100}%` }} />}
              {stats.reservadas > 0 && <div className="bg-[var(--color-v-blue)] rounded-full transition-all duration-1000" style={{ width: `${(stats.reservadas / stats.total) * 100}%` }} />}
            </div>
          </div>

          {/* Map or Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[var(--color-v-white)] uppercase tracking-widest flex items-center gap-2">
                <MapIcon size={14} className="text-[var(--color-v-green)]" />
                Vista Operativa
              </h2>
              <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--color-v-black-3)]">
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded-md transition-all text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    viewMode === 'map'
                      ? 'bg-[var(--color-v-green)] text-black shadow-[0_0_15px_rgba(0,230,118,0.2)]'
                      : 'text-[var(--color-v-gray-400)] hover:text-[var(--color-v-white)]'
                  }`}
                >
                  <MapIcon size={11} /> Mapa
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    viewMode === 'grid'
                      ? 'bg-[var(--color-v-green)] text-black shadow-[0_0_15px_rgba(0,230,118,0.2)]'
                      : 'text-[var(--color-v-gray-400)] hover:text-[var(--color-v-white)]'
                  }`}
                >
                  <LayoutGrid size={11} /> Grid
                </button>
              </div>
            </div>

            <div className="v-card overflow-hidden border-[rgba(255,255,255,0.06)] shadow-xl">
              {viewMode === 'map' ? (
                <LodgeMap />
              ) : (
                <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                  {habitaciones.map((h) => (
                    <HabitacionCard 
                      key={h.id} 
                      habitacion={h} 
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Revenue Card */}
          <div className="v-card p-6 relative overflow-hidden group border-[rgba(0,230,118,0.1)]">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <TrendingUp size={80} className="text-[var(--color-v-green)]" />
            </div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-md bg-[rgba(0,230,118,0.1)] text-[var(--color-v-green)]">
                <ArrowUpRight size={14} />
              </div>
              <span className="text-[10px] font-bold text-[var(--color-v-gray-400)] uppercase tracking-[0.2em]">
                Ingreso Hoy
              </span>
            </div>
            <div className="text-4xl font-black text-[var(--color-v-white)] tracking-tighter">
              <span className="text-sm mr-1 font-bold text-[var(--color-v-gray-500)]">S/</span>
              {stats.ingresoDia.toLocaleString()}
            </div>
            <p className="text-[10px] text-[var(--color-v-gray-500)] font-medium mt-3 border-t border-[rgba(255,255,255,0.04)] pt-3">
              {stats.ocupadas + stats.reservadas} habitaciones activas
            </p>
          </div>

          <WeatherWidget />
          <CarbonFootprint reservas={reservas} />
        </div>
      </div>

      {/* QR Modal */}
      {showQR && <QRCheckin onClose={() => setShowQR(false)} />}
    </div>
  );
}
