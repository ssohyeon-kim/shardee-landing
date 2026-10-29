# 샤디 로컬 미디어

2026-10-30 원본 `https://slashpage.com/shardee`의 HTML과 Chrome 실제 화면을 확인했다. 원본은 charcoal 배경·흰 글씨의 dark theme이며, 상단에는 테마파크 영상을 사용한 커버가 나온다. 앱의 실제 아이콘은 검정 배경 위 흰 셔터와 파랑→분홍→주황 그라데이션 링이다. 별도 브랜드 컬러를 임의로 만들지 않았다.

`asset-sources.json`에 모든 로컬 원본과 파생 이미지의 출처, 수집 시각, MIME, 해상도, 파일 크기, SHA-256, 사용 위치를 기록했다. 일반 빌드 및 페이지 방문에는 외부 미디어 요청이 필요 없다.

## 선택한 미디어

- **Hero:** 원본은 620×300, 약 7.2 MB의 animated WebP다. 원본 120프레임과 프레임별 시간을 보존해 H.264/무음/faststart MP4 `public/media/hero.mp4`(620×300, 5.04초, 620,713바이트)로 변환했다. 히어로 오른쪽에서 원본 너비 이내로 무음 반복 재생하며 일시정지 버튼을 제공한다. 첫 프레임 PNG는 동작 줄이기 설정과 자동 재생 제한 시 포스터로 사용한다. `hero.webp`는 수집 원본으로 보관하고 페이지에서는 import하지 않는다. 실제 원본의 텍스트가 이미지 안에 포함되어 있다.
- **촬영:** 원본 공개 동영상의 실제 포스터 1080×1920 JPEG를 사용한다. 셔터와 카페 촬영 화면이 포함되어 기능을 설명한다.
- **편집:** 원본의 1140×2014 WebP를 사용한다. 투명 배경이며 영상 선택·이어 붙이기 화면이 포함되어 있다.
- **저장:** 원본 공개 동영상의 실제 포스터 1870×1108 JPEG를 사용한다. 원본과 같은 세 개 여행 장면이다.
- **기능 소개:** 외부 플레이어 없이 확보한 로컬 정지 이미지로 소개한다. 촬영·저장 포스터는 정상 공개 URL에서 HTTP 200 및 이미지 시그니처를 확인했다. 원본의 playlist URL도 HTML에서 확인했으나 채택하지 않았으므로 영상 다운로드나 외부 의존성이 없다.

Astro의 `Image` 컴포넌트에서 페이지 표시 크기에 맞춰 빌드 시 WebP 등을 생성한다. 첫 화면 주 이미지에만 높은 우선순위를 주고, 기능 이미지는 지연 로딩한다.

## 브랜드 및 스토어 배지

- 앱 아이콘: Apple 공식 lookup API `https://itunes.apple.com/lookup?id=6739505769&country=kr`가 돌려준 실제 `artworkUrl512`를 다운로드했다. favicon 64×64 및 Apple touch icon 180×180은 이 아이콘을 비율 변경 없이 리사이즈한 것이다. 원본 Slashpage의 favicon은 Slashpage 기본 마크이므로 이관하지 않았다.
- OG: 원본 커버의 정지 프레임을 로컬 PNG로 사용한다. 생성형 이미지나 가짜 앱 화면은 사용하지 않는다.
- App Store: [Apple Marketing Resources and Identity Guidelines](https://developer.apple.com/app-store/marketing/guidelines/)에서 제공하는 공식 SVG를 변형하지 않고 사용한다. 최소 높이 40px와 충분한 주변 여백을 유지한다.
- Google Play: [Google Play Lockups, icons & badges](https://partnermarketinghub.withgoogle.com/brands/google-play/google-play/lockups-icons-badges/) 및 공식 공개 Korean badge URL의 PNG를 변형하지 않고 사용한다. PNG에 포함된 투명 여백을 유지하며, Apple 배지와 시각적 높이를 맞춘다. SVG 파일로 가장하지 않고 실제 `.png` 확장자를 사용한다.
- 추가 폰트를 다운로드하지 않는다. 시스템 글꼴을 사용하므로 원격 폰트 요청이 없다.

`public/media/hero.mp4`는 원본 커버에서 변환한 소개 영상이다. 외부 영상 iframe, 원본 CDN 이미지 hotlink, 응원·댓글 아바타는 페이지에 포함하지 않는다. 미확보 필수 자산은 없다.
