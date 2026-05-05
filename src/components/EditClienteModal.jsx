/**
 * EditClienteModal — Modal para editar datos del huésped
 */
import { useState } from 'react';
import { X, Save, User, Mail, Phone, Globe, CreditCard } from 'lucide-react';

export default function EditClienteModal({ cliente, onClose, onSave }) {
  const [formData, setFormData] = useState({ ...cliente });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[rgba(0,0,0,0.8)] backdrop-blur-sm animate-fade-in">
      <div className="v-card w-full max-w-md overflow-hidden animate-slide-up">
        <header className="px-6 py-4 border-b border-[rgba(255,255,255,0.04)] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[var(--color-v-white)] uppercase tracking-widest flex items-center gap-2">
            <User size={14} className="text-[var(--color-v-green)]" />
            Editar Huésped
          </h2>
          <button onClick={onClose} className="text-[var(--color-v-gray-500)] hover:text-[var(--color-v-white)] transition-colors">
            <X size={18} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[var(--color-v-gray-500)] uppercase tracking-wider ml-1">Nombre Completo</label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-v-gray-600)]" />
              <input
                type="text"
                required
                value={formData.nombre_completo || ''}
                onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
                className="input-field pl-10 w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--color-v-gray-500)] uppercase tracking-wider ml-1">Documento</label>
              <div className="relative">
                <CreditCard size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-v-gray-600)]" />
                <input
                  type="text"
                  value={formData.documento_id || ''}
                  onChange={(e) => setFormData({ ...formData, documento_id: e.target.value })}
                  className="input-field pl-10 w-full"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--color-v-gray-500)] uppercase tracking-wider ml-1">Nacionalidad</label>
              <div className="relative">
                <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-v-gray-600)]" />
                <input
                  type="text"
                  value={formData.nacionalidad || ''}
                  onChange={(e) => setFormData({ ...formData, nacionalidad: e.target.value })}
                  className="input-field pl-10 w-full"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[var(--color-v-gray-500)] uppercase tracking-wider ml-1">Email</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-v-gray-600)]" />
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field pl-10 w-full"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[var(--color-v-gray-500)] uppercase tracking-wider ml-1">Teléfono</label>
            <div className="relative">
              <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-v-gray-600)]" />
              <input
                type="text"
                value={formData.telefono || ''}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="input-field pl-10 w-full"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {saving ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
              <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
