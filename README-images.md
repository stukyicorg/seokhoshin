# 이미지 사용 가이드

## 이미지 저장 위치
이미지 파일들을 `public/images/artworks/` 폴더에 저장하세요.

## MD 파일에서 이미지 경로 작성 방법

### 1. 로컬 이미지 (권장)
```yaml
images:
  - "/images/artworks/작품명-1.jpg"
  - "/images/artworks/작품명-2.png"
```

경로는 반드시 `/`로 시작해야 합니다. 이는 public 폴더를 기준으로 한 경로입니다.

### 2. 외부 URL 이미지
```yaml
images:
  - "https://example.com/image.jpg"
  - "https://cdn.example.com/artwork.png"
```

## 실제 사용 예시

1. 이미지 파일을 `public/images/artworks/` 폴더에 복사
   예: `silent-conversations-1.jpg`

2. MD 파일에서 참조:
```yaml
---
id: "4"
title: "Silent Conversations"
year: 2022
materials: "Clay, Bronze"
dimensions: "140 × 60 × 50cm"
projectNumber: "004"
images:
  - "/images/artworks/silent-conversations-1.jpg"
  - "/images/artworks/silent-conversations-2.jpg"
---
```

## 지원하는 이미지 형식
- JPG/JPEG
- PNG
- GIF
- WebP
- SVG

## 권장사항
- 이미지 크기: 800x1000px 이상
- 파일명: 영문 소문자, 하이픈(-) 사용
- 파일 크기: 2MB 이하 권장