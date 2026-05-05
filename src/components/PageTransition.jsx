/**
 * PageTransition — Smooth route transitions with inline loader
 */
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import PageLoader from './PageLoader';

export default function PageTransition({ children }) {
  const location = useLocation();
  const [phase, setPhase] = useState('visible');
  const prevPath = useRef(location.pathname);
  const timerRef = useRef(null);

  useEffect(() => {
    if (location.pathname !== prevPath.current) {
      prevPath.current = location.pathname;
      setPhase('loading');

      // Clear any existing timer
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        setPhase('entering');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setPhase('visible'));
        });
      }, 150); // Reducido de 1000 a 150 para eliminar el "parpadeo" lento
    }

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [location.pathname]);

  if (phase === 'loading') return <PageLoader />;

  return (
    <div
      className="transition-all duration-300 ease-out"
      style={{
        opacity: phase === 'visible' ? 1 : 0,
        transform: phase === 'visible' ? 'translateY(0)' : 'translateY(4px)',
      }}
    >
      {children}
    </div>
  );
}
