const SPORT_IMAGES = {
  futsal: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&h=200&fit=crop',
  tennis: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=200&h=200&fit=crop',
  badminton: 'https://images.unsplash.com/photo-1626224583764-f87db7ac1d91?w=200&h=200&fit=crop',
  basketball: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=200&h=200&fit=crop',
};

function generateReviews(facilityId, count) {
  const authors = ['김민수', '이지현', '박준호', '최서연', '정우진', '한소희'];
  const comments = [
    '시설이 깨끗하고 직원분들도 친절해요!',
    '주차가 편하고 코트 상태가 좋습니다.',
    '가격 대비 만족스러운 시설이에요.',
    '야간 조명이 밝아서 운동하기 좋아요.',
    '샤워실이 넓고 쾌적합니다.',
    '예약 시스템이 편리해서 자주 이용합니다.',
  ];

  return Array.from({ length: Math.min(count, 5) }, (_, i) => ({
    id: `${facilityId}-review-${i}`,
    author: authors[(facilityId + i) % authors.length],
    rating: 4 + ((facilityId + i) % 2) * 0.5,
    date: `2026-0${((i % 6) + 1)}-${String(10 + i).padStart(2, '0')}`,
    comment: comments[(facilityId + i) % comments.length],
  }));
}

export function generateFacilitiesAround(lat, lng) {
  const sports = [
    {
      type: 'futsal',
      emoji: '⚽',
      label: '풋살',
      names: ['강남 풋살파크', '서초 그린 풋살', '반포 스카이 풋살', '양재 탑 풋살', '잠실 스타 풋살', '여의도 한강 풋살'],
    },
    {
      type: 'tennis',
      emoji: '🎾',
      label: '테니스',
      names: ['서초 테니스클럽', '역삼 실내 테니스', '도곡 에이스 테니스', '방배 라켓 스페이스', '압구정 테니스파크'],
    },
    {
      type: 'badminton',
      emoji: '🏸',
      label: '배드민턴',
      names: ['역삼 배드민턴 클럽', '도곡 스매시 홀', '방배 실내 배드민턴', '청담 클레이 짐', '삼성 배드민턴 코트'],
    },
    {
      type: 'basketball',
      emoji: '🏀',
      label: '농구',
      names: ['대치동 훕스 존', '삼성 바스켓 아레나', '역삼 농구 클럽', '양재 농구 짐'],
    },
  ];

  const amenitiesList = ['🚿 샤워실', '🅿️ 주차장', '👟 장비대여', '💡 야간조명', '❄️ 냉난방', '🥤 음료판매'];
  const facilitiesTemp = [];
  let globalIndex = 1;

  sports.forEach((sportObj) => {
    sportObj.names.forEach((name) => {
      const angle = (globalIndex * 137.5 * Math.PI) / 180;
      const radius = 0.005 + globalIndex * 0.0035;
      const fLat = lat + Math.sin(angle) * radius;
      const fLng = lng + Math.cos(angle) * radius;

      let price = 25000;
      if (sportObj.type === 'tennis') price = 18000;
      else if (sportObj.type === 'badminton') price = 12000;
      else if (sportObj.type === 'basketball') price = 20000;
      price += (globalIndex % 3) * 3000;

      const timeSlots = [];
      for (let d = 0; d < 3; d++) {
        const daySlots = [];
        for (let h = 8; h < 22; h++) {
          const r = (globalIndex + d + h) % 10;
          let state = 'available';
          if (r < 2) state = 'full';
          else if (r < 4) state = 'few';

          daySlots.push({
            time: `${String(h).padStart(2, '0')}:00 - ${String(h + 1).padStart(2, '0')}:00`,
            state,
          });
        }
        timeSlots.push(daySlots);
      }

      const amenities = amenitiesList.filter((_, idx) => (globalIndex + idx) % 2 === 0);
      const reviewCount = 30 + ((globalIndex * 7) % 150);

      facilitiesTemp.push({
        id: globalIndex++,
        name,
        sport: sportObj.type,
        emoji: sportObj.emoji,
        sportLabel: sportObj.label,
        image: SPORT_IMAGES[sportObj.type],
        lat: fLat,
        lng: fLng,
        address: `서울시 특별구 스포츠로 ${globalIndex * 14}길`,
        rating: (4.0 + (globalIndex % 11) * 0.1).toFixed(1),
        reviewCount,
        reviews: generateReviews(globalIndex, reviewCount),
        price,
        amenities,
        timeSlots,
        description: `${name}은 최고의 품질과 쾌적한 운동 환경을 제공합니다.`,
        phone: `02-1234-${String(globalIndex * 99).padStart(4, '0')}`,
        operatingHours: '08:00 - 22:00',
      });
    });
  });

  return facilitiesTemp;
}

export function getDefaultUsers() {
  return [
    { name: '홍길동', email: 'test@test.com', phone: '010-1234-5678', password: '123', role: 'user' },
    { name: '관리자', email: 'admin@test.com', phone: '010-1111-2222', password: '123', role: 'admin' },
  ];
}
