export default function SearchBar({ value, onChange }) {
  return (
    <div className="glass-light rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-green-500/50 transition-all border border-white/5">
      <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="시설명 또는 주소 검색..."
        className="bg-transparent flex-1 text-sm text-white outline-none placeholder:text-white/30"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="text-white/30 hover:text-white text-xs"
        >
          ✕
        </button>
      )}
    </div>
  );
}
