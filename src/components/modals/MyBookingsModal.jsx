import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useReservations } from '../../hooks/useReservations';
import { calculateRefundAmount } from '../../utils/refund';
import toast from 'react-hot-toast';

export default function MyBookingsModal({ isOpen, onClose, onRestoreSlot }) {
  const { currentUser } = useAuth();
  const { getUserReservations, cancelReservation, getReservation } = useReservations();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadBookings = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const list = await getUserReservations(currentUser.email);
      list.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
      setBookings(list);
    } catch {
      toast.error('예약 내역 로드 실패');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) loadBookings();
  }, [isOpen, currentUser]);

  const handleCancel = async (bookingId) => {
    const booking = await getReservation(bookingId);
    if (!booking) {
      toast.error('예약 정보를 찾을 수 없습니다.');
      return;
    }

    const refund = calculateRefundAmount(booking);
    if (refund.percent === 0) {
      toast.error('이용 12시간 미만 건은 취소 및 환불이 불가능합니다.');
      return;
    }

    const confirmMessage =
      `이 예약을 정말 취소하시겠습니까?\n\n` +
      `• 이용 예정 시간까지 약 ${Math.max(0, Math.floor(refund.hoursLeft))}시간 남음\n` +
      `• 환불률: ${refund.percent}%\n` +
      `• 최종 환불 금액: ₩${refund.amount.toLocaleString()}\n` +
      `• 위약금 발생: ₩${refund.penalty.toLocaleString()}\n\n` +
      `취소 완료 후 결제 수단으로 환불 처리됩니다. 진행하시겠습니까?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      await cancelReservation(bookingId);
      await onRestoreSlot(booking);

      toast.success('예약 및 결제 취소가 완료되었습니다. (환불 완료)');
      loadBookings();
    } catch (err) {
      toast.error(`취소 실패: ${err.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg mx-4 glass rounded-3xl p-6 border border-white/10 flex flex-col max-h-[85vh] relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white text-xl">
          ✕
        </button>

        <h2 className="text-xl font-black mb-4 flex items-center gap-2">📅 내 예약 및 결제 내역</h2>

        <div className="flex-1 overflow-y-auto custom-scroll space-y-3 pr-1">
          {loading ? (
            <div className="text-center py-10">
              <div className="w-6 h-6 rounded-full border-2 border-green-500 border-t-transparent animate-spin mx-auto" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-10 text-white/30">
              <p className="text-2xl">📅</p>
              <p className="text-xs mt-2">최근 결제하거나 완료한 예약이 없습니다.</p>
            </div>
          ) : (
            bookings.map((booking) => {
              const refund = calculateRefundAmount(booking);
              let cancelBtnText = '예약 취소 (100% 무료 환불)';

              if (refund.percent === 50) cancelBtnText = '예약 취소 (위약금 50% 발생)';
              else if (refund.percent === 0) cancelBtnText = '취소 불가 (위약금 100% 발생)';

              return (
                <div key={booking.bookingId} className="glass-light border border-white/5 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold glass-light">
                        {booking.facilityEmoji || '🏟️'} {booking.sportLabel}
                      </span>
                      <h3 className="font-bold text-sm text-white mt-1">{booking.facilityName}</h3>
                    </div>
                    <span className="text-[10px] text-green-400 border border-green-500/25 bg-green-500/5 px-2.5 py-1 rounded-lg font-bold">
                      확정 완료
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-white/60">
                    <p className="flex items-center gap-1.5">📅 {booking.dateTimeText}</p>
                    <p className="flex items-center gap-1.5">
                      💳 ₩{booking.price.toLocaleString()} ({booking.paymentMethod?.toUpperCase()})
                    </p>
                    <p className="text-[10px] text-white/30">번호: {booking.bookingId}</p>
                  </div>

                  <div className="flex gap-2 border-t border-white/5 pt-3">
                    <button
                      onClick={() => handleCancel(booking.bookingId)}
                      disabled={refund.percent === 0}
                      className="flex-1 py-2 text-xs font-bold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-xl transition-all disabled:opacity-30 disabled:pointer-events-none"
                    >
                      {cancelBtnText}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
