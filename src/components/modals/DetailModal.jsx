import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getDateString, getDateLabel } from '../../utils/dates';
import toast from 'react-hot-toast';

export default function DetailModal({
  facility,
  isOpen,
  onClose,
  onProceedBooking,
  onOpenAuth,
  onUpdateSlots,
}) {
  const { currentUser, isAdminMode } = useAuth();
  const [dateOffset, setDateOffset] = useState(0);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);

  useEffect(() => {
    if (isOpen && facility) {
      setDateOffset(0);
      setSelectedSlotIndex(null);
    }
  }, [isOpen, facility?.id]);

  if (!isOpen || !facility) return null;

  const slots = facility.timeSlots[dateOffset];

  const handleSlotClick = async (idx) => {
    const slot = slots[idx];

    if (isAdminMode) {
      const nextState = slot.state === 'full' ? 'available' : 'full';
      const updatedSlots = facility.timeSlots.map((day, dIdx) =>
        dIdx === dateOffset
          ? day.map((s, sIdx) => (sIdx === idx ? { ...s, state: nextState } : s))
          : day
      );
      try {
        await onUpdateSlots(facility.id, updatedSlots);
        toast.success(`슬롯 상태를 '${nextState === 'full' ? '잠금' : '해제'}' 처리했습니다.`);
      } catch {
        toast.error('잠금 설정 실패');
      }
      return;
    }

    if (slot.state === 'full') return;
    setSelectedSlotIndex(selectedSlotIndex === idx ? null : idx);
  };

  const getSlotClasses = (slot, idx) => {
    if (isAdminMode) {
      if (slot.state === 'full') {
        return 'border-red-500/30 bg-red-500/5 hover:border-red-500/60 text-white';
      }
      return 'border-green-500/25 bg-green-500/5 hover:border-green-500/60 text-white';
    }

    if (slot.state === 'available') {
      if (selectedSlotIndex === idx) {
        return 'border-green-500 bg-green-500 text-black font-black shadow-lg';
      }
      return 'border-green-500/25 bg-green-500/5 hover:border-green-500/60 text-white';
    }
    if (slot.state === 'few') {
      if (selectedSlotIndex === idx) {
        return 'border-green-500 bg-green-500 text-black font-black shadow-lg';
      }
      return 'border-yellow-500/25 bg-yellow-500/5 hover:border-yellow-500/60 text-white';
    }
    return 'border-red-500/10 bg-red-500/2 text-white/20 line-through';
  };

  const getSlotBadge = (slot, idx) => {
    if (isAdminMode) return slot.state === 'full' ? '🔴 잠금됨' : '🟢 가능';
    if (selectedSlotIndex === idx) return '✓ 선택됨';
    if (slot.state === 'available') return '🟢 가능';
    if (slot.state === 'few') return '🟡 1자리';
    return '🔴 마감';
  };

  const handleProceed = () => {
    if (isAdminMode) return;
    if (!currentUser) {
      onOpenAuth('login');
      return;
    }
    if (selectedSlotIndex === null) return;
    onProceedBooking({ facility, dateOffset, slotIndex: selectedSlotIndex });
  };

  const selectedSlot =
    selectedSlotIndex !== null ? slots[selectedSlotIndex] : null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-2xl mx-4 glass rounded-3xl overflow-hidden border border-white/10 flex flex-col max-h-[90vh]">
        <div className="relative h-48 sm:h-64 shrink-0 bg-dark-800">
          <img src={facility.image} alt={facility.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/30 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80"
          >
            ✕
          </button>
          <div className="absolute bottom-4 left-6">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold glass-light">
              {facility.emoji} {facility.sportLabel}
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-2 text-white drop-shadow">{facility.name}</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scroll p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm border-b border-white/5 pb-5">
            <div className="space-y-1">
              <span className="text-white/40 text-xs">평균 평점</span>
              <div className="flex items-center gap-1.5 font-bold">
                <span className="star text-sm">★</span>
                <span className="text-white">{facility.rating}</span>
                <span className="text-white/40 text-xs font-normal">({facility.reviewCount}개 리뷰)</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-white/40 text-xs">시간당 요금</span>
              <p className="font-black text-green-400 text-lg">₩{facility.price.toLocaleString()}</p>
            </div>
            <div className="col-span-2 space-y-1">
              <span className="text-white/40 text-xs">시설 주소</span>
              <p className="text-white/80">{facility.address}</p>
            </div>
            <div className="col-span-2 space-y-1">
              <span className="text-white/40 text-xs">부대시설 및 편의시설</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {facility.amenities.map((a) => (
                  <span key={a} className="glass-light px-3 py-1.5 rounded-xl text-xs text-white/70 font-semibold border border-white/5">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews Section (PRD) */}
          {facility.reviews?.length > 0 && (
            <div className="space-y-3 border-b border-white/5 pb-5">
              <h3 className="font-bold text-base flex items-center gap-2">
                <span className="text-green-500">💬</span> 이용자 리뷰
              </h3>
              <div className="space-y-3">
                {facility.reviews.map((review) => (
                  <div key={review.id} className="glass-light rounded-xl p-3 border border-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-white/80">{review.author}</span>
                      <div className="flex items-center gap-1">
                        <span className="star text-[10px]">★</span>
                        <span className="text-xs text-white/60">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed">{review.comment}</p>
                    <p className="text-[10px] text-white/30 mt-1">{review.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <span className="text-green-500">📅</span> 날짜별 타임블록 선택
              </h3>
              <div className="flex gap-1.5 bg-dark-800 p-1 rounded-xl border border-white/5">
                {[0, 1, 2].map((offset) => (
                  <button
                    key={offset}
                    onClick={() => {
                      setDateOffset(offset);
                      setSelectedSlotIndex(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                      dateOffset === offset
                        ? 'bg-green-500 text-white shadow'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    {getDateLabel(offset)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSlotClick(idx)}
                  disabled={!isAdminMode && slot.state === 'full'}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${getSlotClasses(slot, idx)}`}
                >
                  <span className="text-xs font-semibold">{slot.time.split(' - ')[0]}</span>
                  <span className="text-[9px] font-bold tracking-widest uppercase opacity-80">
                    {getSlotBadge(slot, idx)}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/40 justify-center pt-2">
              <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> 가능</div>
              <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> 1자리</div>
              <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> 마감</div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/5 glass flex items-center justify-between gap-4 shrink-0">
          <div className="text-left">
            <p className="text-xs text-white/40">
              선택한 타임:{' '}
              <span className="font-bold text-white">
                {isAdminMode
                  ? '관리자 모드 (슬롯 클릭 시 잠금 토글)'
                  : selectedSlot
                    ? `${getDateString(dateOffset)} ${selectedSlot.time.split(' - ')[0]}`
                    : '-'}
              </span>
            </p>
            {!isAdminMode && (
              <p className="text-sm font-black text-green-400 mt-0.5">
                총 결제금액: {selectedSlot ? `₩${facility.price.toLocaleString()}` : '-'}
              </p>
            )}
          </div>
          <button
            onClick={handleProceed}
            disabled={isAdminMode || selectedSlotIndex === null}
            className="btn-primary px-8 py-3.5 rounded-xl text-sm font-bold text-white disabled:opacity-30 disabled:pointer-events-none"
          >
            {isAdminMode
              ? '관리자 모드 (예약 불가)'
              : currentUser
                ? '예약 및 결제 진행'
                : '로그인 후 예약 가능'}
          </button>
        </div>
      </div>
    </div>
  );
}
