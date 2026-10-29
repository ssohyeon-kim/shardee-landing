// Collected source content; answers are escaped, allowlisted HTML compiled from the local source snapshot.
// No external content is fetched at build time or in the browser.
export interface FaqItem { id: string; category: string; question: string; answer: string; sourceBlockId: string; }
export const faqIntroduction = [
  {
    "heading": true,
    "text": "📷 샤디 앱을 소개해요.",
    "lang": "ko"
  },
  {
    "heading": false,
    "text": "‘샤디'는 일상의 순간을 더욱 쉽게 기록하고 특별하게 남길 수 있는 초간단 동영상 제작 앱입니다. 0.5초, 1초, 2초 단위로 짧은 순간을 동영상으로 촬영하여 자동으로 하나의 영상으로 연결하고 완성해 보세요. 샤디는 단순 촬영부터 편집, 랜더링까지 앱 내에서 한 번에 해결할 수 있어 일상 속 특별한 순간을 놓치지 않고 담을 수 있습니다.",
    "lang": "ko"
  },
  {
    "heading": true,
    "text": "Introducing Shardee.",
    "lang": "en"
  },
  {
    "heading": false,
    "text": "Shardee is a super-simple video camera app that makes it easy to capture and preserve everyday moments in a special way. Record short clips in increments of 0.5 seconds, 1 second, or 2 seconds, and seamlessly combine them into one complete video. Shardee handles everything from shooting to editing and rendering all within the app, so you can effortlessly capture and cherish the special moments of your daily life.",
    "lang": "en"
  }
] as const;
export const faqNotices = [
  "클립 합치기 기능은 샤디 찍은 영상을 이용하기를 권장합니다. 다른 카메라로 촬영된 영상을 합치는 경우 일부 불러오지 못하거나 오류가 발생할 수 있습니다.",
  "클립을 합치는 기능에 시간과 클립 수에 제한은 없으나 너무 긴 영상길이 혹은 많은 클립 갯수를 선택한 경우 앱이 강제 종료될 수 있습니다.",
  "We recommend using videos taken with Shardee for the clip-merging feature. If you merge videos recorded with other cameras, some clips may fail to load, or errors could occur.",
  "There are no time or clip number limits for the clip-merging feature. However, selecting excessively long video durations or too many clips may cause the app to crash."
] as const;
export const faqEnglishUrl = "https://slashpage.com/shardee/4z7pvx2kz1jw1mek8653";
export const faqItems: FaqItem[] = [
  {
    "id": "question-1",
    "category": "가격·프리미엄",
    "question": "샤디는 유료인가요?",
    "answer": "<ul><li>샤디 앱은 다운로드와 기본 기능인 짧게 찍고 이어붙이기, 자막쓰기는 무료로 이용하실 수 있어요.</li></ul>",
    "sourceBlockId": "01jen8arksy628vs9q1gh5g7j1"
  },
  {
    "id": "question-2",
    "category": "가격·프리미엄",
    "question": "프리미엄 기능은 무엇인가요?",
    "answer": "<ul><li>프리미엄 기능은 유료로 구매하신 분들에게 제공되고 있어요.<ul><li>자동 줌 인/아웃 촬영 모드: 촬영 시 자동으로 줌 인/아웃으로 촬영되어 더 역동적인 영상을 만들 수 있어요.</li><li>레이아웃 촬영 모드: 2분할/3분할 레이아웃 모드로 촬영할 수 있어요.</li><li>듀얼 모드: 전/후면 카메라를 동시에 사용하여 촬영할 수 있어요.</li><li>시간 버튼 추가: 커스텀하여 사용할 수 있는 시간 버튼을 추가로 제공해 드려요.</li></ul></li></ul>",
    "sourceBlockId": "01kpmrnpy41brq641yqmhqah4a"
  },
  {
    "id": "question-3",
    "category": "촬영",
    "question": "동영상을 2초보다 길게 촬영하고 싶어요.",
    "answer": "<ul><li>0.5s와 1s 버튼은 고정이며 2s로 이동 후 한번 더 버튼을 터치하면 시간을 조정할 수 있는 슬라이드가 나타나요. 2s - 10s까지 자유롭게 조정하여 촬영할 수 있어요.</li></ul>",
    "sourceBlockId": "01kpqqtkfynr09wx28fn27zah4"
  },
  {
    "id": "question-4",
    "category": "저장",
    "question": "샤디로 찍은 동영상은 어디에 저장되나요?",
    "answer": "<ul><li>휴대폰 사진첩에 바로 저장됩니다. 샤디는 여러분들이 찍은 영상을 따로 저장하거나 소유하고 있지 않습니다.</li></ul>",
    "sourceBlockId": "01jen8arktr0dpes8j80e61hrw"
  },
  {
    "id": "question-5",
    "category": "저장",
    "question": "기기에서 영상을 삭제하면 어떻게 되나요?",
    "answer": "<ul><li>샤디로 찍은 영상은 기기에서만 저장하고 있어요. 기기에서 영상을 삭제하는 경우 앱에서 불러오거나 복구할 수 없어요.</li></ul>",
    "sourceBlockId": "01jen8arkthhtmvvtqwm35pbt8"
  },
  {
    "id": "question-6",
    "category": "편집",
    "question": "편집할 때 클립의 순서를 변경하고 싶어요.",
    "answer": "<ul><li>클립 순서를 변경하고 싶다면 클립을 꾹 누른채 원하는 위치로 옮겨주면 클립이 이동해요.</li></ul>",
    "sourceBlockId": "01jeyzh2x9p0sc80c2ns1mevd2"
  },
  {
    "id": "question-7",
    "category": "저장",
    "question": "랜더링이 완성된 영상은 어디에 저장되나요?",
    "answer": "<ul><li>샤디로 만든 영상도 기기에 저장됩니다.</li></ul>",
    "sourceBlockId": "01jen8arkvh1a8hy21amyrjb39"
  },
  {
    "id": "question-8",
    "category": "편집",
    "question": "편집 영상 시간 제한이나 갯수 제한이 있나요?",
    "answer": "<ul><li>영상 길이나 클립의 갯수에 대한 제한은 없으나 과도한 길이나 영상 갯수는 앱이 강제 종료될 수 있어요.</li><li>이어붙일 때 최대 영상 길이는 30-60초 사이로 이용하는 걸 추천해요.</li></ul>",
    "sourceBlockId": "01jen8arkw0pgkx4nbqa3qxg73"
  },
  {
    "id": "question-9",
    "category": "편집",
    "question": "영상을 임시 저장하고 싶어요.",
    "answer": "<ul><li>편집을 종료하기 위해 왼쪽 상단 X 버튼을 클릭하면 만들기 중인 영상을 저장할 수 있어요.</li><li>영상을 이어붙이기 한 뒤 앱을 임의로 종료하면 만들던 영상은 별도로 임시 저장처리되어요.</li></ul>",
    "sourceBlockId": "01jen8arkxxqg2rtyataten51m"
  },
  {
    "id": "question-10",
    "category": "구매·환불",
    "question": "결제한 상품을 환불하고 싶어요.",
    "answer": "<ul><li>구매하신 인앱 상품의 환불 가능 여부와 처리 방식은 결제하신 스토어 정책에 따라 환불을 요청하실 수 있어요. 아래 안내에 따라 해당 스토어에서 환불을 요청해 주세요.</li><li>접수 후에는 보통 24~48시간 안에 진행 상황을 확인하실 수 있습니다. 승인된 경우 실제 환불 금액이 결제 수단에 반영되기까지는 결제 수단별로 추가 시간이 걸릴 수 있습니다.<ul><li>App Store로 결제한 경우</li></ul><p>Apple에서 환불 요청을 접수하고 검토합니다. 아래 순서로 진행해 주세요.</p><ul><li><a href=\"https://reportaproblem.apple.com/\">reportaproblem.apple.com</a>에 로그인해 주세요.</li><li>문제 선택에서 환불 요청을 선택해 주세요.</li><li>환불 사유를 선택한 뒤, 환불을 원하는 구매 항목을 선택해 제출해 주세요.</li></ul><ul><li>Google Play로 결제한 경우</li></ul><p>안내에 따라 Google Play를 통해 환불 신청을 부탁드립니다.</p><ul><li><a href=\"https://play.google.com/\">play.google.com</a>에 접속해 결제한 Google 계정으로 로그인해 주세요.</li><li>우측 상단 프로필에서 결제 및 정기 결제 &gt; 예산 및 주문 내역으로 이동해 주세요.</li><li>환불을 원하는 주문에서 문제 신고를 선택해 주세요.</li><li>사유를 선택하고 환불 요청을 제출해 주세요.</li></ul></li></ul>",
    "sourceBlockId": "01kpmtcmcmry42jtfj9c86c38h"
  },
  {
    "id": "question-11",
    "category": "권한·문제 해결",
    "question": "촬영이 되지 않아요.",
    "answer": "<ul><li>카메라 접근 권한을 확인해 주세요. 접근 권한이 없다면 카메라 권한을 허용해 주세요. 아이폰 설정 - 샤디 앱에서 확인하실 수 있어요</li></ul>",
    "sourceBlockId": "01jen8f08hpv2870gjcb0kje52"
  },
  {
    "id": "question-12",
    "category": "권한·문제 해결",
    "question": "소리가 녹음되지 않아요.",
    "answer": "<ul><li>마이크 접근 권한을 확인해 주세요. 접근 권한이 없다면 마이크 권한을 허용해 주세요. 아이폰 설정 - 샤디 앱에서 확인하실 수 있어요.</li></ul>",
    "sourceBlockId": "01jen8f08hjszm7c8csmnnmkfm"
  },
  {
    "id": "question-13",
    "category": "권한·문제 해결",
    "question": "촬영된 영상에서 끊김 현상이 발생해요.",
    "answer": "<ul><li>일부 휴대폰에서 4k로 찍거나 카메라 안정화 기능이 OFF된 경우 촬영된 영상의 프레임 드랍현상이 발생하고 있어요. 해상도를 1080k로 변경하거나 카메라 안정화 기능을 ON해 주세요.</li></ul>",
    "sourceBlockId": "01jen8f08jhhsxcx34nfpf9a8e"
  },
  {
    "id": "question-14",
    "category": "권한·문제 해결",
    "question": "갤러리에서 영상이 불러와 지지 않아요.  휴대폰 설정 - 샤디 앱에서 확인하실 수 있어요.",
    "answer": "<ul><li>갤러리 접근 권한을 확인해 주세요. 접근 권한이 없다면 접근 권한을 허용해 주세요.  아이폰 설정 - 샤디 앱에서 확인하실 수 있어요.</li></ul>",
    "sourceBlockId": "01jen8f08k2g0j9zkddhd5nxqc"
  },
  {
    "id": "question-15",
    "category": "편집",
    "question": "갤러리에서 사진도 불러올 수 있나요?",
    "answer": "<ul><li>이제 영상과 함께 촬영한 사진을 불러올 수 있어요 라이브 포토, 모션 포토로 촬영된 사진은 영상으로 자동 변환되어 불러올 수 있어요.</li></ul>",
    "sourceBlockId": "01jen8f08khj6ztfm7m6ptsryp"
  },
  {
    "id": "question-16",
    "category": "저장",
    "question": "이어붙이기 완료한 영상이 1080p로만 저장되어요.",
    "answer": "<ul><li>이어붙이기에서는 해상도를 1080p만 제공하고 있어요. 4k영상을 불러오더라도 내보내기를 진행하면 1080p로 저장되어요.</li></ul>",
    "sourceBlockId": "01kpqr8vp4m68cv0dc8aph31z5"
  },
  {
    "id": "question-17",
    "category": "권한·문제 해결",
    "question": "동영상이 저장되지 않아요.",
    "answer": "<ul><li>휴대폰의 저장 공간을 확인해 주세요. 휴대폰 저장 공간이 충분하지 않다면 동영상이 촬영되지 않거나 저장되지 않을 수 있어요.</li></ul>",
    "sourceBlockId": "01jen8f08mrcf7taq58h54t7ef"
  },
  {
    "id": "question-18",
    "category": "촬영",
    "question": "딱 1초가 아니에요.",
    "answer": "<ul><li>동영상은 셔터 속도에 따라 1.2초 ~ 1.4초가 저장되고 있어요. 초 설정에 따라 아래와 같이 촬영될 수 있어요.<ul><li>0.5초 : 0.4초 ~ 0.5초</li><li>1초 : 1초 ~ 1.4초</li><li>2초 : 2초 ~ 2.4초</li></ul></li></ul>",
    "sourceBlockId": "01jen8f08psnxjsft4n8md5mc8"
  }
];
export const faqCategories = [...new Set(faqItems.map((item) => item.category))];
