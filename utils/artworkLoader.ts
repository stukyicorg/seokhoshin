import { Artwork } from '../App';

// 실제 환경에서 MD 파일을 로드하는 대안 방법
// 각 작품을 개별 객체로 정의하여 MD 파일과 동일한 구조 유지

export const artworkData: Artwork[] = [
  {
    id: '1',
    title: 'Fragmented Memory',
    year: 2024,
    materials: 'Bronze, Steel',
    dimensions: '150 × 80 × 60cm',
    projectNumber: '001',
    description: `A sculptural exploration of memory and time, where fragmented bronze pieces represent the scattered nature of human recollection. This work delves into the philosophical concepts of how we process and store memories, using the inherent properties of bronze to symbolize permanence while the fragmented structure suggests the incomplete nature of remembrance.

The interplay between the rigid steel framework and the organic bronze elements creates a dialogue about structure versus chaos in our mental processes.`,
    images: [
      'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=1000&fit=crop'
    ]
  },
  {
    id: '2',
    title: 'Urban Echoes',
    year: 2024,
    materials: 'Concrete, Iron',
    dimensions: '200 × 120 × 90cm',
    projectNumber: '002',
    description: `An abstract representation of city life, capturing the rhythm and chaos of urban environments through geometric forms. The concrete base represents the foundation of modern civilization, while the iron elements reach upward like architectural aspirations.

This piece explores the contradiction between human desire for order and the inherent chaos of urban living. The rough texture of concrete contrasts with the refined geometry of the iron components, creating visual tension that mirrors the urban experience.`,
    images: [
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1544967882-6abcb1c62d43?w=800&h=1000&fit=crop'
    ]
  },
  {
    id: '3',
    title: 'Organic Flow',
    year: 2023,
    materials: 'Marble, Wood',
    dimensions: '180 × 100 × 70cm',
    projectNumber: '003',
    description: `A harmonious blend of natural materials exploring the relationship between organic and geometric forms. The smooth marble surface flows seamlessly into the textured wood, creating a dialogue between refined and raw natural elements.

This work investigates the boundaries between nature and human intervention. The careful balance between the two materials suggests that harmony can be achieved when we respect rather than dominate natural forms.`,
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=1000&fit=crop'
    ]
  },
  {
    id: '4',
    title: 'Silent Conversations',
    year: 2022,
    materials: 'Clay, Bronze',
    dimensions: '140 × 60 × 50cm',
    projectNumber: '004',
    description: `An exploration of human connection and isolation through abstract figurative forms. The clay elements represent the malleable nature of human relationships, while the bronze components symbolize the lasting impact of meaningful encounters.

This piece reflects on the unspoken communication that occurs between individuals - the subtle gestures, shared glances, and understood silences that form the foundation of deep human connection.`,
    images: [
      'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=1000&fit=crop'
    ]
  }
];

export async function loadAllArtworks(): Promise<Artwork[]> {
  // 시뮬레이션된 비동기 로딩
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(artworkData);
    }, 100);
  });
}