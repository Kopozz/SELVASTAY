import { useState, useMemo } from 'react';
import { Users, Search, Plus, FileText, Mail, Phone, Globe, Edit2 } from 'lucide-react';
import { useClientes } from '../hooks/useClientes';

import EditClienteModal from '../components/EditClienteModal';
import toast from 'react-hot-toast';

export default function ClientesPage() {
  const { clientes, loading, updateCliente } = useClientes();
  const [search, setSearch] = useState('');
  const [editingCliente, setEditingCliente] = useState(null);


  const handleUpdateCliente = async (formData) => {
    const { id, ...updateData } = formData;
    try {
      await updateCliente(id, updateData);
      toast.success('Huésped actualizado correctamente');
    } catch (err) {
      toast.error('No se pudo actualizar el huésped');
      throw err;
    }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return clientes;
    const q = search.toLowerCase();
    return clientes.filter(c =>
      (c.nombre_completo || '').toLowerCase().includes(q) ||
      (c.documento_id || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q)
    );
  }, [clientes, search]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-v-white)] tracking-tight">Huéspedes</h1>
          <p className="text-[var(--color-v-gray-400)] text-sm mt-1">Directorio de clientes y visitantes.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-v-gray-400)]" />
            <input
              type="text"
              placeholder="Buscar por nombre, DNI..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 w-64"
            />
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            <span>Nuevo Huésped</span>
          </button>
        </div>
      </header>

      {loading ? (
        <div className="p-12 text-center">
          <div className="w-5 h-5 border-2 border-[var(--color-v-green)] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div key={c.id} className="v-card p-5 group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--color-v-black-3)] flex items-center justify-center text-[var(--color-v-green)] border border-[rgba(255,255,255,0.04)] group-hover:border-[rgba(0,230,118,0.2)] transition-colors">
                  <Users size={20} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-[var(--color-v-gray-500)] uppercase tracking-widest">{c.tipo_doc || 'DNI'}</span>
                  <span className="text-sm font-semibold text-[var(--color-v-gray-200)]">{c.documento_id}</span>
                </div>
              </div>
              
              <h3 className="text-base font-bold text-[var(--color-v-white)] mb-4">{c.nombre_completo}</h3>
              
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 text-xs text-[var(--color-v-gray-400)]">
                  <Mail size={13} className="text-[var(--color-v-gray-500)]" />
                  <span className="truncate">{c.email || 'Sin email'}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[var(--color-v-gray-400)]">
                  <Phone size={13} className="text-[var(--color-v-gray-500)]" />
                  <span>{c.telefono || 'Sin teléfono'}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[var(--color-v-gray-400)]">
                  <Globe size={13} className="text-[var(--color-v-gray-500)]" />
                  <span>{c.nacionalidad || 'Nacionalidad no especificada'}</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[rgba(255,255,255,0.04)] flex justify-between items-center">
                <button 
                  onClick={() => setEditingCliente(c)}
                  className="text-[var(--color-v-gray-400)] hover:text-[var(--color-v-white)] text-xs flex items-center gap-1 transition-colors"
                >
                  <Edit2 size={12} /> Editar
                </button>
                <button className="text-[var(--color-v-green)] text-xs font-medium hover:underline flex items-center gap-1">
                  <FileText size={12} /> Ver historial
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full p-12 v-card text-center text-[var(--color-v-gray-500)] italic">
              No se encontraron huéspedes que coincidan con la búsqueda.
            </div>
          )}
        </div>
      )}

      {editingCliente && (
        <EditClienteModal 
          cliente={editingCliente} 
          onClose={() => setEditingCliente(null)} 
          onSave={handleUpdateCliente}
        />
      )}
    </div>
  );
}
