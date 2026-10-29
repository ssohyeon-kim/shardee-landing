# Shardee 랜딩 페이지 구현 계획

작성일: 2026-10-30
상태: 구현 전 검토용. 이번 단계에서는 계획만 작성하며 프로젝트 생성·리소스 다운로드·배포는 실행하지 않는다.

## 1. 목표와 범위

- https://slashpage.com/shardee 를 참고해 제품 소개와 앱 다운로드를 위한 한국어 사이트를 만든다.
- 필수 구성: 메인, 자주 묻는 질문, 개인정보 처리방침, 이용 약관, 메인 footer.
- footer는 공통 컴포넌트로 만들어 하위 페이지에서도 사용한다.
- 필요한 이미지·스토어 배지·채택한 영상과 포스터는 다운로드하여 배포 사이트의 동일 출처에서 직접 제공한다.
- 정적 HTML, 검색 메타데이터, 모바일 레이아웃, 접근성을 갖춘다.
- 최종 배포 대상은 **Cloudflare Pages**다. 최초 요청의 Vercel 배포 계획을 대체한다.
- **‘응원 한마디’, 댓글, 후기 목록, 작성 폼 및 관련 데이터·API는 만들지 않는다.**
- 초기 범위에서 소식 피드·후원 섹션, 회원가입·로그인·CMS·결제·문의 수집 폼·웹 분석 SDK도 제외한다. 문의는 이메일 링크로 제공한다.
- iOS/Android 앱 코드와 기존 Slashpage 사이트는 수정하지 않는다.

## 2. 조사 결과와 원본

### 프로젝트 상태

작업 폴더는 비어 있으며 기존 프레임워크·패키지·Git 저장소가 없다. 새 프로젝트 기준으로 계획한다. 원본의 텍스트와 링크는 확인했지만 브라우저 시각 검증은 완료하지 못했다. 정확한 색상·폰트·간격·이미지 크롭은 구현 착수 시 원본 화면을 확인한 후 토큰으로 확정한다.

### 콘텐츠 출처

| 대상 | 원본 | 확인 사항 |
| --- | --- | --- |
| 메인 | https://slashpage.com/shardee | 소개, 스토어 CTA, 촬영·편집·저장 설명, 사업자·연락처 |
| FAQ | https://slashpage.com/shardee/n5w9812g9wnj424kpgze | 앱 소개, 공지, 요금·촬영·저장·편집·환불·문제 해결 |
| 개인정보 처리방침 | https://slashpage.com/shardee/7916x82rpn4zj24kpyg3 | 표시 기준 v1.3.2, 현재 시행일 2026-10-14 |
| 이용약관 | https://slashpage.com/shardee/4z7pvx2kev6v62ek8653 | 표시 기준 최종 업데이트 2026-10-01, 16개 대조항 |
| App Store | https://apps.apple.com/kr/app/id6739505769 | 기존 링크의 앱 ID 확인 |
| Google Play | https://play.google.com/store/apps/details?id=com.shardee.aos | 기존 링크의 패키지 ID 확인 |

구현 착수 시 원문을 다시 수집하고 출처와 수집 시각을 기록한다. FAQ 답변의 의미와 링크를 보존하고, 개인정보 처리방침·약관은 전문을 이관한다. 법률 문구를 새로 창작하거나 요약하지 않는다. 제목 계층과 문단 구조만 웹 레이아웃에 맞게 정리한다.

### 이관 시 확인할 사항

- 개인정보 처리방침에 기존 Slashpage 호스팅 언급이 있다. 이전 이후 운영 방식과의 차이를 별도 기록하고 개발자가 임의로 정책을 삭제·변경하지 않는다.
- FAQ의 해상도 안내 등 오탈자로 보이는 내용은 검토 목록에 남기고 앱 동작을 추측해 수정하지 않는다.
- 원본의 영문 FAQ·정책 링크는 실제 목적지를 확인해 유지한다. 초기 릴리스에서 별도 영문 페이지·빈 영문 경로는 만들지 않는다.
- 대표 문의처는 원본의 `untitledshatter@gmail.com`을 사용한다. 사업자·담당자 연락처는 원본을 대조해 공통 설정에 저장한다.

## 3. 기술 선택

| 방식 | 장점 | 비용/제약 | 판단 |
| --- | --- | --- | --- |
| Astro + TypeScript + 정적 HTML | 콘텐츠 중심, 적은 브라우저 JS, 문서 이관·Pages 배포에 적합 | Astro 문법 사용 | **추천 기본안** |
| Next.js 정적 export | React 생태계 사용 가능 | 서버 기능·이미지 처리의 정적 export 제약, 현재 요구에는 추가 복잡도 | 대안 |
| 수작업 HTML/CSS | 단순한 빌드 | 공통 레이아웃·SEO·문서 관리 중복 | 비추천 |

기본안은 Astro의 `output: 'static'`, TypeScript, CSS 변수와 컴포넌트 scoped CSS다. React 런타임과 CSS 프레임워크는 초기 요구에 필요하지 않아 추가하지 않는다. FAQ는 기본 HTML `details/summary`를 사용한다.

- npm과 단일 `package-lock.json`을 사용한다.
- 구현 시 공식 지원 범위를 확인해 Astro 안정 버전과 호환 Node LTS를 고정한다. `.nvmrc`, package engines, Cloudflare 빌드 버전을 맞춘다.
- 이미지 최적화는 빌드 시 수행한다. 요청 시 이미지 변환 서버가 필요하지 않게 한다.
- SSR 어댑터, Pages Functions, Workers API, DB, R2는 초기안에 필요하지 않다.
- 콘텐츠와 미디어 수집은 준비 작업에서 수행한다. 일반 빌드나 방문 요청에서 Slashpage/CDN을 다시 조회하지 않는다.

## 4. 페이지와 UI

| 경로 | 내용 | 완료 기준 |
| --- | --- | --- |
| `/` | 제품 소개, 다운로드 CTA, 촬영·편집·저장 소개, footer | 두 스토어 이동 가능, 핵심 미디어 로컬 제공 |
| `/faq/` | 앱 소개·공지·전체 FAQ·문의 링크 | 전체 답변이 초기 HTML에 포함, 키보드 열람 가능 |
| `/privacy/` | 개인정보 처리방침 전문, 시행일·버전·목차 | 조항·하위 항목·링크 누락 없이 읽기 가능 |
| `/terms/` | 이용약관 전문, 업데이트일·목차 | 원문 조항 누락 없이 읽기 가능 |
| 없는 경로 | 사용자용 404 | 실제 HTTP 404와 메인 복귀 링크 |

### 메인 구성

1. 헤더: 브랜드 홈 링크, FAQ, 다운로드 앵커. 작은 화면에서도 간단한 탐색 유지.
2. Hero: 앱의 핵심 가치, 로컬 미디어, App Store·Google Play CTA.
3. 기능: 촬영 → 편집 → 저장. 모바일은 한 열, 넓은 화면에서는 설명·미디어 두 열 배치.
4. 마지막 다운로드 CTA.
5. 공통 footer.

원본의 브랜드·미디어·핵심 메시지를 기반으로 정돈한다. 시각 확인 전 임의 브랜드 컬러를 확정하지 않는다. 과한 애니메이션·캐러셀·큰 UI 라이브러리는 추가하지 않는다.

### FAQ·정책

- FAQ는 가격/프리미엄, 촬영, 저장, 편집, 구매·환불, 권한·문제 해결 등으로 묶고 질문마다 펼침 항목을 제공한다. 검색은 초기 범위에서 제외한다.
- 정책은 읽기 좋은 본문 폭, 충분한 행간, 조항별 앵커와 목차를 제공한다.
- H1 하나, 조항 H2, 하위 항목 H3로 구성한다. 긴 URL·이메일도 모바일에서 줄바꿈한다.
- FAQ와 법률 본문은 UI 코드와 분리해 원문 변경 시 관리하기 쉽게 한다.

### Footer

- FAQ·개인정보 처리방침·이용약관 내부 링크, 브랜드·저작권, 문의 mailto.
- 상호 디아로, 사업자등록번호 `308-13-16385`, 통신판매업신고번호 `제2025-서울강남-02765호`, 대표·개인정보보호책임자 김소현 및 원본의 담당자 연락처.
- 주소 등 운영 정보도 정책 원본과 대조한다. 정보를 `site.ts`에서 한 번만 관리한다.
- Slashpage 로그인·관리 UI와 ‘Made with Slashpage’ 표시는 이관하지 않는다.

## 5. 리소스 수집과 로컬 제공

### 현재 식별한 후보

| 용도 | 발견한 URL | 상태 |
| --- | --- | --- |
| 상단 브랜드/커버 이미지 | `https://upload.cafenono.com/image/slashpageCoverImage/20250114/172045_VbC0xVnFTipwXrpgkj?q=80&s=720x1` | URL 확인. 웹 조회 cache miss; 실제 수신·내용 확인 필요 |
| 편집 기능 이미지 | `https://upload.cafenono.com/image/slashpageHome/20240808/233239_RYUcAd97aW3x0zAAwQ?f=webp&q=90&s=1280x1&t=outside` | URL 확인. 다운로드 후 형식·크기·투명도 확인 필요 |
| 촬영 미디어 썸네일 | `https://vz-127031db-d43.b-cdn.net/a4436f95-ef0a-45c2-95bb-66fefd508f51/thumbnail.jpg` | 이번 웹 조회 403. 원본 확보 여부 확인 필요 |
| 저장 미디어 썸네일 | `https://vz-127031db-d43.b-cdn.net/9a2569dd-4f39-42e1-895b-2712407b844f/thumbnail.jpg` | 이번 웹 조회 403. 원본 확보 여부 확인 필요 |

완전한 목록은 아니다. 구현 시 로고·favicon·스토어 배지·실제 임베드 미디어 원본·포스터를 추가 조사한다. 썸네일 URL만으로 영상 주소나 종류를 추측하지 않는다.

### 처리 순서

1. 원본 화면과 실제 로드 리소스를 확인해 필요한 미디어만 선정한다. 댓글 아바타·응원 이미지 등 제외 영역의 자산은 수집하지 않는다.
2. `curl --fail --location` 등으로 정상 다운로드하고 HTTP 상태·Content-Type·파일 시그니처를 검증한다. 오류 HTML을 이미지로 저장하지 않는다.
3. `asset-sources.json`에 논리 ID, 출처 URL, 로컬 경로, 수집일, 크기·해상도·MIME·체크섬·사용 위치를 기록한다.
4. 이미지 원본은 `src/assets/`에 저장하고 Astro 빌드로 적정 크기의 WebP/AVIF와 필요한 fallback을 생성한다. 앱 화면의 글자와 로고 선명도를 확인한다.
5. 스토어 배지는 공식 리소스·사용 규칙을 확인해 로컬 저장한다. 기본 폰트는 시스템 글꼴을 사용하며, 추가 폰트가 필요하면 라이선스를 확인하고 로컬 WOFF2로 제공한다.
6. 영상이 필요하면 `public/media/`에 로컬 파일과 포스터를 저장한다. 재생 전 대용량 전송을 피하고 모바일·동작 줄이기 설정에서는 포스터를 우선한다. 소리 있는 자동 재생은 하지 않는다.
7. 영상은 길이·해상도·비트레이트를 줄여 파일당 25 MiB 미만, 권장 10 MiB 이하로 맞춘다. 너무 크거나 정상 원본을 확보하지 못하면 확보한 로컬 정지 이미지로 기능을 소개한다.
8. 접근 제한된 자산은 정상 공개 경로나 보유 원본을 확인한다. 미확보 항목은 원본 요청 대상으로 명시하고 외부 핫링크·가짜 자산으로 완료 처리하지 않는다.
9. 수집된 자산을 저장소에 포함해 일반 빌드에서 외부 다운로드가 필요 없게 한다. 실제 웹 요청에 원본 CDN·iframe 의존이 없는지 확인한다.

이미지에는 크기·종횡비를 지정한다. 첫 화면 주 이미지에만 높은 로딩 우선순위를 주고 하단 이미지는 지연 로딩한다. 콘텐츠 이미지에는 설명형 alt, 장식 이미지에는 빈 alt를 제공한다. 첫 화면 이미지 전송량은 합계 1 MiB 이하를 목표로 실제 품질과 함께 확인한다.

## 6. SEO·모바일·접근성

### SEO

- 주요 본문과 링크를 정적 HTML에 포함해 JavaScript 없이도 읽을 수 있게 한다.
- 공통 SEO 컴포넌트에서 페이지별 title·description·절대 canonical·Open Graph·Twitter 카드·로컬 공유 이미지를 출력한다.
- 브랜드와 제품 설명을 자연스럽게 반영한다. 불필요한 키워드 반복은 하지 않는다.
- `lang="ko"`, viewport, favicon, apple-touch-icon을 제공한다.
- `SITE_URL` 하나를 canonical·OG·사이트맵의 origin으로 사용한다. 프로덕션은 실제 HTTPS 주소를 요구하며 임의 도메인으로 배포하지 않는다.
- sitemap은 네 공개 페이지만 포함하고 404는 제외한다. robots에 sitemap 위치를 연결한다.
- 메인에는 확인 가능한 정보로만 SoftwareApplication 구조화 데이터를 제공한다. 평점·가격·리뷰 수를 만들지 않는다. FAQ 등의 검색 결과 특수 노출을 보장하지 않는다.
- Preview 기본 `X-Robots-Tag: noindex`를 보존하고 실제 응답을 확인한다. 프로덕션이 잘못 noindex되지 않게 한다.
- 커스텀 도메인을 연결하면 production pages.dev의 중복 노출을 호스트 조건 리디렉션으로 처리한다. Preview까지 일괄 리디렉션하지 않는다.
- 새 사이트 배포만으로 Slashpage 경로를 리디렉션할 수 없다. 기존 사이트 안내·앱/스토어의 정책 URL 변경은 후속 운영 항목으로 기록한다. 이번 작업에서 앱 코드는 수정하지 않는다.

### 모바일·접근성

- 360/390/430px 모바일을 우선하고 768/1280/1440px도 확인한다. 320px에서도 가로 스크롤 없이 읽을 수 있게 한다.
- 모바일 한 열, 데스크톱 제한된 최대 폭, CTA의 자연스러운 줄바꿈을 지원한다.
- 터치 영역 44×44px 이상, 본문 최소 16px, 충분한 행간을 목표로 한다.
- header·nav·main·footer 시맨틱 구조, skip link, 논리적인 읽기 순서, 키보드 focus를 제공한다.
- 텍스트 대비 WCAG AA와 200% 확대, OS 글자 확대, `prefers-reduced-motion`을 확인한다.
- 스토어 버튼에는 명확한 접근성 이름과 실제 URL을 제공한다. OS 감지로 강제 이동하지 않는다.

## 7. 파일 구조와 병렬 작업 계약

```text
astro.config.mjs                    # A: static/site/trailingSlash/sitemap
package.json, package-lock.json     # A: 의존성·스크립트 단일 변경자
.nvmrc, .env.example, tsconfig.json  # A
README.md                           # A: 실행·Pages 배포 안내
src/
  config/site.ts                    # A: 브랜드·연락처·스토어·사이트 주소
  config/assets.ts                  # D: 미디어 ID와 실제 로컬 파일 매핑
  styles/tokens.css, global.css     # A: 토큰·전역 스타일
  layouts/BaseLayout.astro          # A: SEO·header·main·footer 연결
  layouts/DocumentLayout.astro      # C: 정책 공통 레이아웃
  components/shared/               # A: Header, Footer, StoreButtons, Seo
  components/home/                 # B: 메인 섹션
  components/faq/                  # C: FAQ 표현
  content/faq.ts                    # C: FAQ 원문 데이터
  content/legal/privacy.md          # C: 개인정보 처리방침 전문
  content/legal/terms.md            # C: 이용약관 전문
  pages/index.astro                 # B
  pages/faq.astro                   # C
  pages/privacy.astro               # C
  pages/terms.astro                 # C
  pages/404.astro                   # A
  pages/robots.txt.ts               # A: 빌드 시 정적 생성
  assets/                          # D: 브랜드·이미지 원본
public/
  media/                           # D: 채택한 영상·포스터
  brand/                           # D: favicon·스토어 배지·OG 이미지
  _headers, _redirects              # A: 실제 필요한 규칙만
scripts/                           # A: 산출물 검사
docs/reference/                   # C: 원문 대조·수집 기록
docs/assets/asset-sources.json     # D: 자산 출처·상태
tests/smoke/                      # A: 경로·링크·SEO 확인
```

위 트리의 `docs/`, `tests/`는 프로젝트 루트 디렉터리다.

### 병렬 시작 전 동결할 인터페이스

- BaseLayout: title, description, canonicalPath, 선택 OG 이미지, 기본 slot. header/footer는 레이아웃에서 한 번만 렌더링한다.
- site.ts: 브랜드·문의처·사업자 정보·내부 경로·두 스토어 URL. 공개 사이트 주소를 한 곳에서 처리한다.
- StoreButtons: 공통 URL을 읽고 배치용 옵션만 받는다. 각 페이지가 배지를 복제하지 않는다.
- assets.ts: `hero`, `capture`, `edit`, `save` ID를 고정한다. kind와 이미지 메타데이터 또는 영상 src·poster, alt를 제공한다. 영상 대신 이미지도 받을 수 있게 한다.
- D가 먼저 미디어 ID·export 형태·실제 경로를 B에 전달한다. 미디어 전달 전 B는 텍스트·배치를 진행하고 존재하지 않는 경로를 참조하지 않는다.
- FAQ 데이터: 고유 id, category, question, answer. 링크는 명시적으로 보존하고 원격 HTML을 런타임 주입하지 않는다.
- 문서 스타일은 C 레이아웃에 한정한다. B·C는 전역 CSS·공통 토큰을 직접 수정하지 않는다.

## 8. 병렬 실행 순서

최대 4개 역할을 기준으로 한다. 이번에는 계획만 작성하며 실제 에이전트 실행·코드 구현은 하지 않는다.

| ID | 역할 | 담당 범위 | 선행 조건 | 산출물·완료 기준 |
| --- | --- | --- | --- | --- |
| P0 | A: 기반·공통 | Astro 구조, 버전 고정, 토큰, shared, footer, 404, 인터페이스 | 구현 착수 | 최소 페이지 빌드 성공, 공통 props·경로 계약 전달 |
| P1 | D: 리소스 | 조사·다운로드·최적화, assets 매핑, 배지·favicon·OG | P0의 ID·경로 합의. 조사는 먼저 가능 | 로컬 자산·출처 목록·크기 검사·미확보 항목 |
| P2 | B: 메인 | 메인과 home 섹션, 반응형, 다운로드 흐름 | P0. 미디어 연결은 P1 필요 | 모바일·데스크톱 메인, 두 스토어 CTA, 응원 영역 없음 |
| P3 | C: FAQ·정책 | 원문 수집·대조, FAQ, 문서 레이아웃, 정책 | 수집은 즉시 가능. 페이지 연결은 P0 필요 | FAQ 전체·정책 전문·대조 기록 |
| P4 | A: 통합 | SEO·sitemap·robots·headers, 검증, README | P0~P3 | 빌드·화면·링크 검증 통과, Pages 배포 가능한 dist |

```text
P0 기반·계약 ──┬── P2 메인 ─────────────┐
               ├── P3 FAQ·정책 ─────────┤
P1 리소스 조사 ┴── 미디어 확정·전달 ────┴── P4 통합·검증
```

- P0 동안 D는 자산 조사, C는 원문 수집을 진행할 수 있다. 페이지 구현은 공통 계약 이후 시작한다.
- P0 이후 B/C/D는 각 소유 파일에서 병렬 작업하며 A는 SEO·검사 준비를 진행한다.
- 의존성·스크립트 변경과 install은 A가 맡는다. lockfile을 동시에 수정하지 않는다.
- 공통 파일 변경은 소유자에게 요청한다. 다른 작업자 파일을 덮어쓰거나 되돌리지 않는다.
- Git 사용 시 P0 기준 커밋 이후 역할별 브랜치/작업 디렉터리로 분리한다. 공유 디렉터리라면 위 파일 소유권을 지킨다.
- 각 담당자는 변경 파일·검증 결과·남은 의존성을 전달한다. A가 전체 통합과 실제 미디어 요청을 최종 확인한다.

## 9. Cloudflare Pages 배포 준비

| 항목 | 설정 계획 |
| --- | --- |
| 방식 | Pages Git 연동 기본, 필요 시 dist Direct Upload 가능 |
| Framework preset | Astro |
| Root directory | 프로젝트 루트 |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Production branch | 실제 저장소 기본 브랜치 확인. 신규 기본안 main |
| Node | 로컬과 동일한 호환 LTS 명시 |
| 환경변수 | SITE_URL: 최종 공개 HTTPS origin |
| 서버 런타임 | 없음. Functions/SSR 어댑터 추가하지 않음 |

- build에서 HTML·sitemap·robots 생성 후 파일 크기·자산 누락·원본 CDN 참조 검사를 실행한다.
- Free 공식 제한: 월 500회 빌드, 동시 빌드 1개, 빌드 제한 20분, 파일 최대 20,000개, 개별 파일 최대 25 MiB. 병렬 개발과 배포 동시 빌드는 별개이며 불필요한 원격 빌드를 줄인다.
- 루트 404.html을 생성해 없는 경로가 메인으로 바뀌는 Pages SPA fallback을 피한다.
- Cloudflare 기본 캐시를 우선 사용한다. 해시 없는 HTML·정책 문서에 장기 immutable 캐시를 적용하지 않는다.
- 필요한 응답 헤더만 추가하고 Preview 기본 noindex를 덮어쓰지 않는지 확인한다.
- 최종 도메인 확정 후 canonical·OG·사이트맵·robots의 origin을 일치시킨다. 도메인 결정 전에도 로컬·Preview 검증은 가능하다.
- 기존 Slashpage 수정·DNS 전환 없이도 배포 가능한 산출물 준비까지 완료할 수 있다. 실제 공개와 기존 URL 이전은 후속 실행 작업이다.

## 10. 검증·인수 기준

많은 테스트 도구를 추가하지 않고 정적 산출물 검사와 핵심 경로 smoke 검증에 집중한다.

### 빌드·콘텐츠

- [ ] 고정 Node 환경에서 npm ci, npm run check, npm run build 성공.
- [ ] 네 페이지의 H1·본문·링크가 각각 HTML에 포함되고 JS 없이 읽기 가능.
- [ ] FAQ 질문·답변 전체와 정책 13개/약관 16개 대조항 및 하위 항목·날짜·링크 원문 대조.
- [ ] 페이지별 title·description·canonical·OG·lang 확인.
- [ ] sitemap·robots origin 일치, 404 제외, placeholder 도메인 없음.
- [ ] 모든 로컬 자산 파일 존재, 개별 25 MiB 미만, 오류 HTML 파일 없음.
- [ ] 웹 산출물 HTML/CSS/JS에 원본 CDN 미디어 참조나 iframe 없음. 출처 문서 URL은 구분.
- [ ] 응원·댓글 UI·데이터·SDK 없음.

### 화면·동작

- [ ] 320~430px, 태블릿, 데스크톱에서 가로 넘침·미디어 잘림·footer 겹침 없음.
- [ ] 스토어 CTA, 내부 링크, mailto, 정책 외부 링크 정상.
- [ ] FAQ 키보드 조작·focus·목차·200% 확대 확인.
- [ ] 모바일 Safari·Chrome에서 레이아웃·영상/포스터 확인.
- [ ] 네트워크 요청에서 이미지·영상·배지·폰트가 동일 출처로 제공됨.
- [ ] Lighthouse 모바일 Performance/Accessibility/SEO 각 90 이상 목표로 1차 측정하고 실제 결과·측정 조건 기록.

### 배포 후 별도 확인

- [ ] Preview에서 네 경로 직접 진입·새로고침, 없는 경로 HTTP 404 확인.
- [ ] Preview 응답 noindex 확인, 프로덕션 index 가능 여부 확인.
- [ ] 실제 도메인 HTTPS·canonical·OG·사이트맵·자산 HTTP 응답 확인.
- [ ] 앱·스토어·Slashpage의 후속 URL 변경 목록 작성. 앱 코드는 수정하지 않음.

## 11. 외부 의존성과 완료 정의

| 항목 | 독립적으로 진행할 일 | 해결 기준 |
| --- | --- | --- |
| 최종 도메인 미정 | UI·콘텐츠·빌드·Preview | 공개 전 SITE_URL·도메인 확정 |
| Git 원격 저장소 미정 | 로컬 구현·검증·dist 생성 | Git 연동 배포 시 저장소 연결 |
| 일부 CDN 조회 403 | 텍스트·정책·레이아웃·확보 가능한 이미지 처리 | 미디어 확정 전 원본 또는 정상 로컬 대체 이미지 확보. 누락을 숨기지 않음 |
| 정책의 호스팅 언급·오탈자 | 원문 그대로 이관하고 차이 목록 작성 | 공개 전 운영자가 수정 필요 여부 판단 |

구현 완료 결과물은 소스, 실제 로컬 자산, 원문 대조·출처 기록, 실행·배포 README, 검증 결과다. 이번 문서는 구현 계획이며 다운로드·빌드·배포 완료를 의미하지 않는다.

## 12. 공식 기술 참고

- Pages 제한: https://developers.cloudflare.com/pages/platform/limits/
- Pages Astro 빌드 설정: https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/
- Preview·noindex: https://developers.cloudflare.com/pages/configuration/preview-deployments/
- 경로·404·캐시: https://developers.cloudflare.com/pages/configuration/serving-pages/
- Astro Cloudflare 가이드: https://docs.astro.build/en/guides/deploy/cloudflare/

Astro의 최신 Cloudflare 가이드는 신규 프로젝트에 Workers도 안내한다. 이 계획은 사용자가 제시한 **Pages** 문서와 정적 랜딩 요구에 맞춰 Pages를 선택한다. Workers 배포 명령·SSR 어댑터를 Pages 설정과 섞지 않는다.
