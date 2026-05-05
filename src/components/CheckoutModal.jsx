/**
 * CheckoutModal — Resumen de cuenta y confirmación de salida
 */
import { useState, useEffect } from 'react';
import { X, Receipt, LogOut, Coffee, Calendar, Home, DollarSign, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useConnectivity } from '../hooks/useConnectivity';
import { demoServicios } from '../lib/demoData';
import toast from 'react-hot-toast';

export default function CheckoutModal({ reserva, onClose, onConfirm }) {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isFullyConnected } = useConnectivity();

  useEffect(() => {
    const fetchServicios = async () => {
      if (!isFullyConnected) {
        setServicios(demoServicios.filter(s => s.reserva_id === reserva.id));
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('servicios_extra')
          .select('*')
          .eq('reserva_id', reserva.id);

        if (error) throw error;
        setServicios(data || []);
      } catch (err) {
        console.error(err);
        setServicios([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServicios();
  }, [reserva.id, isFullyConnected]);

  const subtotalHabitacion = Number(reserva.total_precio || 0);
  const subtotalServicios = servicios.reduce((acc, s) => acc + (Number(s.monto) * Number(s.cantidad)), 0);
  const totalFinal = subtotalHabitacion + subtotalServicios;

  const handleConfirm = async () => {
    try {
      await onConfirm(reserva.id, 'checkout');
      toast.success('Check-out completado con éxito');
      onClose();
    } catch (err) {
      toast.error('Error al procesar el check-out');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[rgba(0,0,0,0.85)] backdrop-blur-md animate-fade-in">
      <div className="v-card w-full max-w-xl overflow-hidden animate-scale-in border-[rgba(255,255,255,0.08)] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <header className="px-6 py-5 border-b border-[rgba(255,255,255,0.04)] flex items-center justify-between bg-[var(--color-v-black-3)]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[rgba(255,171,0,0.1)] text-[var(--color-v-amber)]">
              <Receipt size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--color-v-white)] uppercase tracking-widest">Resumen de Cuenta</h2>
              <p className="text-[10px] text-[var(--color-v-gray-500)] font-medium">RES-{reserva.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[var(--color-v-gray-500)] hover:text-[var(--color-v-white)] transition-colors p-1">
            <X size={20} />
          </button>
        </header>

        <div className="p-0 max-h-[70vh] overflow-y-auto">
          {/* Guest Info */}
          <div className="p-6 grid grid-cols-2 gap-8 border-b border-[rgba(255,255,255,0.02)]">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Home size={14} className="text-[var(--color-v-gray-500)] mt-1" />
                <div>
                  <p className="text-[10px] text-[var(--color-v-gray-500)] uppercase font-bold tracking-wider">Alojamiento</p>
                  <p className="text-sm text-[var(--color-v-white)] font-medium mt-0.5">Habitación {reserva.habitacion?.numero}</p>
                  <p className="text-[10px] text-[var(--color-v-gray-400)] capitalize">{reserva.habitacion?.tipo}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar size={14} className="text-[var(--color-v-gray-500)] mt-1" />
                <div>
                  <p className="text-[10px] text-[var(--color-v-gray-500)] uppercase font-bold tracking-wider">Estadía</p>
                  <p className="text-xs text-[var(--color-v-white)] mt-1">{reserva.fecha_ingreso} al {reserva.fecha_salida}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Receipt size={14} className="text-[var(--color-v-gray-500)] mt-1" />
                <div>
                  <p className="text-[10px] text-[var(--color-v-gray-500)] uppercase font-bold tracking-wider">Titular</p>
                  <p className="text-sm text-[var(--color-v-white)] font-medium mt-0.5">{reserva.cliente?.nombre_completo}</p>
                  <p className="text-[10px] text-[var(--color-v-gray-400)]">{reserva.cliente?.documento_id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="p-6 space-y-4">
            <h3 className="text-[10px] font-black text-[var(--color-v-gray-500)] uppercase tracking-[0.2em] mb-4">Desglose de Cargos</h3>
            
            <div className="space-y-3">
              {/* Habitacion */}
              <div className="flex justify-between items-center text-sm group">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-v-blue)]" />
                  <span className="text-[var(--color-v-gray-300)]">Cargos por Alojamiento</span>
                </div>
                <span className="font-mono text-[var(--color-v-white)]">S/{subtotalHabitacion.toFixed(2)}</span>
              </div>

              {/* Servicios Extra */}
              {loading ? (
                <div className="h-10 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-[var(--color-v-green)] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : servicios.length > 0 ? (
                <div className="space-y-2 pt-2 border-t border-[rgba(255,255,255,0.04)]">
                  {servicios.map((s) => (
                    <div key={s.id} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-3 pl-4">
                        <Coffee size={12} className="text-[var(--color-v-gray-600)]" />
                        <span className="text-[var(--color-v-gray-400)]">{s.descripcion} (x{s.cantidad})</span>
                      </div>
                      <span className="font-mono text-[var(--color-v-gray-200)]">S/{(s.monto * s.cantidad).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[10px] text-[var(--color-v-gray-600)] italic pl-4">No se registraron consumos adicionales.</div>
              )}
            </div>
          </div>

          {/* Totals Section */}
          <div className="px-6 py-6 bg-[rgba(255,255,255,0.01)] border-t border-[rgba(255,255,255,0.04)] mt-4">
            <div className="flex flex-col items-end gap-2">
              <div className="flex justify-between w-full max-w-[200px] text-[10px] text-[var(--color-v-gray-500)] font-bold uppercase tracking-widest">
                <span>Subtotal</span>
                <span>S/{totalFinal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-full max-w-[200px] text-[10px] text-[var(--color-v-gray-500)] font-bold uppercase tracking-widest">
                <span>IGV (18%)</span>
                <span>Incluido</span>
              </div>
              <div className="flex justify-between w-full max-w-[260px] items-center pt-2 mt-2 border-t border-[rgba(0,230,118,0.2)]">
                <span className="text-xs font-black text-[var(--color-v-white)] uppercase tracking-[0.2em]">Total a Pagar</span>
                <span className="text-2xl font-black text-[var(--color-v-green)] tracking-tighter">
                  <span className="text-sm mr-1">S/</span>
                  {totalFinal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <footer className="p-6 bg-[var(--color-v-black-3)] flex gap-4">
          <button
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            Volver
          </button>
          <button
            onClick={handleConfirm}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={16} />
            <span>Confirmar Pago y Salida</span>
          </button>
        </footer>
      </div>
    </div>
  );
}
