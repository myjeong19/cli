# NotionPresso CLI

Notion 페이지의 데이터를 추출하여 로컬에 JSON 형식으로 저장하는 CLI 도구입니다.

## 주요 기능

- **모든 페이지 자동 추출**: `--all` 옵션으로 권한 있는 모든 페이지 일괄 처리
- **개별 페이지 추출**: 특정 페이지 URL로 단일 페이지 처리
- **환경변수 지원**: `.env` 파일에서 API 키 자동 읽기
- **스마트 파일명**: 페이지 제목 기반의 읽기 쉬운 파일명 생성
- **이미지 다운로드**: 페이지 내 이미지 자동 다운로드 및 로컬 저장
- **북마크 메타데이터**: 확장된 북마크 정보 추출
- **선택적 업데이트**: 변경된 페이지만 자동으로 감지하여 업데이트

## 설치

### npm 설치

```bash
npm install -g @notionpresso/cli
```

### 로컬 빌드

```bash
git clone https://github.com/notionpresso/cli.git
cd cli
npm install
npm run build
```

## 사용 방법

### 1. 환경변수 설정 (권장)

프로젝트 루트에 Notion API 토큰을 포함한 `.env` 파일을 생성하세요:

```bash
echo "NOTION_API_SECRET=secret_your_internal_integration_secret_here" > .env
```

> 💡 **API 토큰 얻는 방법:**
>
> 1. [Notion 통합 페이지](https://www.notion.so/my-integrations) 방문
> 2. 새 통합 생성 또는 기존 통합 선택
> 3. "Internal Integration Token" 복사 (`secret_`으로 시작)
> 4. 노션 페이지를 해당 통합과 공유

### 2. 모든 페이지 추출

```bash
npresso --all
```

### 3. 개별 페이지 추출

```bash
npresso --page <NotionPageURL>

# 토큰을 직접 지정하는 경우
npresso --page <NotionPageURL> --auth <YourAPIToken>
```

## 명령어 옵션

- `--all`: 권한 있는 모든 페이지를 자동으로 찾아 추출
- `--page <pageUrl>`: 특정 페이지 URL 또는 ID 지정
- `--auth <token>`: Notion API 토큰 (환경변수 `NOTION_API_SECRET` 사용 권장)
- `--output-dir <dir>`: JSON 파일 출력 디렉토리 (기본값: `notion-data`)
- `--image-dir <dir>`: 이미지 파일 출력 디렉토리 (기본값: `public/notion-data`)

## 출력 결과

### 파일 구조

```
notion-data/
├── pages.json              ← 모든 페이지 목록 (--all 사용시)
├── my-blog-post.json       ← 개별 페이지 데이터 (제목 기반 파일명)
└── about-me.json

public/notion-data/
├── my-blog-post/           ← 페이지별 이미지 폴더
│   ├── image1.png
│   └── image2.jpg
└── about-me/
    └── profile.jpg
```

### pages.json 형식

```json
{
  "pages": [
    {
      "id": "page-id",
      "title": "My Blog Post",
      "last_edited_time": "2024-01-01T10:00:00.000Z",
      "fileName": "my-blog-post"
    }
  ]
}
```

## 사용 예시

### 초기 설정

```bash
# 1. API 키 설정
echo "NOTION_API_SECRET=secret_your_internal_integration_secret_here" > .env

# 2. 모든 페이지 추출
npresso --all
```

### 개별 페이지 처리

```bash
npresso --page https://notion.so/user/My-Page-abc123def456
```

### 커스텀 디렉토리

```bash
npresso --all --output-dir custom-data --image-dir assets/images
```

## 주요 개선사항

- ✅ **자동 페이지 발견**: Search API로 수동 URL 입력 불필요
- ✅ **읽기 쉬운 파일명**: ID 대신 페이지 제목 기반 파일명
- ✅ **환경변수 지원**: 매번 토큰 입력 불필요
- ✅ **이미지 다운로드**: 완전한 오프라인 백업
- ✅ **증분 업데이트**: 변경된 페이지만 처리로 빠른 동기화
- ✅ **페이지 목록 생성**: 프론트엔드 연동용 `pages.json` 제공

## 주의사항

- Notion API의 Search 기능 사용으로 모든 페이지가 발견되지 않을 수 있음
- 페이지가 통합(integration)과 공유되어 있어야 접근 가능
- 대량의 페이지 처리시 시간이 소요될 수 있음

## 기여

기여를 환영합니다! 자세한 내용은 [기여 가이드](./CONTRIBUTING-KR.md)를 참고해주세요.

## 라이선스

MIT 라이선스를 따릅니다.
