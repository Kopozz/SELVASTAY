/**
 * ServiciosPage — Gestión de servicios adicionales y consumos
 */
import { useState } from 'react';
import { Utensils, Mountain, Car, Coffee, Plus, Tag, DollarSign } from 'lucide-react';
import { useReservas } from '../hooks/useReservas';
import { demoServicios } from '../lib/demoData';


const serviceIcons = {
  restaurante: Utensils,
  tour: Mountain,
  transporte: Car,
  bar: Coffee,
  otros: Tag,
};

export default function ServiciosPage() {
  const { reservas } = useReservas();
  const [servicios] = useState(demoServicios);
  const [activeTab, setActiveTab] = useState('all');

  const filteredServicios = activeTab === 'all' 
    ? servicios 
    : servicios.filter(s => s.tipo === activeTab);

  const getReservaNombre = (id) => {
    const res = reservas.find(r => r.id === id);
    return res?.cliente?.nombre_completo || 'Reserva #' + id.slice(0, 4);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-v-white)] tracking-tight">Servicios Extra</h1>
          <p className="text-[var(--color-v-gray-400)] text-sm mt-1">Consumos adicionales, tours y servicios de bar.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          <span>Registrar Consumo</span>
        </button>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {['all', 'restaurante', 'tour', 'transporte', 'bar'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-[var(--color-v-green)] text-black'
                : 'bg-[var(--color-v-black-3)] text-[var(--color-v-gray-400)] hover:text-[var(--color-v-white)]'
            }`}
          >
            {tab === 'all' ? 'Todos' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="v-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[var(--color-v-black-3)] text-[var(--color-v-gray-400)]">
                  <tr>
                    <th className="px-5 py-3 font-medium">Servicio</th>
                    <th className="px-5 py-3 font-medium">Huésped</th>
                    <th className="px-5 py-3 font-medium text-right">Monto</th>
                    <th className="px-5 py-3 font-medium text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.02)] text-[var(--color-v-gray-200)]">
                  {filteredServicios.map((s) => {
                    const Icon = serviceIcons[s.tipo] || Tag;
                    return (
                      <tr key={s.id} className="hover:bg-[var(--color-v-black-3)] transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[var(--color-v-black-4)] flex items-center justify-center text-[var(--color-v-green)]">
                              <Icon size={14} />
                            </div>
                            <div>
                              <p className="font-medium text-[var(--color-v-white)]">{s.descripcion}</p>
                              <p className="text-[10px] text-[var(--color-v-gray-500)] uppercase tracking-wider">{s.tipo}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-[var(--color-v-gray-400)]">
                          {getReservaNombre(s.reserva_id)}
                        </td>
                        <td className="px-5 py-4 text-right font-bold text-[var(--color-v-white)]">
                          S/{s.monto.toFixed(2)}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className="px-2 py-1 text-[9px] font-bold bg-[rgba(0,230,118,0.1)] text-[var(--color-v-green)] rounded uppercase">
                            Cargado
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Summary side box */}
        <div className="space-y-4">
          <div className="v-card p-5">
            <h3 className="text-sm font-semibold text-[var(--color-v-white)] uppercase tracking-widest mb-4">Resumen Diario</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[var(--color-v-gray-400)]">Total hoy</span>
                <span className="text-lg font-bold text-[var(--color-v-green)]">S/200.00</span>
              </div>
              <div className="h-px bg-[rgba(255,255,255,0.04)]" />
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase tracking-wider text-[var(--color-v-gray-500)]">
                  <span>Por categoría</span>
                  <span>Monto</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--color-v-gray-400)]">Restaurante</span>
                  <span className="text-[var(--color-v-white)]">S/120.00</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--color-v-gray-400)]">Tours</span>
                  <span className="text-[var(--color-v-white)]">S/80.00</span>
                </div>
              </div>
            </div>
          </div>

          <div className="v-card p-5 bg-gradient-to-br from-[var(--color-v-black-2)] to-[var(--color-v-black-4)] border-[rgba(0,230,118,0.1)]">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign size={16} className="text-[var(--color-v-green)]" />
              <h3 className="text-xs font-bold text-[var(--color-v-white)] uppercase tracking-widest">Pago Pendiente</h3>
            </div>
            <p className="text-xs text-[var(--color-v-gray-400)] mb-4">Total de servicios por cobrar a huéspedes actualmente alojados.</p>
            <div className="text-2xl font-bold text-[var(--color-v-white)] mb-1">S/450.50</div>
            <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-v-green)] font-semibold uppercase">
              <Plus size={10} /> 12% vs ayer
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
