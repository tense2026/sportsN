import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminToggle from '../admin/AdminToggle';

export default function Header({ onOpenAuth, onOpenMyBookings }) {
  const { currentUser, loading, logout, isAdmin } = useAuth();

  return (
    <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 z-30 relative glass">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center shadow">
          <svg className="w-4.5 h-4.5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </div>
        <span className="text-lg font-bold font-display gradient-text tracking-tight">스포츠N</span>
      </Link>

      <div className="flex items-center gap-3">
        {loading ? (
          <div className="w-4 h-4 rounded-full border-2 border-green-500 border-t-transparent animate-spin" />
        ) : currentUser ? (
          <>
            {isAdmin && <AdminToggle />}
            <button
              onClick={onOpenMyBookings}
              className="glass-light text-xs font-semibold px-4 py-2 rounded-xl text-green-400 border border-green-500/20 hover:bg-green-500/10"
            >
              내 예약
            </button>
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-white/80">
                👤 {currentUser.name}님
                {isAdmin && (
                  <span className="text-[9px] bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded font-bold ml-1">
                    ADMIN
                  </span>
                )}
              </p>
              <p className="text-[10px] text-white/40">{currentUser.email}</p>
            </div>
            <button
              onClick={logout}
              className="text-xs font-bold text-white/40 hover:text-red-400 transition-colors"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onOpenAuth('login')}
              className="text-xs font-semibold px-4 py-2 rounded-xl text-green-400 hover:text-green-300"
            >
              로그인
            </button>
            <button
              onClick={() => onOpenAuth('register')}
              className="btn-primary text-xs font-semibold px-4 py-2 rounded-xl text-white"
            >
              회원가입
            </button>
          </>
        )}
      </div>
    </header>
  );
}
