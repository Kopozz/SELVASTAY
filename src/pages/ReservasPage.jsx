import { useState, useMemo } from 'react';
import { CalendarCheck, Search, UserCheck, Clock, XCircle, LogOut, AlertTriangle } from 'lucide-react';
import { useReservas } from '../hooks/useReservas';
import CheckoutModal from '../components/CheckoutModal';
import toast from 'react-hot-toast';

const estadoConfig = {
  pendiente:  { label: 'Pendiente',  badge: 'badge-ocupada',       icon: Clock },
  confirmada: { label: 'Confirmada', badge: 'badge-reservada',     icon: UserCheck },
  checkin:    { label: 'Check-in',   badge: 'badge-disponible',    icon: UserCheck },
  checkout:   { label: 'Check-out',  badge: 'badge-limpieza',      icon: LogOut },
  cancelada:  { label: 'Cancelada',  badge: 'badge-mantenimiento', icon: XCircle },
  noshow:     { label: 'No Show',    badge: 'badge-mantenimiento', icon: AlertTriangle },
};

export default function ReservasPage() {
  const { reservas, loading, updateEstadoReserva } = useReservas();
  const [search, setSearch] = useState('');
  const [checkoutReserva, setCheckoutReserva] = useState(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return reservas;
    const q = search.toLowerCase();
    return reservas.filter(r =>
      (r.cliente?.nombre_completo || '').toLowerCase().includes(q) ||
      (r.habitacion?.numero || '').toLowerCase().includes(q) ||
      (r.estado || '').toLowerCase().includes(q)
    );
  }, [reservas, search]);

  const handleEstado = async (id, estado) => {
    try {
      await updateEstadoReserva(id, estado);
      if (estado !== 'checkout') toast.success(`Estado actualizado a ${estado}`);
    } catch {
      toast.error('Error al actualizar');
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-v-white)] tracking-tight">Reservas</h1>
          <p className="text-[var(--color-v-gray-400)] text-sm mt-1">Gestión de reservas y estados.</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-v-gray-400)]" />
          <input
            type="text"
            placeholder="Buscar por huésped, habitación..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 w-72"
          />
        </div>
      </header>

      <div className="v-card">
        <div className="p-5 border-b border-[rgba(255,255,255,0.04)] flex items-center gap-2">
          <CalendarCheck size={16} className="text-[var(--color-v-green)]" />
          <h3 className="font-semibold text-[var(--color-v-white)] text-sm">{filtered.length} reservas</h3>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-5 h-5 border-2 border-[var(--color-v-green)] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-[var(--color-v-gray-400)] text-sm">Sin reservas encontradas</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[var(--color-v-black-3)] text-[var(--color-v-gray-400)]">
                <tr>
                  <th className="px-5 py-3 font-medium">Huésped</th>
                  <th className="px-5 py-3 font-medium">Habitación</th>
                  <th className="px-5 py-3 font-medium">Ingreso</th>
                  <th className="px-5 py-3 font-medium">Salida</th>
                  <th className="px-5 py-3 font-medium">Estado</th>
                  <th className="px-5 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.02)] text-[var(--color-v-gray-200)]">
                {filtered.map((r) => {
                  const config = estadoConfig[r.estado] || estadoConfig.pendiente;
                  return (
                    <tr key={r.id} className="hover:bg-[var(--color-v-black-3)] transition-colors">
                      <td className="px-5 py-4 font-medium text-[var(--color-v-white)]">
                        {r.cliente?.nombre_completo || 'Sin nombre'}
                      </td>
                      <td className="px-5 py-4">{r.habitacion?.numero || '—'}</td>
                      <td className="px-5 py-4">{r.fecha_ingreso || '—'}</td>
                      <td className="px-5 py-4">{r.fecha_salida || '—'}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold ${config.badge}`}>
                          {config.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {r.estado === 'confirmada' && (
                          <button onClick={() => handleEstado(r.id, 'checkin')} className="text-[var(--color-v-green)] text-xs font-medium hover:underline">
                            Check-in
                          </button>
                        )}
                        {r.estado === 'checkin' && (
                          <button 
                            onClick={() => setCheckoutReserva(r)} 
                            className="text-[var(--color-v-amber)] text-xs font-medium hover:underline flex items-center gap-1 ml-auto"
                          >
                            <LogOut size={12} /> Check-out
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {checkoutReserva && (
        <CheckoutModal 
          reserva={checkoutReserva} 
          onClose={() => setCheckoutReserva(null)} 
          onConfirm={handleEstado}
        />
      )}
    </div>
  );
}
