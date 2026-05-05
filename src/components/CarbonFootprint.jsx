/**
 * CarbonFootprint — VALVE Edition
 * Indicador de Huella de Carbono por estadía en el eco-lodge.
 * Recibe reservas via props.
 */
import { Leaf, TreePine, Droplets, Zap, Award } from 'lucide-react';

const CO2_PER_HOTEL = 30.9;
const CO2_PER_ECO = 8.2;
const WATER_PER_NIGHT = 120;
const ENERGY_PER_NIGHT = 15;

export default function CarbonFootprint({ reservas = [] }) {
  const totalNights = reservas.reduce((acc, r) => {
    if (!r.fecha_ingreso || !r.fecha_salida) return acc;
    const days = Math.ceil(
      (new Date(r.fecha_salida) - new Date(r.fecha_ingreso)) / (1000 * 60 * 60 * 24)
    );
    return acc + Math.max(days, 0);
  }, 0);

  const co2Saved = (totalNights * (CO2_PER_HOTEL - CO2_PER_ECO)).toFixed(1);
  const waterSaved = totalNights * WATER_PER_NIGHT;
  const energySaved = totalNights * ENERGY_PER_NIGHT;

  const ecoLevel =
    totalNights >= 30 ? { name: 'Guardián', color: 'text-[var(--color-v-green)]' } :
    totalNights >= 15 ? { name: 'Aventurero', color: 'text-[var(--color-v-blue)]' } :
    totalNights >= 5  ? { name: 'Explorador', color: 'text-[var(--color-v-amber)]' } :
                        { name: 'Iniciado', color: 'text-[var(--color-v-gray-300)]' };

  return (
    <div className="v-card">
      <div className="p-5 border-b border-[rgba(255,255,255,0.04)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf size={14} className="text-[var(--color-v-green)]" />
            <span className="text-xs font-semibold text-[var(--color-v-gray-400)] uppercase tracking-widest">
              Huella Ecológica
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award size={13} className={ecoLevel.color} />
            <span className={`text-xs font-bold ${ecoLevel.color}`}>{ecoLevel.name}</span>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* CO2 main stat */}
        <div className="text-center py-2">
          <div className="text-3xl font-bold text-[var(--color-v-green)] tracking-tight">
            {co2Saved} kg
          </div>
          <p className="text-xs text-[var(--color-v-gray-400)] mt-1">
            CO2 ahorrado vs hotel convencional
          </p>
        </div>

        {/* Detail metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-xl bg-[var(--color-v-black-3)]">
            <TreePine size={16} className="text-[var(--color-v-green)] mx-auto mb-1.5" />
            <div className="text-sm font-bold text-[var(--color-v-white)]">
              {(Number(co2Saved) / 21).toFixed(1)}
            </div>
            <p className="text-[9px] text-[var(--color-v-gray-400)] uppercase tracking-wider mt-0.5">
              Árboles equiv.
            </p>
          </div>

          <div className="text-center p-3 rounded-xl bg-[var(--color-v-black-3)]">
            <Droplets size={16} className="text-[var(--color-v-blue)] mx-auto mb-1.5" />
            <div className="text-sm font-bold text-[var(--color-v-white)]">
              {waterSaved}L
            </div>
            <p className="text-[9px] text-[var(--color-v-gray-400)] uppercase tracking-wider mt-0.5">
              Agua ahorrada
            </p>
          </div>

          <div className="text-center p-3 rounded-xl bg-[var(--color-v-black-3)]">
            <Zap size={16} className="text-[var(--color-v-amber)] mx-auto mb-1.5" />
            <div className="text-sm font-bold text-[var(--color-v-white)]">
              {energySaved} kWh
            </div>
            <p className="text-[9px] text-[var(--color-v-gray-400)] uppercase tracking-wider mt-0.5">
              Energía solar
            </p>
          </div>
        </div>

        <div className="text-center pt-2 border-t border-[rgba(255,255,255,0.04)]">
          <p className="text-[10px] text-[var(--color-v-gray-500)]">
            {totalNights} noches eco-responsables registradas
          </p>
        </div>
      </div>
    </div>
  );
}
