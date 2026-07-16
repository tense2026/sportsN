import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function AuthModal({ isOpen, initialTab = 'login', onClose }) {
  const { login, register, loginWithGoogle, isFirebaseEnabled } = useAuth();
  const [tab, setTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) setTab(initialTab);
  }, [isOpen, initialTab]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    try {
      await login({
        email: form.email.value.trim(),
        password: form.password.value,
      });
      toast.success('로그인 성공!');
      onClose();
    } catch (err) {
      toast.error(err.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    try {
      await register({
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        password: form.password.value,
      });
      toast.success('회원가입이 완료되었습니다! 로그인해 주세요.');
      setTab('login');
    } catch (err) {
      toast.error(err.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await loginWithGoogle();
      toast.success(`환영합니다, ${user.displayName || user.email}님!`);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Google 로그인 실패');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-md mx-4 glass rounded-3xl p-6 border border-white/10 relative overflow-hidden flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white text-xl">
          ✕
        </button>

        <div className="flex border-b border-white/10 mb-6">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 text-center ${
              tab === 'login' ? 'border-green-500 text-green-400' : 'border-transparent text-white/50'
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 text-center ${
              tab === 'register' ? 'border-green-500 text-green-400' : 'border-transparent text-white/50'
            }`}
          >
            회원가입
          </button>
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-white/50 font-medium">이메일 주소</label>
              <input name="email" type="email" required placeholder="example@email.com" className="w-full glass-light border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-green-500/50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-white/50 font-medium">비밀번호</label>
              <input name="password" type="password" required placeholder="비밀번호 입력" className="w-full glass-light border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-green-500/50" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 rounded-xl text-sm font-bold text-white mt-4 disabled:opacity-50">
              {loading ? '로그인 중...' : '로그인하기'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-white/50 font-medium">이름</label>
              <input name="name" type="text" required placeholder="이름 입력" className="w-full glass-light border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-green-500/50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-white/50 font-medium">이메일 주소</label>
              <input name="email" type="email" required placeholder="example@email.com" className="w-full glass-light border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-green-500/50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-white/50 font-medium">휴대폰 번호</label>
              <input name="phone" type="tel" required placeholder="010-0000-0000" className="w-full glass-light border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-green-500/50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-white/50 font-medium">비밀번호</label>
              <input name="password" type="password" required placeholder="비밀번호 설정" className="w-full glass-light border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-green-500/50" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 rounded-xl text-sm font-bold text-white mt-4 disabled:opacity-50">
              {loading ? '가입 진행 중...' : '회원가입하기'}
            </button>
          </form>
        )}

        {tab === 'login' && isFirebaseEnabled && (
          <div className="mt-4 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 transition-colors py-3.5 rounded-xl text-sm font-bold text-white border border-white/10"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google 계정으로 로그인
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
