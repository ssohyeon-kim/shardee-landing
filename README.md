# Shardee 랜딩

한국어·영어·일본어·번체·간체의 메인·FAQ·개인정보 처리방침·이용약관과 404 페이지를 제공하는 Astro 정적 사이트입니다. React, 서버 함수, 데이터베이스 없이 HTML을 생성합니다.

## 로컬 실행

```sh
nvm use
npm ci
npm run dev
```

Node `24.14.1`, npm 11을 사용합니다. 개발 서버 주소는 명령 출력에서 확인하세요. 정식 주소는 `/{언어}/`, `/{언어}/faq/`, `/{언어}/privacy/`, `/{언어}/terms/`입니다. 언어 코드는 `ko`, `en`, `ja`, `zh-Hant`, `zh-Hans`입니다. 기존 접두어 없는 주소도 호환됩니다.

```sh
npm run check
npm run build
npm test
npm run preview
```

`dist/`가 배포 산출물입니다. `build`는 로컬 링크·앵커·메타데이터·미디어·사이트맵·파일 크기를 검사합니다. `npm test`는 수집한 원문과 정책·FAQ를 대조합니다. 일반 빌드와 방문 요청은 원본 사이트에서 콘텐츠를 가져오지 않습니다.

## 언어 선택·SEO·AEO

- 기존 기본 주소(`/`, `/faq/`, `/privacy/`, `/terms/`)에 진입하면 저장된 선택, 브라우저 언어, 한국어 기본값 순서로 언어별 주소에 연결합니다. 명시적 언어 주소(`/ja/privacy/` 등)는 브라우저 언어가 달라도 유지합니다.
- `?lang=en`은 언어를 강제로 선택하고 선택을 기억합니다. 예: `/privacy/?lang=en` → `/en/privacy/`. `ko`, `en`, `ja`, `zh-TW`/`zh-Hant`, `zh-CN`/`zh-Hans`를 지원합니다. 다른 query와 hash는 보존합니다. 강제 언어 선택이 가장 우선합니다.
- 헤더 오른쪽의 언어 메뉴로 현재 페이지를 다른 언어로 볼 수 있습니다. 저장소 사용이 제한되어도 링크 이동과 query 선택은 작동합니다.
- 언어 선택 연결은 방문자 브라우저의 JavaScript로 처리합니다. 검색용 본문은 20개 독립 정적 HTML에 이미 포함되어 있으므로 JS나 브라우저 언어 감지가 없어도 각 언어 주소를 읽을 수 있습니다. query 자체를 별도 색인 주소로 중복 등록하지 않습니다.
- 각 정식 주소는 자기 canonical과 5개 상호 `hreflang`, 기본 주소의 `x-default`, 번역된 title·description·OG/Twitter·HTML lang을 가집니다. 사이트맵에는 정식 20개만 포함합니다. 404는 noindex입니다.
- JSON-LD는 Organization·WebSite·SoftwareApplication·WebPage, 하위 페이지 BreadcrumbList, FAQ의 실제 18개 Question/Answer, 정책의 조항·실제 날짜와 버전을 연결합니다. 평점·가격·검색 기능·앱 지원 언어를 추측해 추가하지 않습니다.
- UI 사전: `src/i18n/locales/`. 번역 FAQ·정책·목차: `src/content/translations/`. 한국어 법률 원문은 `src/content/legal/`입니다. 번역 기록은 `docs/reference/translation-*.md`입니다.
- `npm test`는 언어 선택 우선순위, query 전환·예외 처리, 20개 페이지의 schema/링크/개인 이메일 비노출, 5개 FAQ의 구조화 답변과 화면 본문 일치, 번역 구조를 검증합니다.

## Cloudflare Pages

프로젝트 루트에서 Framework preset **Astro**, Build command **npm run build**, Output directory **dist**, Node version **24.14.1**로 설정합니다. SSR 어댑터나 Workers 명령은 필요하지 않습니다.

Cloudflare 빌드 환경에 `SITE_URL`을 실제 공개 **HTTPS origin**으로 지정하세요. 경로·쿼리·끝의 추가 경로를 포함하지 않습니다. canonical·OG·sitemap·robots는 모두 이 값을 사용합니다. 로컬에서 미설정하면 `http://localhost:4321`을 사용하며 Cloudflare 빌드는 미설정을 오류로 처리합니다. 임의의 공개 도메인을 기본값으로 두지 않습니다.

공개용 로컬 빌드는 `.env.production` 또는 환경변수에 실제 주소를 설정한 뒤 실행합니다.

```sh
npm run build:production
```

Git 연동 시 실제 저장소와 기본 브랜치를 선택하세요. Direct Upload도 `dist/`로 가능합니다. 이 작업에는 원격 저장소 생성·배포·DNS 변경이 포함되지 않습니다.

배포 후 5개 언어의 20개 공개 경로 직접 진입·새로고침·없는 경로의 HTTP 404를 확인하세요. 루트 `404.html`을 생성하므로 Pages의 SPA fallback을 사용하지 않습니다. Preview의 기본 `X-Robots-Tag: noindex`는 `_headers`에서 덮어쓰지 않습니다. 실제 Preview 응답에 noindex가 있는지, Production은 색인이 가능한지 확인해야 합니다. 커스텀 도메인 사용 시 production pages.dev 호스트만 도메인으로 리디렉션하고 Preview까지 리디렉션하지 마세요. 최종 호스트가 정해지기 전에는 리디렉션 규칙을 넣지 않습니다.

## 콘텐츠와 자산 관리

- 공통 연락처·사업자·앱 식별자: `src/config/site.ts`
- 언어별 국가 스토어 링크: `src/config/stores.ts` (ko→KR, en→US, ja→JP, zh-Hant→TW, zh-Hans→CN). App Store 국가 경로와 Google Play hl/gl을 CTA·구조화 데이터에 동일하게 적용합니다. 스토어 계정의 국가 설정을 변경하지는 않습니다.
- FAQ: `src/content/faq.ts`
- 정책 전문·목차: `src/content/legal/`
- 수집 원문·대조·운영 검토: `docs/reference/`
- 원본 자산 매핑: `src/config/assets.ts`
- 자산 출처·MIME·SHA-256·수집 시각: `docs/assets/asset-sources.json`
- 검증 결과와 미실행 배포 확인 항목: `docs/verification/`

이미지는 저장소에 포함하고 빌드 시 responsive WebP를 생성합니다. 히어로는 왼쪽 안내 문구와 스토어 링크, 오른쪽 로컬 MP4 소개 영상으로 구성합니다. 원본 해상도보다 크게 확대하지 않습니다. 동작 줄이기 설정 또는 자동 재생 제한 시 정지 포스터를 제공합니다. 기능 소개에는 테두리 카드 없이 실제 원본 이미지를 사용합니다. 폰트는 OS 시스템 글꼴, FAQ는 기본 `details/summary`입니다. 응원·댓글·후기·소식 피드·후원·폼·분석 SDK는 추가하지 않았습니다.

## 공개 전 운영 확인

정책의 기존 Slashpage 호스팅 언급과 FAQ 해상도 안내 오탈자는 원문대로 유지했습니다. `docs/reference/`의 검토 기록을 확인하고 운영자가 원문 정책을 결정해야 합니다. 문의 이메일·주소·담당자 정보는 원본과 대조하여 보존했습니다.

후속 URL 변경 대상: 기존 Slashpage의 새 사이트 안내, App Store/Google Play의 웹사이트·지원·개인정보처리방침 URL, 앱 내 FAQ·정책·약관 링크. 이 프로젝트는 앱 코드나 기존 Slashpage를 수정하지 않습니다.
