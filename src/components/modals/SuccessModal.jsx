import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

export default function SuccessModal({ isOpen, booking, onClose }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isOpen && booking && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, booking.bookingId, {
        width: 110,
        margin: 1,
        color: { dark: '#1a1a1a', light: '#ffffff' },
      });
    }
  }, [isOpen, booking]);

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-sm mx-4 glass rounded-3xl p-6 border border-green-500/20 relative overflow-hidden flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full btn-primary flex items-center justify-center shadow-lg shadow-green-500/20 mb-4 animate-bounce">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-2xl font-black text-white mb-1">예약이 완료되었습니다!</h2>
        <p className="text-xs text-white/50 mb-6">결제가 완료되었으며 예약이 확정되었습니다.</p>

        <div className="w-full glass-light border border-white/5 rounded-2xl p-4 mb-6 space-y-3 relative">
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-dark-900 border-r border-white/5" />
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-dark-900 border-l border-white/5" />

          <div className="border-b border-white/5 border-dashed pb-3 text-left">
            <p className="font-bold text-base text-white">{booking.facilityName}</p>
            <p className="text-xs text-green-400 font-semibold mt-1">{booking.dateTimeText}</p>
          </div>

          <div className="py-2 flex flex-col items-center gap-1.5">
            <div className="w-32 h-32 bg-white p-2.5 rounded-xl flex items-center justify-center">
              <canvas ref={canvasRef} />
            </div>
            <span className="text-[10px] text-white/30 font-display tracking-widest">{booking.bookingId}</span>
          </div>

          <p className="text-[10px] text-white/40 leading-relaxed text-center">
            당일 시설 입구의 QR 스캐너에 바코드를 인식하면 무인 게이트가 열립니다.
          </p>
        </div>

        <button onClick={onClose} className="btn-primary w-full py-3.5 rounded-xl text-sm font-bold text-white shadow-lg">
          확인 완료
        </button>
      </div>
    </div>
  );
}
