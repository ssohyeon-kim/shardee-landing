export const site = {
  brand: 'Shardee',
  koreanName: '샤디',
  description: '빠르고 쉽게 짧은 동영상을 촬영하는 1초 카메라 앱, 샤디. 소중한 순간을 찍고, 이어 붙이고, 나만의 이야기로 저장하세요.',
  email: 'untitledshatter@gmail.com',
  stores: {
    apple: 'https://apps.apple.com/kr/app/id6739505769',
    google: 'https://play.google.com/store/apps/details?id=com.shardee.aos',
  },
  links: { home: '/', faq: '/faq/', privacy: '/privacy/', terms: '/terms/' },
  business: {
    name: '디아로', registration: '308-13-16385', commerce: '제2025-서울강남-02765호',
    representative: '김소현', privacyOfficer: '김소현',
    address: '서울특별시 강남구 테헤란로70길 12, 402-401A호(대치동, H타워)',
    contacts: [
      { name: '김소현', email: 'ssohyeonkim@gmail.com' },
      { name: '채혜진', email: 'hjin9a@naver.com' },
    ],
  },
} as const;
