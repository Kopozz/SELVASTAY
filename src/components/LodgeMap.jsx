/**
 * LodgeMap — Plano Operativo Interactivo (Arrastrable y con Zoom)
 * 
 * Justificación de complejidad:
 * - Se usa useState para trackear la posición del "pan" (translateX, translateY)
 *   y el nivel de zoom (scale). Esto es un patrón estándar en UIs interactivas.
 * - Los eventos onMouseDown/onMouseMove/onMouseUp implementan el arrastre (drag).
 *   No se usa ninguna librería externa, solo eventos nativos del DOM.
 * - El viewBox del SVG se mantiene estático; el transform CSS mueve el contenido.
 */
import { useState, useMemo, useRef, useCallback, Component } from 'react';
import { useHabitaciones } from '../hooks/useHabitaciones';
import { useReservas } from '../hooks/useReservas';
import { Users, AlertTriangle, LogIn, LogOut, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Transition } from '@headlessui/react';
import QuickCheckinModal from './QuickCheckinModal';
import RoomActionsModal from './RoomActionsModal';
import CheckoutModal from './CheckoutModal';

const estadoColors = {
  disponible:    { fill: '#00e676', glow: 'rgba(0, 230, 118, 0.4)', text: '#000' },
  reservada:     { fill: '#448aff', glow: 'rgba(68, 138, 255, 0.4)', text: '#fff' },
  ocupada:       { fill: '#ffab00', glow: 'rgba(255, 171, 0, 0.4)', text: '#000' },
  mantenimiento: { fill: '#ff1744', glow: 'rgba(255, 23, 68, 0.4)', text: '#fff' },
  limpieza:      { fill: '#b388ff', glow: 'rgba(179, 136, 255, 0.4)', text: '#fff' },
};

// Transformación Isométrica para la vista 3D
const toIso = (x, y) => ({
  ix: (x - y),
  iy: (x + y) / 2
});

// Error Boundary para atrapar fallos de renderizado sin romper la app
class MapErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-96 gap-3 text-[var(--color-v-gray-500)]">
          <AlertTriangle size={24} />
          <span className="text-xs font-semibold uppercase tracking-widest">Error al cargar el plano</span>
        </div>
      );
    }
    return this.props.children;
  }
}

function LodgeMapInner() {
  const { habitaciones } = useHabitaciones();
  const { reservas, updateEstadoReserva } = useReservas();
  const [hoveredId, setHoveredId] = useState(null);
  const [actionHabitacion, setActionHabitacion] = useState(null);
  const [selectedHabitacion, setSelectedHabitacion] = useState(null);
  const [checkoutReserva, setCheckoutReserva] = useState(null);

  // --- Estado del Pan (arrastre con mouse) y Zoom ---
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Manejar inicio del arrastre
  const handleMouseDown = useCallback((e) => {
    // Solo arrastrar con botón izquierdo y si no hicieron click en una habitación
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    panStart.current = { x: pan.x, y: pan.y };
  }, [pan]);

  // Manejar movimiento del mouse durante arrastre
  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPan({
      x: panStart.current.x + dx,
      y: panStart.current.y + dy
    });
  }, [isDragging]);

  // Manejar fin del arrastre
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Controles de zoom (+/-)
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.4));
  const handleResetView = () => { setPan({ x: 0, y: 0 }); setScale(1); };

  // Zoom con rueda del mouse
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => Math.min(2.5, Math.max(0.4, prev + delta)));
  }, []);

  const activeReservas = useMemo(() => {
    const map = {};
    reservas.forEach(r => { if (r.estado === 'checkin') map[r.habitacion_id] = r; });
    return map;
  }, [reservas]);

  // Layout Dinámico — posiciona las habitaciones según su número de sección
  const isoHabitaciones = useMemo(() => {
    if (!habitaciones || habitaciones.length === 0) return [];
    
    const sections = {};
    habitaciones.forEach(h => {
      const sectionKey = h.numero ? String(h.numero)[0] : '0';
      if (!sections[sectionKey]) sections[sectionKey] = [];
      sections[sectionKey].push(h);
    });

    const result = [];
    Object.keys(sections).sort().forEach((sKey, sIdx) => {
      sections[sKey].forEach((h, hIdx) => {
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
        <p className="text-sm font-semibold uppercase tracking-widest">Cargando Plano...</p>
      </div>
    );
  }

  const hovered = isoHabitaciones.find(h => h.id === hoveredId);
  const currentReserva = hovered ? activeReservas[hovered.id] : null;

  return (
    <div 
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#0a0a0a] rounded-2xl border border-white/5"
      style={{ 
        aspectRatio: '16/9',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <svg 
        viewBox="0 0 1000 600" 
        className="w-full h-full select-none"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.2s ease-out'
        }}
      >
        {/* Grid de fondo */}
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

        {/* Fondo */}
        <rect width="1000" height="600" fill="url(#majorGrid)" />
        
        {/* Marcadores de coordenadas */}
        {[...Array(10)].map((_, i) => (
          <g key={`coord-${i}`}>
            <text x={i * 100 + 5} y="15" className="fill-white/10 text-[9px] font-mono">{i * 100}</text>
            <text x="5" y={i * 100 + 15} className="fill-white/10 text-[9px] font-mono">{i * 100}</text>
          </g>
        ))}

        {/* Habitaciones (celdas isométricas) */}
        {isoHabitaciones.map((room) => {
          const colors = estadoColors[room.estado] || estadoColors.disponible;
          const isHovered = hoveredId === room.id;
          const isOccupied = room.estado === 'ocupada' || room.estado === 'checkin';

          return (
            <g 
              key={room.id}
              onMouseEnter={() => setHoveredId(room.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={(e) => {
                // Solo abrir modal si el arrastre fue mínimo (evitar abrir al soltar drag)
                e.stopPropagation();
                if (Math.abs(pan.x - panStart.current.x) < 5 && Math.abs(pan.y - panStart.current.y) < 5) {
                  setActionHabitacion(room);
                }
              }}
              className="cursor-pointer transition-all duration-300"
              style={{ filter: isHovered ? 'url(#technicalGlow)' : 'none' }}
            >
              {/* Sombra */}
              <path 
                d={`M ${room.ix} ${room.iy + 25} L ${room.ix + 40} ${room.iy + 5} L ${room.ix + 80} ${room.iy + 25} L ${room.ix + 40} ${room.iy + 45} Z`} 
                fill="rgba(0,0,0,0.5)"
              />
              {/* Cuerpo Isométrico */}
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
              {/* Indicador de estado (LED) */}
              <circle 
                cx={room.ix + 40} 
                cy={room.iy} 
                r="3" 
                fill={colors.fill} 
                className={isOccupied ? 'animate-pulse' : ''}
                style={{ filter: `drop-shadow(0 0 5px ${colors.fill})` }}
              />
              {/* Número de habitación */}
              <text 
                x={room.ix + 40} 
                y={room.iy + 4} 
                textAnchor="middle" 
                className={`text-[11px] font-mono font-bold tracking-tighter ${isHovered ? 'fill-black' : 'fill-white/50'}`}
              >
                {room.numero}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Controles de Zoom (esquina superior derecha) */}
      <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-20">
        <button 
          onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
          className="p-2 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 text-white/60 hover:text-white hover:bg-black/80 transition-all"
          title="Acercar"
        >
          <ZoomIn size={16} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
          className="p-2 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 text-white/60 hover:text-white hover:bg-black/80 transition-all"
          title="Alejar"
        >
          <ZoomOut size={16} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleResetView(); }}
          className="p-2 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 text-white/60 hover:text-white hover:bg-black/80 transition-all"
          title="Restablecer vista"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {/* Indicador de Zoom actual */}
      <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-sm border border-white/10 text-xs text-white/40 font-mono z-20">
        {Math.round(scale * 100)}%
      </div>

      {/* Info al pasar mouse */}
      <Transition
        show={!!hovered}
        enter="transition-all duration-300"
        enterFrom="opacity-0 translate-y-4"
        enterTo="opacity-100 translate-y-0"
        leave="transition-all duration-200"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-4"
      >
        <div className="absolute bottom-6 left-6 p-4 rounded-xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl min-w-[220px] z-20">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider">Información</h4>
            <div className={`w-2 h-2 rounded-full ${hovered?.estado === 'disponible' ? 'bg-green-500' : 'bg-amber-500'} shadow-lg shadow-current/20`} />
          </div>
          
          <div className="space-y-1 mb-3">
            <h3 className="text-xl font-bold text-white">#{hovered?.numero}</h3>
            <p className="text-xs text-white/50 uppercase tracking-wide">{hovered?.tipo} — {hovered?.estado}</p>
          </div>

          {currentReserva ? (
            <div className="space-y-2 border-t border-white/5 pt-3">
              <div className="flex items-center gap-2">
                <Users size={13} className="text-green-500" />
                <span className="text-sm text-white font-medium truncate">{currentReserva.cliente?.nombre_completo}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-white/40">
                <div className="flex items-center gap-1"><LogIn size={11} /> {currentReserva.fecha_ingreso}</div>
                <div className="flex items-center gap-1"><LogOut size={11} /> {currentReserva.fecha_salida}</div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-white/25 italic border-t border-white/5 pt-3">Sin ocupante actual</p>
          )}
        </div>
      </Transition>

      {/* Leyenda */}
      <div className="absolute top-4 left-4 p-3 rounded-lg bg-black/40 backdrop-blur-sm border border-white/5 z-20">
        <div className="flex items-center gap-4">
          {Object.entries(estadoColors).slice(0, 4).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: cfg.fill }} />
              <span className="text-[10px] text-white/50 font-semibold uppercase tracking-wider">{key}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Instrucciones de uso */}
      <div className="absolute bottom-4 left-4 text-[10px] text-white/20 font-medium z-20">
        Arrastra para mover · Rueda para zoom
      </div>

      {/* Modales de operación */}
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
