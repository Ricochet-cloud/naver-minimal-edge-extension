# NAVER Minimal - Microsoft Edge 확장 프로그램

네이버 메인 주소(`https://www.naver.com/` 또는 `https://naver.com/`)로 이동하면 확장 프로그램의 미니멀 검색 페이지로 자동 전환합니다.

## 설치 방법 (Edge)

1. ZIP 압축을 풉니다.
2. Edge 주소창에 `edge://extensions` 입력
3. 왼쪽 아래 또는 상단의 **개발자 모드**를 켭니다.
4. **압축 풀린 확장 로드**를 선택합니다.
5. 압축을 푼 `naver-minimal-edge-extension` 폴더를 선택합니다.
6. `https://www.naver.com/`에 접속해 동작을 확인합니다.

## 사용 방법

- 네이버 메인 페이지: 미니멀 페이지로 자동 전환
- 검색: 검색어 입력 후 Enter → 네이버 통합검색 결과
- 네이버 검색 결과 주소(`search.naver.com`) 및 그 외 네이버 하위 페이지: 변경하지 않음
- 새 탭: 변경하지 않음

## 참고

- Manifest V3 및 `declarativeNetRequest` 정적 규칙을 사용합니다.
- 확장 프로그램은 네이버 메인 URL의 최상위 문서 탐색만 전환합니다.
- 확장 프로그램을 제거하거나 비활성화하면 기존 네이버 홈으로 돌아갑니다.
- 폰트는 Google Fonts를 사용하며, 인터넷 연결이 없으면 시스템 기본 글꼴로 표시됩니다.
