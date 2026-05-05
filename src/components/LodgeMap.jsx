/**
 * LodgeMap — Technical Blueprint Edition (SaaS Version)
 * Un mapa operativo universal, limpio y profesional compatible con cualquier configuración.
 */
import { useState, useMemo, Component } from 'react';
import { useHabitaciones } from '../hooks/useHabitaciones';
import { useReservas } from '../hooks/useReservas';
import { Users, AlertTriangle, LogIn, LogOut, CheckCircle, Info } from 'lucide-react';
import { Transition } from '@headlessui/react';
import QuickCheckinModal from './QuickCheckinModal';
import RoomActionsModal from './RoomActionsModal';
import CheckoutModal from './CheckoutModal';
import toast from 'react-hot-toast';

const estadoColors = {
  disponible:    { fill: '#00e676', glow: 'rgba(0, 230, 118, 0.4)', text: '#000' },
  reservada:     { fill: '#448aff', glow: 'rgba(68, 138, 255, 0.4)', text: '#fff' },
  ocupada:       { fill: '#ffab00', glow: 'rgba(255, 171, 0, 0.4)', text: '#000' },
  mantenimiento: { fill: '#ff1744', glow: 'rgba(255, 23, 68, 0.4)', text: '#fff' },
  limpieza:      { fill: '#b388ff', glow: 'rgba(179, 136, 255, 0.4)', text: '#fff' },
};

// Transformación Isométrica Mejorada
const toIso = (x, y) => ({
  ix: (x - y),
  iy: (x + y) / 2
});

class MapErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-96 gap-3 text-[var(--color-v-gray-500)]">
          <AlertTriangle size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Error en Plano Técnico</span>
        </div>
      );
    }
    return this.props.children;
  }
}

function LodgeMapInner() {
  const { habitaciones, updateEstado } = useHabitaciones();
  const { reservas, updateEstadoReserva } = useReservas();
  const [hoveredId, setHoveredId] = useState(null);
  const [actionHabitacion, setActionHabitacion] = useState(null);
  const [selectedHabitacion, setSelectedHabitacion] = useState(null);
  const [checkoutReserva, setCheckoutReserva] = useState(null);

  const activeReservas = useMemo(() => {
    const map = {};
    reservas.forEach(r => { if (r.estado === 'checkin') map[r.habitacion_id] = r; });
    return map;
  }, [reservas]);

  // Layout Dinámico Universal
  const isoHabitaciones = useMemo(() => {
    if (!habitaciones || habitaciones.length === 0) return [];
    
    // Agrupamos por pisos o secciones (ej. 1xx, 2xx)
    const sections = {};
    habitaciones.forEach(h => {
      const sectionKey = h.numero ? String(h.numero)[0] : '0';
      if (!sections[sectionKey]) sections[sectionKey] = [];
      sections[sectionKey].push(h);
    });

    const result = [];
    Object.keys(sections).sort().forEach((sKey, sIdx) => {
      sections[sKey].forEach((h, hIdx) => {
        // Posicionamiento en bloques técnicos
        const x = hIdx * 100 + 150;
        const y = sIdx * 150 + 100;
        const { ix, iy } = toIso(x, y);
        result.push({ ...h, ix: ix + 450, iy: iy + 80, z: sIdx + hIdx });
      });
    });
    return result.sort((a, b) => a.z - b.z);
  }, [habitaciones]);

  if (!habitaciones || habitaciones.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-[var(--color-v-gray-500)] bg-[#0a0a0a]">
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Cargando Plano Técnico...</p>
      </div>
    );
  }

  const hovered = isoHabitaciones.find(h => h.id === hoveredId);
  const currentReserva = hovered ? activeReservas[hovered.id] : null;

  return (
    <div className="relative w-full overflow-hidden bg-[#0a0a0a] rounded-2xl border border-white/5" style={{ aspectRatio: '16/9' }}>
      <svg viewBox="0 0 1000 600" className="w-full h-full select-none cursor-crosshair">
        {/* --- BLUEPRINT GRID --- */}
        <defs>
          <pattern id="millimetric" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
          </pattern>
          <pattern id="majorGrid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#millimetric)"/>
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
          </pattern>
          <filter id="technicalGlow">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Fondo Técnico */}
        <rect width="1000" height="600" fill="url(#majorGrid)" />
        
        {/* Marcadores de Coordenadas */}
        {[...Array(10)].map((_, i) => (
          <g key={`coord-${i}`}>
            <text x={i * 100 + 5} y="15" className="fill-white/10 text-[8px] font-mono">{i * 100}</text>
            <text x="5" y={i * 100 + 15} className="fill-white/10 text-[8px] font-mono">{i * 100}</text>
          </g>
        ))}

        {/* --- HABITACIONES (Technical Cells) --- */}
        {isoHabitaciones.map((room) => {
          const colors = estadoColors[room.estado] || estadoColors.disponible;
          const isHovered = hoveredId === room.id;
          const isOccupied = room.estado === 'ocupada' || room.estado === 'checkin';

          return (
            <g 
              key={room.id}
              onMouseEnter={() => setHoveredId(room.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setActionHabitacion(room)}
              className="cursor-pointer transition-all duration-300"
              style={{ filter: isHovered ? 'url(#technicalGlow)' : 'none' }}
            >
              {/* Sombra Técnica */}
              <path 
                d={`M ${room.ix} ${room.iy + 25} L ${room.ix + 40} ${room.iy + 5} L ${room.ix + 80} ${room.iy + 25} L ${room.ix + 40} ${room.iy + 45} Z`} 
                fill="rgba(0,0,0,0.5)"
              />

              {/* Cuerpo Isométrico (Estilo Blueprint) */}
              <path 
                d={`M ${room.ix + 40} ${room.iy + 40} L ${room.ix + 80} ${room.iy + 20} L ${room.ix + 80} ${room.iy} L ${room.ix + 40} ${room.iy + 20} Z`} 
                fill={isHovered ? colors.fill : '#111'} 
                stroke={isHovered ? colors.fill : 'rgba(255,255,255,0.1)'}
                opacity={isHovered ? 0.3 : 0.8}
              />
              <path 
                d={`M ${room.ix} ${room.iy + 20} L ${room.ix + 40} ${room.iy + 40} L ${room.ix + 40} ${room.iy + 20} L ${room.ix} ${room.iy} Z`} 
                fill={isHovered ? colors.fill : '#0a0a0a'} 
                stroke={isHovered ? colors.fill : 'rgba(255,255,255,0.1)'}
                opacity={isHovered ? 0.4 : 1}
              />
              <path
                d={`M ${room.ix} ${room.iy} L ${room.ix + 40} ${room.iy - 20} L ${room.ix + 80} ${room.iy} L ${room.ix + 40} ${room.iy + 20} Z`} 
                fill={isHovered ? colors.fill : (isOccupied ? 'rgba(255,171,0,0.05)' : '#050505')} 
                stroke={isHovered ? colors.fill : 'rgba(255,255,255,0.2)'}
                strokeWidth={isHovered ? 1.5 : 0.5}
              />

              {/* Status Indicator (Pulse LED) */}
              <circle 
                cx={room.ix + 40} 
                cy={room.iy} 
                r="3" 
                fill={colors.fill} 
                className={isOccupied ? 'animate-pulse' : ''}
                style={{ filter: `drop-shadow(0 0 5px ${colors.fill})` }}
              />

              {/* Label de Habitación */}
              <text 
                x={room.ix + 40} 
                y={room.iy + 4} 
                textAnchor="middle" 
                className={`text-[10px] font-mono font-bold tracking-tighter ${isHovered ? 'fill-black' : 'fill-white/40'}`}
              >
                {room.numero}
              </text>
            </g>
          );
        })}
      </svg>

      {/* --- TERMINAL DE DATOS (HUD) --- */}
      <Transition
        show={!!hovered}
        enter="transition-all duration-300"
        enterFrom="opacity-0 translate-y-4"
        enterTo="opacity-100 translate-y-0"
        leave="transition-all duration-200"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-4"
      >
        <div className="absolute bottom-6 left-6 p-4 rounded-xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl min-w-[220px]">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest">Cell Info_</h4>
            <div className={`w-2 h-2 rounded-full ${hovered?.estado === 'disponible' ? 'bg-green-500' : 'bg-amber-500'} shadow-lg shadow-current/20`} />
          </div>
          
          <div className="space-y-1 mb-3">
            <h3 className="text-xl font-black text-white">#{hovered?.numero}</h3>
            <p className="text-[9px] text-white/40 font-mono uppercase tracking-tighter">{hovered?.tipo} — {hovered?.estado}</p>
          </div>

          {currentReserva ? (
            <div className="space-y-2 border-t border-white/5 pt-3">
              <div className="flex items-center gap-2">
                <Users size={12} className="text-green-500" />
                <span className="text-[11px] text-white font-medium truncate">{currentReserva.cliente?.nombre_completo}</span>
              </div>
              <div className="flex items-center gap-4 text-[9px] text-white/30 font-mono">
                <div className="flex items-center gap-1"><LogIn size={10} /> {currentReserva.fecha_ingreso}</div>
                <div className="flex items-center gap-1"><LogOut size={10} /> {currentReserva.fecha_salida}</div>
              </div>
            </div>
          ) : (
            <p className="text-[9px] text-white/20 font-mono italic border-t border-white/5 pt-3">No active process_</p>
          )}
        </div>
      </Transition>

      {/* Leyenda Técnica */}
      <div className="absolute top-6 left-6 p-3 rounded-lg bg-black/40 backdrop-blur-sm border border-white/5">
        <div className="flex items-center gap-4">
          {Object.entries(estadoColors).slice(0, 3).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.fill }} />
              <span className="text-[8px] text-white/40 font-bold uppercase tracking-wider">{key}</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODALS DE OPERACIÓN --- */}
      {actionHabitacion && (
        <RoomActionsModal 
          habitacion={actionHabitacion}
          reserva={activeReservas[actionHabitacion.id]}
          onCheckin={setSelectedHabitacion}
          onCheckout={setCheckoutReserva}
          onClose={() => setActionHabitacion(null)}
        />
      )}
      {selectedHabitacion && (
        <QuickCheckinModal 
          habitacion={selectedHabitacion} 
          onClose={() => setSelectedHabitacion(null)} 
        />
      )}
      {checkoutReserva && (
        <CheckoutModal 
          reserva={checkoutReserva}
          onClose={() => setCheckoutReserva(null)}
          onConfirm={(id, estado) => updateEstadoReserva(id, estado)}
        />
      )}
    </div>
  );
}

export default function LodgeMap() {
  return (
    <MapErrorBoundary>
      <LodgeMapInner />
    </MapErrorBoundary>
  );
}
