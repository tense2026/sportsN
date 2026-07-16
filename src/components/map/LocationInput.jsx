import { useState } from 'react';
import toast from 'react-hot-toast';
import { geocodeAddress, parseCoordinates } from '../../utils/geocoding';

export default function LocationInput({ onLocationChange, onRequestGps }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      toast.error('위치를 입력해 주세요.');
      return;
    }

    const coords = parseCoordinates(trimmed);
    if (coords) {
      onLocationChange(coords.lat, coords.lng);
      toast.success('입력한 좌표로 이동했습니다.');
      return;
    }

    setLoading(true);
    try {
      const result = await geocodeAddress(trimmed);
      onLocationChange(result.lat, result.lng);
      toast.success(result.displayName);
    } catch (err) {
      toast.error(err.message || '위치를 찾을 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="glass-light rounded-xl px-3 py-2 flex items-center gap-2 focus-within:border-green-500/50 transition-all border border-white/5">
        <svg className="w-4 h-4 text-white/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="주소 또는 위·경도 (예: 강남역)"
          disabled={loading}
          className="bg-transparent flex-1 text-sm text-white outline-none placeholder:text-white/30 min-w-0"
        />
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-500/20 text-green-400 hover:bg-green-500/30 disabled:opacity-50 transition-colors"
        >
          {loading ? '검색 중' : '이동'}
        </button>
      </div>
      <button
        type="button"
        onClick={onRequestGps}
        className="w-full text-xs text-white/50 hover:text-green-400 transition-colors text-left"
      >
        📍 현재 GPS 위치 사용
      </button>
    </form>
  );
}
