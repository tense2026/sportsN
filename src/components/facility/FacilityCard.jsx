export default function FacilityCard({ facility, onSelect }) {
  const firstAvail = facility.timeSlots?.[0]?.find(
    (s) => s.state === 'available' || s.state === 'few'
  );
  const previewSlotText = firstAvail
    ? `${firstAvail.time.split(' - ')[0]} 예약가능`
    : '오늘 마감';
  const badgeClass = firstAvail ? 'badge-available' : 'badge-full';

  return (
    <div
      onClick={onSelect}
      className="glass-light rounded-2xl p-4 space-y-3 cursor-pointer hover:border-green-500/30 transition-all border border-white/5 relative group"
    >
      <div className="flex items-start gap-3">
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-dark-700 shrink-0">
          <img
            src={facility.image}
            alt={facility.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&h=200&fit=crop';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 justify-between">
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold glass-light">
              {facility.emoji} {facility.sportLabel}
            </span>
            <span className={`text-xs ${badgeClass} px-2 py-0.5 rounded-full font-semibold shrink-0`}>
              {previewSlotText}
            </span>
          </div>
          <h3 className="font-bold text-sm text-white truncate mt-1.5">{facility.name}</h3>
          <p className="text-[11px] text-white/50 flex items-center gap-1 mt-0.5">
            📍 {facility.distance?.toFixed(1)}km · {facility.address}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs">
        <div className="flex items-center gap-1">
          <span className="star text-[10px]">★</span>
          <span className="text-white font-semibold">{facility.rating}</span>
          <span className="text-white/30 text-[10px]">({facility.reviewCount})</span>
        </div>
        <p className="font-black text-green-400">
          ₩{facility.price.toLocaleString()}
          <span className="text-white/40 text-[10px] font-normal">/시간</span>
        </p>
      </div>

      <button className="btn-primary w-full py-2.5 rounded-xl text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
        시설 상세 및 예약하기
      </button>
    </div>
  );
}
