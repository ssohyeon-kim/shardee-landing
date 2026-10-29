# 메인 페이지 UI 검증

검증일: 2026-10-30 (Asia/Seoul)

## 환경

- Node v24.14.1, macOS의 실제 Chrome, CUA browser extension.
- 개발 서버: `http://127.0.0.1:4322/` (`npm run dev -- --port 4322`).
- 원본 `https://slashpage.com/shardee`도 Chrome 화면으로 확인했다. 원본의 짙은 배경, 밝은 글자, 실제 야경 커버와 촬영·편집·저장 미디어를 바탕으로 구성했다.
- 이 결과는 Chrome의 viewport override 검사다. 실제 iOS Safari/Android Chrome 기기 검사를 의미하지 않는다.

## 화면 크기

각 크기에서 실제 DOM의 `document.documentElement.scrollWidth`와 `innerWidth`를 비교했다. 본문 글꼴은 16px이고 H1은 하나였다.

| viewport 너비 | 문서 너비 | 가로 넘침 | 완료된 이미지 중 오류 |
| --- | --- | --- | --- |
| 320px | 320px | 없음 | 없음 |
| 360px | 360px | 없음 | 없음 |
| 390px | 390px | 없음 | 없음 |
| 430px | 430px | 없음 | 없음 |
| 768px | 768px | 없음 | 없음 |
| 1280px | 1280px | 없음 | 없음 |
| 1440px | 1440px | 없음 | 없음 |

320px와 데스크톱 화면을 스크린샷으로 직접 확인했다. 320px에서 제목·버튼·커버가 한 열로 표시되고, 데스크톱에서는 소개/미디어 두 열로 표시된다. 촬영·편집의 세로 이미지와 저장의 가로 이미지는 원래 종횡비를 유지한다.

전체 화면 증빙: [home-desktop.jpg](./home-desktop.jpg) (1497×4302, 기본 Chrome 창 크기). 최종 정적 빌드 `http://127.0.0.1:4323/`에서 다시 촬영했다. 저장 섹션으로 실제 이동한 뒤 이미지 8개 모두 `complete: true` 및 `naturalWidth > 0`임을 확인했다. 저장 이미지의 naturalWidth는 540px이었다. 페이지 이동이나 새로고침 없이 첫 제목으로 돌아와 scrollY 0에서 전체 화면을 캡처하고, 저장 이미지가 포함된 결과 파일을 다시 열어 확인했다.

## 동작과 미디어

- 헤더의 다운로드 링크 클릭 후 URL이 `/#download`로 바뀌고 최종 CTA가 화면에 표시되는 것을 확인했다.
- App Store/Google Play 버튼은 접근성 이름을 가지며 공통 설정의 실제 앱 URL을 사용한다. 강제 OS 감지 이동은 없다.
- 하단까지 이동한 뒤 이미지 8개 전부 `complete && naturalWidth > 0`이었다. 두 쌍의 스토어 배지와 4개 콘텐츠 이미지가 포함된다.
- 8개 이미지의 실제 `currentSrc` origin은 모두 `http://127.0.0.1:4322`였다. 동영상·iframe·audio는 0개다. 개발용 Vite 스크립트도 모두 동일 출처였다. 정적 배포물의 최종 검사는 통합 빌드 검사에서 별도로 수행한다.
- 본문 구조는 Hero → 촬영 → 편집 → 저장 → 최종 다운로드 → 공통 footer 순서였다. 응원·댓글·후원 영역은 없다.
- `npm run check`: 22개 파일, errors 0 / warnings 0 / hints 0.

## 범위와 확인 한계

- CUA 브라우저는 viewport와 탭 자산 기능만 제공했다. reduced-motion 에뮬레이션과 네트워크 요청 타임라인은 제공하지 않는다. 화면의 실제 이미지 URL과 코드의 로컬 매핑으로 이미지 동일 출처를 확인했다.
- 커버는 애니메이션의 실제 첫 프레임 정지 이미지다. 메인에는 자동 재생/애니메이션이 없다. 공통 스타일은 `prefers-reduced-motion`에서 부드러운 스크롤과 전환을 제거한다.
- CUA 탭의 확대 단축키를 시도했으나 `devicePixelRatio` 및 `innerWidth`가 바뀌지 않아 실제 200% 확대가 적용됐다는 증거를 얻지 못했다. 단축키를 원복하고 임시 viewport override를 reset했다. 200% 및 OS 글자 확대는 별도 확인이 필요하다.
- Safari 및 실제 모바일 기기, 공개 배포 후 요청·색인 응답은 이번 메인 UI 검사에 포함되지 않는다.
- Lighthouse 측정은 통합 담당자가 별도 수행한다.
