/**
 * RoomActionsModal — Diálogo inmersivo de gestión de habitación
 */
import { X, UserPlus, LogOut, Brush, Settings, Info, ChevronRight } from 'lucide-react';
import { useHabitaciones } from '../hooks/useHabitaciones';
import toast from 'react-hot-toast';

export default function RoomActionsModal({ habitacion, reserva, onCheckin, onCheckout, onClose }) {
  const { updateEstado } = useHabitaciones();

  const handleStatus = async (nuevoEstado) => {
    try {
      await updateEstado(habitacion.id, nuevoEstado);
      toast.success(`Habitación ${nuevoEstado}`);
      onClose();
    } catch {
      toast.error('Error al actualizar');
    }
  };

  const isOccupied = habitacion.estado === 'ocupada' || habitacion.estado === 'checkin';

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="v-card w-full max-w-lg animate-scale-in border-[rgba(255,255,255,0.08)] shadow-[0_0_100px_rgba(0,0,0,0.8)]">
        {/* Header */}
        <header className="relative h-32 overflow-hidden rounded-t-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-v-black-3)] to-[var(--color-v-black)]" />
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Habitación {habitacion.numero}</h2>
                <p className="text-[10px] font-bold text-[var(--color-v-gray-400)] uppercase tracking-[0.3em]">{habitacion.tipo}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                habitacion.estado === 'disponible' ? 'bg-[rgba(0,230,118,0.1)] text-[var(--color-v-green)]' :
                habitacion.estado === 'ocupada' ? 'bg-[rgba(255,171,0,0.1)] text-[var(--color-v-amber)]' :
                'bg-[rgba(68,138,255,0.1)] text-[var(--color-v-blue)]'
              }`}>
                {habitacion.estado}
              </div>
            </div>
          </div>
          
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white/60 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </header>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Main Actions */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-[var(--color-v-gray-500)] uppercase tracking-widest ml-1">Operaciones</p>
            
            {!isOccupied ? (
              <button 
                onClick={() => { onCheckin(habitacion); onClose(); }}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-[rgba(0,230,118,0.05)] border border-[rgba(0,230,118,0.1)] hover:bg-[rgba(0,230,118,0.1)] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[rgba(0,230,118,0.1)] text-[var(--color-v-green)]">
                    <UserPlus size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white">Registrar Check-in</p>
                    <p className="text-[9px] text-[var(--color-v-gray-500)]">Asignar huésped ahora</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-[var(--color-v-gray-600)] group-hover:text-[var(--color-v-green)] transition-colors" />
              </button>
            ) : (
              <button 
                onClick={() => { onCheckout(reserva); onClose(); }}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-[rgba(255,171,0,0.05)] border border-[rgba(255,171,0,0.1)] hover:bg-[rgba(255,171,0,0.1)] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[rgba(255,171,0,0.1)] text-[var(--color-v-amber)]">
                    <LogOut size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white">Realizar Check-out</p>
                    <p className="text-[9px] text-[var(--color-v-gray-500)]">Finalizar estancia y cobro</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-[var(--color-v-gray-600)] group-hover:text-[var(--color-v-amber)] transition-colors" />
              </button>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => handleStatus('limpieza')} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.04)] transition-all">
                <Brush size={16} className="text-[var(--color-v-purple)]" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Limpieza</span>
              </button>
              <button onClick={() => handleStatus('mantenimiento')} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.04)] transition-all">
                <Settings size={16} className="text-[var(--color-v-red)]" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Mantenimiento</span>
              </button>
            </div>
          </div>

          {/* Details / Info */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-[var(--color-v-gray-500)] uppercase tracking-widest ml-1">Estado Actual</p>
            
            <div className="p-5 rounded-xl bg-[rgba(255,255,255,0.01)] border border-[rgba(255,255,255,0.03)] h-[calc(100%-1.5rem)]">
              {reserva ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-[9px] text-[var(--color-v-gray-500)] uppercase font-bold tracking-widest mb-1">Huésped</p>
                    <p className="text-sm font-bold text-white">{reserva.cliente?.nombre_completo}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] text-[var(--color-v-gray-500)] uppercase font-bold tracking-widest mb-1">Entrada</p>
                      <p className="text-xs text-[var(--color-v-gray-200)]">{reserva.fecha_ingreso}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-[var(--color-v-gray-500)] uppercase font-bold tracking-widest mb-1">Salida</p>
                      <p className="text-xs text-[var(--color-v-gray-200)]">{reserva.fecha_salida}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/5">
                    <p className="text-[9px] text-[var(--color-v-gray-500)] uppercase font-bold tracking-widest mb-1">DNI/ID</p>
                    <p className="text-xs text-[var(--color-v-gray-200)]">{reserva.cliente?.documento_id}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-4">
                  <Info size={24} className="text-[var(--color-v-gray-600)] mb-2" />
                  <p className="text-[10px] text-[var(--color-v-gray-500)] font-medium">Habitación lista para recibir nuevos huéspedes.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
