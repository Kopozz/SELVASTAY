/**
 * PageLoader — Loader inline (solo área de contenido)
 */
export default function PageLoader() {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="flex flex-col items-center gap-5">
        {/* Spinner */}
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border border-[rgba(255,255,255,0.04)]" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--color-v-green)] animate-spin" style={{ animationDuration: '0.6s' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-v-green)]" style={{ animation: 'pulse-dot 1s ease-in-out infinite' }} />
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-28 h-[2px] bg-[var(--color-v-black-4)] rounded-full overflow-hidden">
          <div className="h-full bg-[var(--color-v-green)] rounded-full" style={{ animation: 'loader-bar 1.2s cubic-bezier(0.65, 0, 0.35, 1) forwards' }} />
        </div>

        <p className="text-[9px] text-[var(--color-v-gray-500)] uppercase tracking-[0.2em] font-medium">Cargando</p>
      </div>
    </div>
  );
}
