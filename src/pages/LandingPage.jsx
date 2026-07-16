import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-900 text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
        </div>

        <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl btn-primary flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
            <span className="text-2xl font-bold font-display gradient-text">스포츠N</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/map?action=login" className="text-sm font-semibold text-white/70 hover:text-white transition-colors">
              로그인
            </Link>
            <Link to="/map" className="btn-primary text-sm font-bold px-5 py-2.5 rounded-xl text-white">
              지도에서 찾기
            </Link>
          </div>
        </nav>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 glass-light px-4 py-2 rounded-full text-xs font-semibold text-green-400 border border-green-500/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            실시간 예약 가능 시설 20+ 곳
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-display leading-tight mb-6">
            주변 체육시설을
            <br />
            <span className="gradient-text">한 번에 예약</span>하세요
          </h1>

          <p className="text-base md:text-lg text-white/50 max-w-2xl mb-10 leading-relaxed">
            풋살, 테니스, 배드민턴, 농구 등 생활체육 시설을 GPS 기반으로 검색하고
            실시간 빈자리 확인부터 결제까지 One-Stop으로 이용하세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              to="/map"
              className="btn-primary text-base font-bold px-8 py-4 rounded-2xl text-white flex items-center justify-center gap-2 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              지도에서 시설 찾기
            </Link>
            <Link
              to="/map?action=signup"
              className="glass-light text-base font-bold px-8 py-4 rounded-2xl text-white/80 hover:text-white border border-white/10 flex items-center justify-center gap-2"
            >
              무료 회원가입
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-4">
            <span className="gradient-text">스포츠N</span> 핵심 기능
          </h2>
          <p className="text-white/40 text-center mb-16 text-sm">생활체육 예약의 모든 것을 하나의 앱에서</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '📍', title: '위치 기반 검색', desc: 'GPS 기반 반경 5km 이내 체육시설 실시간 조회' },
              { icon: '📅', title: '실시간 예약', desc: '날짜/시간별 타임블록 확인 및 즉시 예약' },
              { icon: '💳', title: '간편 결제', desc: 'PortOne 연동 카드/간편결제 원스톱 처리' },
              { icon: '📱', title: 'QR 입장', desc: '예약 완료 시 QR 코드 생성 및 알림 발송' },
            ].map((feature) => (
              <div key={feature.title} className="glass-light rounded-2xl p-6 border border-white/5 hover:border-green-500/20 transition-all">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sports Section */}
      <section className="py-24 px-6 md:px-12 bg-dark-800/50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-12">지원 종목</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { emoji: '⚽', label: '풋살' },
              { emoji: '🎾', label: '테니스' },
              { emoji: '🏸', label: '배드민턴' },
              { emoji: '🏀', label: '농구' },
            ].map((sport) => (
              <Link
                key={sport.label}
                to={`/map?sport=${sport.label}`}
                className="glass-light px-8 py-6 rounded-2xl border border-white/5 hover:border-green-500/30 transition-all flex flex-col items-center gap-2 min-w-[120px]"
              >
                <span className="text-4xl">{sport.emoji}</span>
                <span className="font-bold text-sm">{sport.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto glass rounded-3xl p-10 border border-green-500/20">
          <h2 className="text-2xl md:text-3xl font-black mb-4">지금 바로 시작하세요</h2>
          <p className="text-white/50 text-sm mb-8">회원가입 없이도 시설 검색이 가능합니다. 예약은 로그인 후 이용하세요.</p>
          <Link to="/map" className="btn-primary inline-block text-base font-bold px-10 py-4 rounded-2xl text-white">
            앱 시작하기 →
          </Link>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-white/5 text-center text-xs text-white/30">
        <p>© 2026 스포츠N. All rights reserved.</p>
      </footer>
    </div>
  );
}
