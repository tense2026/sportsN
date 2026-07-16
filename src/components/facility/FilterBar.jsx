const SPORTS = [
  { id: 'all', label: '전체' },
  { id: 'futsal', label: '⚽ 풋살' },
  { id: 'tennis', label: '🎾 테니스' },
  { id: 'badminton', label: '🏸 배드민턴' },
  { id: 'basketball', label: '🏀 농구' },
];

export default function FilterBar({ filters, onFilterChange }) {
  return (
    <>
      <div className="flex flex-wrap gap-1.5">
        {SPORTS.map((sport) => (
          <button
            key={sport.id}
            onClick={() => onFilterChange({ sport: sport.id })}
            className={`sport-tag px-3.5 py-1.5 rounded-xl text-xs font-semibold ${
              filters.sport === sport.id ? 'active' : ''
            }`}
          >
            {sport.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <select
          value={filters.radius}
          onChange={(e) => onFilterChange({ radius: parseInt(e.target.value) })}
          className="bg-dark-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none flex-1 cursor-pointer"
        >
          <option value={5000} className="bg-dark-800 text-white">반경 5km 이내</option>
          <option value={1000} className="bg-dark-800 text-white">반경 1km 이내</option>
          <option value={3000} className="bg-dark-800 text-white">반경 3km 이내</option>
          <option value={10000} className="bg-dark-800 text-white">반경 10km 이내</option>
        </select>
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ sortBy: e.target.value })}
          className="bg-dark-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none flex-1 cursor-pointer"
        >
          <option value="distance" className="bg-dark-800 text-white">거리 가까운순</option>
          <option value="rating" className="bg-dark-800 text-white">평점 높은순</option>
          <option value="price" className="bg-dark-800 text-white">가격 낮은순</option>
        </select>
      </div>

      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={filters.onlyAvailable}
          onChange={(e) => onFilterChange({ onlyAvailable: e.target.checked })}
          className="rounded accent-green-500 w-4 h-4"
        />
        <span className="text-xs text-white/60">현재 예약 가능한 타임이 있는 시설만 보기</span>
      </label>
    </>
  );
}
