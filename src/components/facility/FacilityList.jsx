import SearchBar from './SearchBar';
import FilterBar from './FilterBar';
import FacilityCard from './FacilityCard';
import LocationInput from '../map/LocationInput';

export default function FacilityList({
  facilities,
  filters,
  onFilterChange,
  onSelectFacility,
  onLocationChange,
  onRequestGps,
}) {
  return (
    <aside className="w-full md:w-[420px] shrink-0 h-full border-r border-white/5 flex flex-col z-20 relative glass">
      <div className="p-5 space-y-4 border-b border-white/5">
        <LocationInput onLocationChange={onLocationChange} onRequestGps={onRequestGps} />
        <SearchBar
          value={filters.searchQuery}
          onChange={(v) => onFilterChange({ searchQuery: v })}
        />
        <FilterBar filters={filters} onFilterChange={onFilterChange} />
      </div>

      <div className="flex-1 overflow-y-auto custom-scroll p-4 space-y-3">
        {facilities.length === 0 ? (
          <div className="text-center py-10 text-white/30 space-y-2">
            <p className="text-3xl">🔍</p>
            <p className="text-sm">조건에 맞는 체육시설이 없습니다.</p>
          </div>
        ) : (
          facilities.map((fac) => (
            <FacilityCard key={fac.id} facility={fac} onSelect={() => onSelectFacility(fac)} />
          ))
        )}
      </div>
    </aside>
  );
}
