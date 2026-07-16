import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import FacilityMarker from './FacilityMarker';
import UserMarker from './UserMarker';

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
}

export default function MapView({ userLocation, facilities, onSelectFacility, onRequestLocation }) {
  const center = [userLocation.lat, userLocation.lng];

  return (
    <section className="flex-1 h-full z-10 relative">
      <MapContainer
        center={center}
        zoom={14}
        zoomControl={false}
        attributionControl={false}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" maxZoom={20} />
        <MapController center={center} zoom={14} />
        <UserMarker position={center} />
        {facilities.map((fac) => (
          <FacilityMarker key={fac.id} facility={fac} onSelect={() => onSelectFacility(fac)} />
        ))}
      </MapContainer>

      <button
        onClick={onRequestLocation}
        className="absolute bottom-6 right-6 z-[1000] w-12 h-12 bg-dark-800 border border-white/10 hover:border-green-500/30 text-white rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group"
      >
        <svg className="w-5 h-5 text-white/70 group-hover:text-green-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </section>
  );
}
