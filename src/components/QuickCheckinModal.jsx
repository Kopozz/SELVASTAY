/**
 * QuickCheckinModal — Registro rápido de huésped desde el Mapa
 */
import { useState } from 'react';
import { X, UserPlus, Fingerprint, Phone, Mail, Globe, CheckCircle2 } from 'lucide-react';
import { useReservas } from '../hooks/useReservas';
import toast from 'react-hot-toast';

export default function QuickCheckinModal({ habitacion, onClose }) {
  const { createReservaConCheckin } = useReservas();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre_completo: '',
    tipo_doc: 'DNI',
    documento_id: '',
    telefono: '',
    email: '',
    nacionalidad: 'Peruana'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const reservaData = {
        habitacion_id: habitacion.id,
        fecha_ingreso: new Date().toISOString().split('T')[0],
        fecha_salida: new Date(Date.now() + 86400000).toISOString().split('T')[0], // +1 día por defecto
        num_huespedes: 1,
        total_precio: habitacion.precio_noche,
        notas: 'Registro rápido desde Mapa'
      };

      await createReservaConCheckin(formData, reservaData);
      toast.success('Huésped registrado y habitación ocupada');
      onClose();
    } catch (err) {
      toast.error('Error al registrar huésped');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
      <div className="v-card w-full max-w-md animate-scale-in border-[rgba(0,230,118,0.3)] shadow-[0_0_80px_rgba(0,230,118,0.1)]">
        {/* Header */}
        <header className="px-6 py-5 border-b border-[rgba(255,255,255,0.04)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[rgba(0,230,118,0.1)] text-[var(--color-v-green)]">
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-widest">Check-in Rápido</h2>
              <p className="text-[10px] text-[var(--color-v-gray-500)] font-bold">HABITACIÓN {habitacion.numero} — {habitacion.tipo.toUpperCase()}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[var(--color-v-gray-500)] hover:text-white transition-colors">
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--color-v-gray-500)] uppercase tracking-wider ml-1">Nombre Completo</label>
              <input
                required
                type="text"
                placeholder="Ej. Juan Perez"
                value={formData.nombre_completo}
                onChange={(e) => setFormData({...formData, nombre_completo: e.target.value})}
                className="input-field"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--color-v-gray-500)] uppercase tracking-wider ml-1">Documento</label>
              <div className="relative">
                <Fingerprint size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-v-gray-500)]" />
                <input
                  required
                  type="text"
                  placeholder="ID / DNI"
                  value={formData.documento_id}
                  onChange={(e) => setFormData({...formData, documento_id: e.target.value})}
                  className="input-field pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--color-v-gray-500)] uppercase tracking-wider ml-1">Teléfono</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-v-gray-500)]" />
                <input
                  type="text"
                  placeholder="987..."
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  className="input-field pl-9"
                />
              </div>
            </div>

            <div className="col-span-2 space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--color-v-gray-500)] uppercase tracking-wider ml-1">Email (Opcional)</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-v-gray-500)]" />
                <input
                  type="email"
                  placeholder="huesped@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="input-field pl-9"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 mt-2 flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 size={18} />
                <span className="font-bold uppercase tracking-widest text-[11px]">Confirmar Entrada Inmediata</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
