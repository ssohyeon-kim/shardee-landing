# 다국어 · SEO · AEO 구현 검증

검증일 2026-10-30. 한국어(ko), 영어(en), 일본어(ja), 번체(zh-Hant), 간체(zh-Hans)의 메인·FAQ·개인정보·약관 20개 정식 정적 HTML과 언어별 404, 기존 기본 주소 호환 페이지를 생성한다.

## 주소와 선택

- `/{locale}/`, `/{locale}/faq/`, `/{locale}/privacy/`, `/{locale}/terms/`가 정식 색인 주소다.
- `?lang=en` 등 강제 입력 → 명시적 언어 경로 → 저장된 선택 → 브라우저 언어 → 한국어 기본값 순서로 결정한다. 언어별 경로를 직접 열면 브라우저 언어가 달라도 자동 전환하지 않는다.
- 기본 주소와 강제 query 요청만 클라이언트에서 해당 언어 경로로 연결한다. 예: `/privacy/?lang=en` → `/en/privacy/`. `?lang=zh-TW`와 `zh-CN`은 각각 `zh-Hant`와 `zh-Hans`로 정규화한다. 그 밖의 query/hash는 보존한다.
- 브라우저 저장소가 차단되어도 강제 query와 실제 언어 링크는 작동한다. 방문 시 번역 API나 원본 사이트에 요청하지 않는다.
- 실제 Chrome에서 `/privacy/?lang=en` → 영어 개인정보13조항, 헤더 日本語 선택 → 일본어 동일 문서, 이후 `/` → 선택한 `/ja/` 유지, `/?lang=ko` → `/ko/`를 확인했다.
- 기존 외부 `Terms of Use (En)`·`Privacy Policy (En)`·`FAQ in English` 바로가기는 사용자 요청으로 제거했다. 헤더 오른쪽에서 현재 페이지를 다른 언어로 전환한다.

## 검색과 구조화 데이터

모든 정식 페이지에 번역 title/description·lang·OG/Twitter, 자기 canonical, 5개 언어의 상호 hreflang 및 기본 주소 x-default를 출력한다. 사이트맵에는 20개 정식 주소만 포함하고 404는 noindex다. 기본 주소 호환 페이지의 canonical은 해당 한국어 정식 주소다.

Organization·WebSite·SoftwareApplication·WebPage는 동일한 식별자로 연결하고 하위 페이지에 BreadcrumbList를 제공한다. FAQPage는 실제 같은 화면에 있는18개 질문과 전체 답변을 해당 앵커와 함께 출력한다. 정책은13/16개 조항과 원본 버전/업데이트일을 연결한다. 가격·평점·리뷰·앱 지원 언어·검색 기능은 추측해서 추가하지 않는다. 정책 번역문은 한국어 원문에서 번역했음을 본문 외부에 표시한다.

AEO는 정적 본문과 자족적인 질문·전체 답변, 의미 있는 제목 계층과 제품/운영 주체 연결로 지원한다. 사이트 방문자가 읽는 본문과 구조화 답변을 다르게 만들지 않는다. 별도의 AI 크롤러 차단 규칙을 추가하지 않았고 기존 robots 전체 Allow를 유지한다. AI 학습 허용과 검색 인용을 같은 개념으로 취급하지 않는다.

## 검증 결과

- `npm run check`: errors/warnings/hints 0.
- 4322 개발 서버의20개 정식 경로에 실제 HTTP 요청하여 전부200과 올바른 HTML lang을 확인했다. 4322는 사용자 요청대로 계속 실행한다.
- `npm run build`: 20개 정식 페이지와 호환/404 포함30개 HTML 생성; 로컬 자산/링크/앵커/메타/상호 hreflang/사이트맵 검사 통과.
- `npm test`: 7개 테스트 통과. 한국어 원문 전체, 번역 UI 키·FAQ18 IDs/답변·원문 링크, 법률 Markdown 블록/중첩 목록/실제 HTML 전체 구조, 20개 graph, 개인 이메일 비노출, query 우선순위/정규화/저장소 예외를 검증한다.
- 실제 Chrome 320px viewport에서 20개 공개 페이지 전부 document.scrollWidth=320, H1 하나, 올바른 HTML lang 확인. `i18n-mobile-metrics.json`.
- 다국어 적용 후 영어 FAQ를 정적 preview에서 Lighthouse13.6.0 mobile 기본 조건으로 측정: Performance100 / Accessibility100 / SEO100. `lighthouse-i18n-faq.json`. 이 측정은 영어 FAQ 한 페이지의 결과이며 모든 페이지 또는 실제 공개 사이트의 점수로 확대 해석하지 않는다. 측정 후 변경은 사용자가 요청한 기존 영문 바로가기 제거다.
- 각 언어의 FAQ18·개인정보13·약관16 전체 번역은 `docs/reference/translation-*.md`의 대조 기록을 참고한다. 번역 조항 번호/링크/날짜/구조를 보존했다. Markdown의 자동 따옴표 변환을 끄고 원문 표기를 유지한다.

## 공식 문서 확인

[Google 다국어 사이트](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)는 언어별 고유 주소와 수동 전환 링크를 권장한다. [언어 적응형 페이지](https://developers.google.com/search/docs/specialty/international/locale-adaptive-pages)는 브라우저 언어만으로 바꾸는 경우 모든 변형이 색인되지 않을 수 있음을 설명한다. [URL 구조](https://developers.google.com/search/docs/crawling-indexing/url-structure)는 표준 query key=value 형식을 지원한다. 따라서 query 자체가 SEO를 금지하는 것은 아니지만, 현재 정적 배포에서는 query를 선택 입력으로만 사용하고 각 번역을 독립 정적 주소로 색인 가능하게 제공한다.

[hreflang 지침](https://developers.google.com/search/docs/specialty/international/localized-versions)에 따라 자기 자신을 포함한 상호 절대 URL을 제공한다. [Google AI 검색 기능 가이드](https://developers.google.com/search/docs/appearance/ai-features)에 따르면 기본 SEO 원칙이 AI 기능에도 적용되며 별도의 특별 마크업이 필수인 것은 아니다. [구조화 데이터 지침](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)에서 설명하듯 올바른 마크업만으로 노출을 보장하지는 않는다.

실제 공개 도메인은 아직 지정하지 않았으며 로컬 canonical origin은 개발용 localhost다. 공개 전 SITE_URL 설정, Search Console/실제 index 응답·배포된 hreflang/정책 URL 연결은 README의 후속 배포 절차를 따른다.
