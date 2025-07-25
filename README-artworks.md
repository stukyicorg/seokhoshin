# 작품 데이터 관리 가이드

현재 포트폴리오 사이트는 `/utils/artworkLoader.ts` 파일을 통해 작품 정보를 관리합니다.

## 새 작품 추가하기

### 1. artworkLoader.ts 파일 수정

`/utils/artworkLoader.ts` 파일의 `artworkData` 배열에 새로운 작품 객체를 추가합니다.

### 2. 작품 데이터 구조

```typescript
{
  id: '고유번호',
  title: '작품 제목',
  year: 년도, // 숫자
  materials: '사용 재료',
  dimensions: '크기',
  projectNumber: '프로젝트 번호',
  description: `작품에 대한 상세 설명.

  여러 단락으로 작성 가능합니다.`,
  images: [
    '이미지 URL 1',
    '이미지 URL 2'
  ]
}
```

### 3. 예시 - 새 작품 추가

```typescript
{
  id: '5',
  title: 'New Dawn',
  year: 2025,
  materials: 'Stainless Steel, Glass',
  dimensions: '250 × 150 × 100cm',
  projectNumber: '005',
  description: `새로운 시작을 상징하는 조각 작품으로, 스테인리스 스틸의 차가운 질감과 유리의 투명함이 대조를 이룹니다.

빛의 굴절을 통해 시간의 흐름을 표현하며, 관람자의 위치에 따라 다른 모습을 보여줍니다.`,
  images: [
    'https://images.unsplash.com/photo-1234567890?w=800&h=1000&fit=crop',
    'https://images.unsplash.com/photo-0987654321?w=800&h=1000&fit=crop'
  ]
}
```

## 이미지 사용 가이드

### Unsplash 이미지

- `https://images.unsplash.com/photo-[ID]?w=800&h=1000&fit=crop` 형식 사용
- 조각, 예술 작품과 관련된 키워드로 검색하여 적절한 이미지 선택

### 실제 작품 사진

- 고해상도 이미지를 웹에 업로드하고 URL 사용
- 권장 비율: 4:5 (세로가 더 긴 형태)
- 최소 해상도: 800x1000px

## 주의사항

1. **고유 ID**: 각 작품의 `id`는 중복되지 않아야 합니다.
2. **년도**: `year` 필드는 숫자로 입력해야 합니다 (따옴표 없이).
3. **이미지 배열**: 최소 1개, 최대 여러 개의 이미지를 배열로 입력합니다.
4. **설명 텍스트**: 여러 단락을 작성할 때는 백틱(`)을 사용하고 \n\n으로 단락을 구분합니다.

## MD 파일 지원 계획

현재는 JavaScript 객체 형식으로 데이터를 관리하지만, 향후 실제 MD 파일을 지원할 수 있도록 파서 함수들이 `/utils/artworkParser.ts`에 준비되어 있습니다.

프로덕션 환경에서는 CMS나 파일 시스템을 통해 MD 파일을 직접 로드할 수 있습니다.