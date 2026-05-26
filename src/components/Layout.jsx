/**
 * Layout — Estructura Principal con Transiciones de Página
 */
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import PageTransition from './PageTransition';
import { Toaster } from 'react-hot-toast';

export default function Layout() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="ml-[240px] p-6 min-h-screen transition-all duration-300">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--color-v-black-2)',
            color: 'var(--color-v-white)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '10px',
            fontSize: '0.8125rem',
          },
          success: { iconTheme: { primary: '#00e676', secondary: '#000' } },
          error: { iconTheme: { primary: '#ff1744', secondary: '#111' } },
        }}
      />
    </div>
  );
}
