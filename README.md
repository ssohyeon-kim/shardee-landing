# Shardee 랜딩

한국어·영어·일본어·번체·간체의 메인·FAQ·개인정보 처리방침·이용약관과 404 페이지를 제공하는 Astro 정적 사이트입니다. React, 서버 함수, 데이터베이스 없이 HTML을 생성합니다.

## 로컬 실행

```sh
nvm use
npm ci
npm run dev
```

Node `24.14.1`, npm 11을 사용합니다. 개발 서버 주소는 명령 출력에서 확인하세요. 사이트 시작 경로는 `/shardee/`입니다. 정식 주소는 `/shardee/{언어}/`, `/shardee/{언어}/faq/`, `/shardee/{언어}/privacy/`, `/shardee/{언어}/terms/`입니다. 언어 코드는 `ko`, `en`, `ja`, `zh-Hant`, `zh-Hans`입니다. 언어 접두어가 없는 `/shardee/`, `/shardee/faq/` 등의 주소도 호환됩니다.

```sh
npm run check
npm run build
npm test
npm run preview
```

`dist/`가 배포 산출물입니다. `build`는 로컬 링크·앵커·메타데이터·미디어·사이트맵·파일 크기를 검사합니다. `npm test`는 수집한 원문과 정책·FAQ를 대조합니다. 일반 빌드와 방문 요청은 원본 사이트에서 콘텐츠를 가져오지 않습니다.

## 언어 선택·SEO·AEO

- 기존 기본 주소(`/shardee/`, `/shardee/faq/`, `/shardee/privacy/`, `/shardee/terms/`)에 진입하면 저장된 선택, 브라우저 언어, 한국어 기본값 순서로 언어별 주소에 연결합니다. 명시적 언어 주소(`/shardee/ja/privacy/` 등)는 브라우저 언어가 달라도 유지합니다.
- `?lang=en`은 언어를 강제로 선택하고 선택을 기억합니다. 예: `/shardee/privacy/?lang=en` → `/shardee/en/privacy/`. `ko`, `en`, `ja`, `zh-TW`/`zh-Hant`, `zh-CN`/`zh-Hans`를 지원합니다. 다른 query와 hash는 보존합니다. 강제 언어 선택이 가장 우선합니다.
- 헤더 오른쪽의 언어 메뉴로 현재 페이지를 다른 언어로 볼 수 있습니다. 저장소 사용이 제한되어도 링크 이동과 query 선택은 작동합니다.
- 언어 선택 연결은 방문자 브라우저의 JavaScript로 처리합니다. 검색용 본문은 20개 독립 정적 HTML에 이미 포함되어 있으므로 JS나 브라우저 언어 감지가 없어도 각 언어 주소를 읽을 수 있습니다. query 자체를 별도 색인 주소로 중복 등록하지 않습니다.
- 각 정식 주소는 자기 canonical과 5개 상호 `hreflang`, 기본 주소의 `x-default`, 번역된 title·description·OG/Twitter·HTML lang을 가집니다. 사이트맵에는 정식 20개만 포함합니다. 404는 noindex입니다.
- JSON-LD는 Organization·WebSite·SoftwareApplication·WebPage, 하위 페이지 BreadcrumbList, FAQ의 실제 18개 Question/Answer, 정책의 조항·실제 날짜와 버전을 연결합니다. 평점·가격·검색 기능·앱 지원 언어를 추측해 추가하지 않습니다.
- UI 사전: `src/i18n/locales/`. 번역 FAQ·정책·목차: `src/content/translations/`. 한국어 법률 원문은 `src/content/legal/`입니다. 번역 기록은 `docs/reference/translation-*.md`입니다.
- `npm test`는 언어 선택 우선순위, query 전환·예외 처리, 20개 페이지의 schema/링크/개인 이메일 비노출, 5개 FAQ의 구조화 답변과 화면 본문 일치, 번역 구조를 검증합니다.

## Cloudflare Workers — diaro.app/shardee

공개 주소는 `https://diaro.app/shardee/`입니다. 사이트의 URL 접두어는 `deployment.config.mjs`의 `basePath`에 `/shardee`로 설정되어 있습니다. Astro가 생성한 파일을 `scripts/prepare-worker.mjs`가 `dist/shardee/`에 배치하고, Workers는 `dist/`를 정적 파일 루트로 제공합니다. `_headers`와 `_redirects`는 Workers가 읽을 수 있도록 `dist/` 루트에 유지합니다. 계정에 따라 활성화되지 않은 `assets.base_path` 기능은 사용하지 않습니다.

Cloudflare Git 연동 빌드 설정:

| 항목 | 값 |
| --- | --- |
| Build command | `npm run build:production` |
| Deploy command | `npm run deploy` |
| Version command (기존 미리보기 방식) | `npm run deploy:preview` |
| Root directory | `/` |
| Build variable: `SITE_URL` | `https://diaro.app` |
| Build variable: `NODE_VERSION` | `24.14.1` |

`SITE_URL`에는 `/shardee`를 넣지 않습니다. 경로·쿼리 없는 HTTPS origin만 허용합니다. 로컬에서는 `.env.example`을 `.env.production`으로 복사하거나 명령에 환경변수를 지정하세요. Cloudflare에는 빌드 변수를 직접 등록해야 합니다. `.env.example`은 자동 로딩되지 않습니다.

```sh
SITE_URL=https://diaro.app npm run build:production
npm run preview:worker -- --port 8787
```

`preview:worker`는 빌드된 정적 파일을 로컬 Workers 런타임에서 실행합니다. 출력된 localhost 주소의 `/shardee/`로 접속하세요. 서버를 켠 상태에서 다른 터미널의 `npm run test:worker`로 HTTP 검증을 실행할 수 있습니다. 서버가 반환하는 301, 404, 캐시 헤더까지 검사할 수 있습니다.

Wrangler는 `4.155.0`으로 고정되어 있습니다. `wrangler.jsonc`는 `diaro.app`을 이 Worker의 Custom Domain으로 연결합니다. 정적 파일은 `/shardee/`에서만 제공하고, `/shardee`는 `/shardee/`로 301 리디렉션합니다. `/shardee-other`와 도메인의 다른 경로는 404를 반환합니다. 기존 `www.diaro.app`의 DNS 연결은 별개입니다. Worker 이름은 Cloudflare 프로젝트 이름 `shardee-landing`과 같아야 합니다.

기존 Version URL 방식의 미리보기는 `npm run deploy:preview`로 생성합니다. 새 Worker Previews 방식을 이미 사용하는 프로젝트의 Preview command는 `npx wrangler preview`입니다. 기존 프로젝트를 새 방식으로 전환하는 것은 별도 작업이며 이 변경에서 자동 전환하지 않습니다. Workers 미리보기에서도 시작 경로는 `/shardee/`입니다. 검색 메타데이터는 설정된 공개 `SITE_URL`을 사용합니다.

### 실제 도메인 연결 조건

1. `diaro.app`이 같은 Cloudflare 계정의 활성 Zone이어야 합니다. 외부 등록기관에서 구입한 도메인도 Cloudflare DNS로 관리할 수 있습니다.
2. `diaro.app`의 Custom Domain DNS 레코드와 인증서는 Workers가 생성합니다. 루트 도메인에 다른 홈페이지를 추가하려면 향후 라우팅 구성을 조정해야 합니다.
3. Git 저장소와 `main` 브랜치에 Cloudflare가 접근할 수 있어야 합니다. 프로젝트 파일을 커밋·푸시한 후 빌드하세요.
4. 빌드 API 토큰에 Worker 배포와 해당 Zone의 도메인 연결에 필요한 권한이 있어야 합니다. 토큰은 저장소에 넣지 않습니다.

첫 배포 시 Wrangler가 `diaro.app` Custom Domain을 등록합니다. Cloudflare에 Zone이 없거나 아직 네임서버 전환 중이면 먼저 연결을 끝내야 합니다.

`robots.txt`는 호스트 루트에서만 검색 로봇 정책으로 적용됩니다. 기존 `https://diaro.app/robots.txt`를 관리하는 사이트에서 `Sitemap: https://diaro.app/shardee/sitemap.xml`을 추가하거나 이 사이트맵을 Search Console에 제출하세요. 이 프로젝트는 `/shardee/robots.txt`를 생성하지만 도메인 루트의 파일을 덮어쓰지 않습니다.

배포 후 `/shardee`의 301, 5개 언어의 20개 공개 경로 직접 진입·새로고침, 이미지·영상, 없는 경로의 HTTP 404를 확인하세요. `404.html`을 생성하므로 SPA fallback을 사용하지 않습니다. Cloudflare Pages는 경로별 Workers Route를 직접 제공하지 않으므로 이 구성은 Workers 배포용입니다.

공식 설정: [Astro base](https://docs.astro.build/en/reference/configuration-reference/#base), [Workers 하위 경로](https://developers.cloudflare.com/workers/static-assets/routing/advanced/serving-a-subdirectory/), [Workers Routes](https://developers.cloudflare.com/workers/configuration/routing/routes/).

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
