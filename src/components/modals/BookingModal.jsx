import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { requestPayment, generateBookingId } from '../../utils/portone';
import { getFormattedFullDate, getDateString } from '../../utils/dates';
import { requestNotificationPermission, scheduleBookingReminder, showBookingConfirmedNotification } from '../../utils/notifications';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'card', label: '💳 신용카드' },
  { id: 'kakaopay', label: '🟡 카카오페이' },
  { id: 'naverpay', label: '🟢 네이버페이' },
  { id: 'tosspay', label: '🔵 토스페이' },
];

export default function BookingModal({
  isOpen,
  bookingInfo,
  onClose,
  onSuccess,
  onSaveReservation,
  onUpdateSlots,
}) {
  const { currentUser } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paying, setPaying] = useState(false);

  if (!isOpen || !bookingInfo || !currentUser) return null;

  const { facility, dateOffset, slotIndex } = bookingInfo;
  const slot = facility.timeSlots[dateOffset][slotIndex];
  const fullDate = getFormattedFullDate(dateOffset);
  const dateTimeText = `${fullDate} ${slot.time}`;

  const handlePayment = async () => {
    setPaying(true);
    try {
      await requestPayment({
        method: paymentMethod,
        name: `${facility.name} (${slot.time.split(' - ')[0]})`,
        amount: facility.price,
        buyerEmail: currentUser.email,
        buyerName: currentUser.name,
        buyerTel: currentUser.phone,
      });

      const bookingId = generateBookingId();
      const booking = {
        bookingId,
        userEmail: currentUser.email,
        facilityId: facility.id,
        facilityName: facility.name,
        facilityEmoji: facility.emoji,
        sportLabel: facility.sportLabel,
        dateTimeText,
        price: facility.price,
        createdDate: new Date().toISOString(),
        paymentMethod,
        dateOffset,
        slotIndex,
      };

      await onSaveReservation(booking);

      const updatedSlots = facility.timeSlots.map((day, dIdx) =>
        dIdx === dateOffset
          ? day.map((s, sIdx) => (sIdx === slotIndex ? { ...s, state: 'full' } : s))
          : day
      );
      await onUpdateSlots(facility.id, updatedSlots);

      await requestNotificationPermission();
      showBookingConfirmedNotification(booking);
      scheduleBookingReminder(booking);

      toast.success('결제가 성공적으로 완료되었습니다.');
      onClose();
      onSuccess(booking);
    } catch (err) {
      toast.error(err.message || '결제에 실패했습니다.');
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md mx-4 glass rounded-3xl p-6 border border-white/10 relative overflow-hidden flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white text-xl">
          ✕
        </button>

        <h2 className="text-xl font-black mb-4 flex items-center gap-2">💳 예약 정보 확인 및 결제</h2>

        <div className="space-y-4 flex-1 overflow-y-auto custom-scroll pr-1 pb-4">
          <div className="glass-light border border-white/5 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/40">시설명</span>
              <span className="font-bold">{facility.name}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/40">예약 일시</span>
              <span className="font-semibold text-green-400">
                {fullDate} ({getDateString(dateOffset)}) {slot.time}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/40">이용 금액</span>
              <span className="font-semibold">₩{facility.price.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">예약자 정보</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-white/50">예약자명</label>
                <input readOnly value={currentUser.name} className="w-full glass-light border border-white/5 rounded-xl px-3 py-2 text-xs text-white/70 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-white/50">연락처</label>
                <input readOnly value={currentUser.phone} className="w-full glass-light border border-white/5 rounded-xl px-3 py-2 text-xs text-white/70 outline-none" />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">결제 수단 선택</h3>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`px-4 py-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 ${
                    paymentMethod === method.id
                      ? 'border-green-500 bg-green-500/10 text-green-400'
                      : 'border-white/5 bg-white/2 hover:border-white/10 text-white/70'
                  }`}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[11px] text-red-400">
            ⚠️ <strong>환불 정책:</strong> 이용 24시간 전까지는 100% 무료 취소 가능하며, 그 이후 취소 시 위약금이 발생합니다.
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={paying}
          className="btn-primary w-full py-4 rounded-xl text-sm font-bold text-white mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {paying ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              결제창 요청 중...
            </>
          ) : (
            '결제 및 예약 확정하기'
          )}
        </button>
      </div>
    </div>
  );
}
