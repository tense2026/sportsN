export function parseCoordinates(input) {
  const match = input.trim().match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/);
  if (!match) return null;

  const lat = parseFloat(match[1]);
  const lng = parseFloat(match[2]);

  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

  return { lat, lng };
}

export async function geocodeAddress(query) {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', query);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '1');
  url.searchParams.set('countrycodes', 'kr');

  const res = await fetch(url, {
    headers: { 'Accept-Language': 'ko' },
  });

  if (!res.ok) {
    throw new Error('주소 검색에 실패했습니다.');
  }

  const data = await res.json();
  if (!data.length) {
    throw new Error('해당 주소를 찾을 수 없습니다.');
  }

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    displayName: data[0].display_name,
  };
}
