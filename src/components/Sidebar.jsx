/**
 * Sidebar — VALVE Edition
 */
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarCheck, Users, Settings, Utensils, Trees, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { useState } from 'react';
import ConnectivityBanner from './ConnectivityBanner';

const navItems = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/reservas',  icon: CalendarCheck,   label: 'Reservas' },
  { to: '/clientes',  icon: Users,           label: 'Huéspedes' },
  { to: '/servicios', icon: Utensils,        label: 'Servicios' },
  { to: '/config',    icon: Settings,        label: 'Ajustes' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-40 flex flex-col transition-all duration-300 ${collapsed ? 'w-[68px]' : 'w-[240px]'}`}
      style={{
        background: 'var(--color-v-black)',
        borderRight: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {/* Logo */}
      <div className="p-4 mb-1">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--color-v-green)] flex items-center justify-center flex-shrink-0">
            <Trees size={18} className="text-black" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-sm font-bold text-[var(--color-v-white)] tracking-tight leading-none">SelvaStay</h1>
              <p className="text-[9px] text-[var(--color-v-green)] font-bold tracking-[0.15em] uppercase mt-0.5">PRO</p>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-[var(--color-v-black-4)]" />

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={17} strokeWidth={1.5} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 space-y-2">
        {!collapsed && <ConnectivityBanner />}
        <div className="flex gap-1">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex-1 flex items-center justify-center p-2 rounded-lg text-[var(--color-v-gray-500)] hover:text-[var(--color-v-gray-200)] hover:bg-[rgba(255,255,255,0.03)] transition-all"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
          {!collapsed && (
            <NavLink
              to="/login"
              className="flex items-center justify-center p-2 rounded-lg text-[var(--color-v-red)] hover:bg-[rgba(255,23,68,0.05)] transition-all"
              title="Cerrar Sesión"
            >
              <LogOut size={16} />
            </NavLink>
          )}
        </div>
      </div>
    </aside>
  );
}
