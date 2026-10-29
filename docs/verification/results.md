# 구현 검증 결과

2026-10-30, macOS, Node 24.14.1 / npm 11.11.0. 구현 범위는 계획서의 로컬 소스·정적 산출물 준비이며 공개 배포·DNS 변경은 수행하지 않았다.

## 자동 검증

최종 소스에서 `npm ci`, `npm run check`, `npm run build`, `npm test` 모두 성공했다. Astro 검사는 오류·경고·힌트 0개였고, 테스트 3개가 통과했다. 빌드 시 원본 페이지/CDN 접근 없이 로컬 콘텐츠·이미지만으로 생성한다.

| 요구 | 증거와 결과 |
| --- | --- |
| 메인, FAQ, 개인정보, 약관, 공통 footer, 사용자용 404 | 네 index.html과 루트 404.html 생성. 각 페이지 H1 하나, 정적 본문, 시맨틱 header/nav/main/footer. 로컬 preview의 없는 경로 HTTP 404 확인 |
| FAQ 전체·정책 전문 | 원본 blockTree의 개인정보 151개 블록/13조항, 약관 136개 블록/16조항, FAQ 65개 블록/18문항 전체 텍스트·하위 항목·링크 대조 통과. `docs/reference/verify-content.mjs` |
| 출처·운영 검토 기록 | `docs/reference/content-sources.json`, 원본 snapshot 3개, `content-migration.md`. 버전·시행일·영문 링크 보존 |
| SEO | 페이지별 title, description, canonical, OG/Twitter, lang, viewport. sitemap 4경로와 robots 동일 origin, 404 제외. 소프트웨어 구조화 데이터에 가격·평점·리뷰 없음 |
| 실제 로컬 자산 | manifest 11개 모두 바이트·SHA-256·파일 시그니처 검증. 배포파일 31개, 모두 25MiB 미만. iframe·원격 media src·CSS 원격자산·원본 CDN 의존 없음 |
| 제외 영역 | 응원·댓글·후기·후원·폼·웹 분석 SDK 없음. 개인정보 문서의 앱 SDK 설명은 원문 보존 |
| 스토어·외부 정책 링크 | 공개 외부 HTTPS 링크 13개 모두 HTTP 200(리디렉션 후 포함). `external-links.json`. mailto는 공통 원본 이메일과 일치 |
| 모바일 | 메인 320/360/390/430/768/1280/1440px 실제 Chrome viewport 검사, 문서 3페이지 320/390/768/1440px 검사. 모두 scrollWidth=innerWidth. 이미지 로드 실패 없음 |
| 키보드 | FAQ summary에 Enter로 열기, Space로 닫기 확인. 열렸을 때 원본 답변 표시, focus-visible solid 확인. 내부 문서 목차·복귀 앵커 자동 검사 통과 |
| 동일 출처 요청 | Lighthouse 최종 실제 네트워크 요청 9개 전부 `http://127.0.0.1:4323` origin. 메인 브라우저에서도 이미지 8개 모두 로컬 currentSrc 확인 |
| 공개 주소 보호 | 기본값은 로컬 localhost뿐. CF_PAGES 빌드에는 실제 SITE_URL 필수, HTTPS origin만 허용. SITE_URL 미설정 production preflight가 의도대로 실패하는 것 확인 |
| Pages 준비 | 정적 dist, 404.html, 필요한 _headers, Node 버전·배포 절차 README. Preview 기본 noindex를 덮어쓰는 규칙 없음. 임의 호스트 리디렉션 없음 |

## Lighthouse 모바일

최종 정적 빌드의 `http://127.0.0.1:4323/`에서 Lighthouse 13.6.0 / HeadlessChrome 156으로 측정했다. 기본 mobile 412×823, DPR 1.75, simulated network RTT150ms·1638.4Kbps, CPU slowdown4× 조건이다. 캐시와 인터넷 환경이 다른 실제 공개 사이트 성능을 보장하는 측정은 아니다.

- Performance **100**, Accessibility **100**, SEO **100**.
- FCP 0.8초, LCP 1.4초, CLS 0.
- 페이지 이미지 등을 포함한 측정 전송량 319,261바이트. 첫 화면 이미지 합계 1MiB 목표 이내다.
- 헤더 브랜드의 접근성 이름이 화면의 `shardee.`를 포함하도록 수정한 뒤 재측정했다.
- 원본 전체 JSON: `lighthouse-mobile.json`. 실제 메인 화면: `home-desktop.jpg`.

## 별도 환경에서 확인할 항목

실제 iOS Safari/Android Chrome 기기, OS 글자 확대, 실제 브라우저 200% 확대는 이번 환경에서 검증하지 못했다. 네이티브 Safari 접근도 시도했으나 컴퓨터 제어 서버가 시간 초과하여 화면을 확보하지 못했다. Chrome viewport 검사는 실제 모바일 기기 검사를 대신하는 증거로 쓰지 않는다. 시스템 글꼴·기본 details·반응형 레이아웃·reduced-motion CSS를 제공했으며 해당 실제 환경에서의 최종 시각 확인이 남는다.

공개 주소와 Pages 프로젝트가 정해지지 않아 실제 배포·Preview noindex 응답·Production index 가능 여부·실제 HTTPS/canonical·호스트 리디렉션은 아직 검증 대상이 없다. README의 배포 후 확인 절차에 따라 처리한다. 앱/스토어/기존 Slashpage URL 변경과 정책의 호스팅 언급 수정 여부 결정은 운영 후속 항목이다. 이 작업에서 앱 코드는 수정하지 않았다.

## 후속 화면 수정 (2026-10-30)

사용자 요청에 따라 첫 섹션은 실제 원본 커버를 변환한 5.04초/620,713바이트 로컬 무음 배경 영상으로 바꿨다. 바로 다음 섹션에 App Store·Google Play 링크를 배치했고 기능 이미지의 카드 배경·테두리·추가 그림자를 제거했다. 모바일은 원본에 포함된 제목이 잘리지 않도록 영상 영역을 정사각형 이내로 제한한다. 영상 일시정지/재생, 화면 밖에서 일시정지, 동작 줄이기 설정의 포스터 fallback을 제공한다.

Chrome 실제 화면에서 영상 readyState4·muted true·paused false·local currentSrc를 확인했고 Enter 키로 일시정지를 확인했다. 390px 가로 넘침이 없었으며 기능 미디어 컨테이너 3개의 border는 0px, 배경은 transparent였다. 다운로드 앵커의 대상 섹션 안에 스토어 링크 2개를 확인했다. 타입 검사·빌드·3개 smoke 테스트가 통과했다. 위 Lighthouse와 기존 전체 화면 증빙은 이 수정 이전의 측정이다.

## 히어로 최종 배치 수정 (2026-10-30)

위의 전체 배경 영상/별도 다운로드 섹션 배치는 사용자 후속 요청으로 대체했다. 현재는 왼쪽에 “단 한 번의 셔터로 담은 1초. 소중한 순간을 이어 나만의 이야기를 만들어요.”와 두 스토어 링크, 오른쪽에 소개 영상을 배치한다. 영상에 이미 포함된 제목은 화면에 중복 출력하지 않으며, H1은 보조기기용으로 유지한다. 별도의 첫 다운로드 섹션은 제거했다. 원본 620px보다 확대하지 않도록 제한하여 데스크톱 실제 영상 표시 너비 607px, 원본 videoWidth620을 확인했다. 가로 넘침 없이 로컬 영상이 재생 중이었고 타입 검사·빌드·테스트가 통과했다. 기능 이미지의 카드/테두리 제거는 유지한다.
