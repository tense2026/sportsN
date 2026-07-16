import { useState, useEffect } from 'react';

const DEFAULT_LOCATION = { lat: 37.4979, lng: 127.0276 };

export function useGeolocation() {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const requestLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setLoading(false);
      setError('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setError(err.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const setManualLocation = (lat, lng) => {
    setLocation({ lat, lng });
    setLoading(false);
    setError(null);
  };

  return { location, loading, error, requestLocation, setLocation: setManualLocation };
}
