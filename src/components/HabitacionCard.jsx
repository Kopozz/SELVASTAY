import { Bed, Users, CheckCircle2, Clock, Wrench, SprayCan, Home, Tent, Crown, ChevronDown } from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const estadoConfig = {
  disponible:    { label: 'Disponible',  badge: 'badge-disponible',    icon: CheckCircle2, color: 'var(--color-v-green)' },
  reservada:     { label: 'Reservada',   badge: 'badge-reservada',     icon: Clock,       color: 'var(--color-v-blue)' },
  ocupada:       { label: 'Ocupada',     badge: 'badge-ocupada',       icon: Users,       color: 'var(--color-v-amber)' },
  mantenimiento: { label: 'Mant.',       badge: 'badge-mantenimiento', icon: Wrench,      color: 'var(--color-v-red)' },
  limpieza:      { label: 'Limpieza',    badge: 'badge-limpieza',      icon: SprayCan,    color: 'var(--color-v-blue)' },
};

const tipoIcons = {
  simple: Home,
  doble: Bed,
  suite: Crown,
  cabaña: Home,
  bungalow: Home,
  glamping: Tent,
};

export default function HabitacionCard({ habitacion, onStatusChange, onClick }) {
  const { id, numero, tipo, precio_noche, estado, capacidad } = habitacion;
  const config = estadoConfig[estado] || estadoConfig.disponible;
  const StatusIcon = config.icon;
  const TipoIcon = tipoIcons[tipo] || Bed;

  return (
    <div 
      className="v-card p-4 group relative cursor-pointer hover:border-[rgba(0,230,118,0.25)] hover:shadow-[0_0_20px_rgba(0,230,118,0.02)] transition-all duration-300"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <TipoIcon size={16} className="text-[var(--color-v-gray-400)]" />
          <h3 className="text-base font-bold text-[var(--color-v-white)] tracking-tight">
            {numero}
          </h3>
        </div>

        {/* Status Menu */}
        <Menu as="div" className="relative">
          <MenuButton className={`px-2 py-0.5 text-[10px] font-semibold ${config.badge} flex items-center gap-1 hover:brightness-110 transition-all`}>
            <StatusIcon size={10} />
            {config.label}
            <ChevronDown size={8} className="opacity-50" />
          </MenuButton>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems className="absolute right-0 mt-1 w-32 origin-top-right bg-[var(--color-v-black-2)] border border-[rgba(255,255,255,0.08)] rounded-md shadow-xl z-50 overflow-hidden focus:outline-none">
              <div className="py-1">
                {Object.entries(estadoConfig).map(([key, cfg]) => {
                  const ItemIcon = cfg.icon;
                  return (
                    <MenuItem key={key}>
                      {({ active }) => (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange?.(id, key);
                          }}
                          className={`${
                            active ? 'bg-[rgba(255,255,255,0.04)]' : ''
                          } ${estado === key ? 'text-[var(--color-v-green)]' : 'text-[var(--color-v-gray-300)]'} 
                          group flex w-full items-center gap-2 px-3 py-2 text-[10px] font-medium transition-colors`}
                        >
                          <ItemIcon size={12} style={{ color: cfg.color }} />
                          {cfg.label}
                        </button>
                      )}
                    </MenuItem>
                  );
                })}
              </div>
            </MenuItems>
          </Transition>
        </Menu>
      </div>

      <div className="flex items-center justify-between text-xs text-[var(--color-v-gray-400)]">
        <span className="capitalize">{tipo}</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Users size={11} />
            {capacidad}
          </span>
          <span className="font-semibold text-[var(--color-v-white)]">
            S/{Number(precio_noche || 0).toFixed(0)}
          </span>
        </div>
      </div>
    </div>
  );
}
