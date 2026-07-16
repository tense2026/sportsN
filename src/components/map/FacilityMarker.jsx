import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

export default function FacilityMarker({ facility, onSelect }) {
  const hasAvailability = facility.timeSlots?.[0]?.some(
    (s) => s.state === 'available' || s.state === 'few'
  );

  const icon = L.divIcon({
    className: '',
    html: `<div class="w-10 h-10 rounded-full btn-primary flex items-center justify-center border-2 border-white shadow-2xl relative">
            <span class="text-base">${facility.emoji}</span>
            <div class="absolute -top-1 -right-1 w-3 h-3 rounded-full ${hasAvailability ? 'bg-green-400' : 'bg-red-400'} border border-white"></div>
           </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  return (
    <Marker position={[facility.lat, facility.lng]} icon={icon}>
      <Popup>
        <div className="p-2 space-y-2 text-white" style={{ minWidth: 170 }}>
          <p className="text-xs text-white/40 font-bold uppercase tracking-wider">
            {facility.emoji} {facility.sportLabel}
          </p>
          <h4 className="font-bold text-sm leading-tight">{facility.name}</h4>
          <p className="text-[10px] text-white/50">
            📍 {facility.distance?.toFixed(1)}km · 평점 {facility.rating}
          </p>
          <p className="text-xs font-black text-green-400 pt-1">
            ₩{facility.price.toLocaleString()} / 시간
          </p>
          <button
            onClick={onSelect}
            className="w-full mt-2 btn-primary py-1.5 rounded-lg text-xs font-bold text-center text-white block"
          >
            상세보기
          </button>
        </div>
      </Popup>
    </Marker>
  );
}
