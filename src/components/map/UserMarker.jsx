import { Marker } from 'react-leaflet';
import L from 'leaflet';

export default function UserMarker({ position }) {
  const icon = L.divIcon({
    className: 'user-location-marker',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  return <Marker position={position} icon={icon} />;
}
