/**
 * QRCheckin — Generador de QR para Check-in Autónomo
 */
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Copy, Share2, Check, Smartphone, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function QRCheckin({ reservaId, habitacionNumero, onClose }) {
  const [copied, setCopied] = useState(false);
  
  const checkinUrl = `${window.location.origin}/checkin/${reservaId || 'demo-qr-123'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(checkinUrl);
    setCopied(true);
    toast.success('Link copiado');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="v-card w-full max-w-sm animate-scale-in border-[rgba(0,230,118,0.2)] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[rgba(255,255,255,0.04)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[rgba(0,230,118,0.1)] flex items-center justify-center border border-[rgba(0,230,118,0.1)]">
              <QrCode size={20} className="text-[var(--color-v-green)]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--color-v-white)] uppercase tracking-tight">Check-in QR</h2>
              <p className="text-[10px] text-[var(--color-v-gray-400)] font-medium">
                {habitacionNumero ? `Habitación ${habitacionNumero}` : 'Acceso rápido'}
              </p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition-colors text-[var(--color-v-gray-500)]">
              <X size={18} />
            </button>
          )}
        </div>

        {/* QR Code */}
        <div className="p-8 flex flex-col items-center">
          <div className="bg-white p-4 rounded-2xl shadow-xl mb-6">
            <QRCodeSVG
              value={checkinUrl}
              size={180}
              level="H"
              bgColor="#ffffff"
              fgColor="#0a0a0a"
            />
          </div>

          {/* Instructions */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[rgba(0,230,118,0.05)] border border-[rgba(0,230,118,0.1)] rounded-full mb-3">
              <Smartphone size={13} className="text-[var(--color-v-green)]" />
              <span className="text-[10px] font-bold text-[var(--color-v-green)] uppercase tracking-wider">Escanear con el móvil</span>
            </div>
            <p className="text-[11px] text-[var(--color-v-gray-400)] leading-relaxed">
              El huésped completa sus datos desde su dispositivo<br />
              y el registro aparece en el dashboard.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 w-full">
            <button
              onClick={handleCopy}
              className="btn-secondary flex-1 flex items-center justify-center gap-2 text-xs"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: 'Check-in SelvaStay', url: checkinUrl });
                } else {
                  handleCopy();
                }
              }}
              className="btn-primary flex-1 flex items-center justify-center gap-2 text-xs"
            >
              <Share2 size={14} />
              Compartir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function QRCheckinButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="btn-secondary flex items-center gap-2 text-sm"
      title="Generar QR de Check-in"
    >
      <QrCode size={16} />
      Check-in QR
    </button>
  );
}
