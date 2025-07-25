# GitHub Actions Workflows for Vercel Deployment

이 프로젝트는 GitHub Actions를 통해 Vercel로 자동 배포됩니다.

## 워크플로우

### 1. Production 배포 (`deploy-production.yml`)
- **트리거**: `main` 브랜치에 push될 때
- **동작**: Vercel production 환경으로 자동 배포

### 2. Preview 배포 (`deploy-preview.yml`)
- **트리거**: Pull Request가 열리거나 업데이트될 때
- **동작**: 
  - Vercel preview 환경으로 배포
  - PR에 preview URL 댓글 자동 작성

## 설정 방법

### 1. Vercel 토큰 생성
1. [Vercel 대시보드](https://vercel.com/account/tokens)에서 토큰 생성
2. 토큰 복사

### 2. Vercel 프로젝트 정보 가져오기
```bash
# Vercel CLI 설치 (이미 설치된 경우 생략)
npm i -g vercel

# 프로젝트 연결
vercel link

# .vercel/project.json 파일에서 정보 확인
cat .vercel/project.json
```

### 3. GitHub Secrets 설정
GitHub 레포지토리 → Settings → Secrets and variables → Actions에서 다음 시크릿 추가:

- `VERCEL_TOKEN`: Vercel에서 생성한 토큰
- `VERCEL_ORG_ID`: .vercel/project.json의 "orgId"
- `VERCEL_PROJECT_ID`: .vercel/project.json의 "projectId"

## 사용 방법

### Production 배포
```bash
# main 브랜치에 push하면 자동으로 production 배포
git push origin main
```

### Preview 배포
```bash
# PR을 생성하면 자동으로 preview 배포
git checkout -b feature/new-feature
git push origin feature/new-feature
# GitHub에서 PR 생성
```

## 주의사항
- `.vercel` 디렉토리는 절대 커밋하지 마세요 (.gitignore에 추가됨)
- 시크릿 정보는 안전하게 관리하세요
- Preview 배포는 PR당 하나씩 생성됩니다