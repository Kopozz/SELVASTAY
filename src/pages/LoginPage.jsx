/**
 * LoginPage — Pantalla de Inicio de Sesión
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trees, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulación de login para demo
    setTimeout(() => {
      setLoading(false);
      toast.success('Acceso autorizado', {
        icon: <ShieldCheck className="text-[var(--color-v-green)]" />,
      });
      navigate('/');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[var(--color-v-black)] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--color-v-green-glow)] rounded-full blur-[120px] opacity-20 pointer-events-none" />
      
      {/* Login Box */}
      <div className="w-full max-w-[380px] animate-scale-in z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-v-green)] flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(0,230,118,0.3)]">
            <Trees size={32} className="text-black" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-v-white)] tracking-tight">SelvaStay <span className="text-[var(--color-v-green)] font-black">PRO</span></h1>
          <p className="text-[var(--color-v-gray-500)] text-xs uppercase tracking-widest mt-1 font-semibold">Sistema de Gestión Operativa</p>
        </div>

        <div className="v-card p-8 border-[rgba(255,255,255,0.06)] shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--color-v-gray-500)] uppercase tracking-wider ml-1">Identificación</label>
              <div className="relative group">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-v-gray-500)] group-focus-within:text-[var(--color-v-green)] transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="admin@selvastay.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-semibold text-[var(--color-v-gray-500)] uppercase tracking-wider">Contraseña</label>
                <button type="button" className="text-[10px] text-[var(--color-v-gray-600)] hover:text-[var(--color-v-gray-400)] font-medium transition-colors uppercase tracking-wider">¿Olvidaste?</button>
              </div>
              <div className="relative group">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-v-gray-500)] group-focus-within:text-[var(--color-v-green)] transition-colors" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 group mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Ingresar al Sistema</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-[var(--color-v-gray-600)] font-medium">
          Acceso restringido para personal autorizado <br/> 
          <span className="text-[var(--color-v-gray-700)] mt-2 block">© 2026 SelvaStay Software Solutions</span>
        </p>
      </div>
    </div>
  );
}
