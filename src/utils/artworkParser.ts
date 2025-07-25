import { Artwork } from '../App';

interface ArtworkMatter {
  id: string;
  title: string;
  year: number;
  materials: string;
  dimensions: string;
  projectNumber: string;
  images: string[];
}

// MD 파일의 frontmatter와 content를 파싱하는 함수
export function parseArtworkMD(content: string): Artwork {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    throw new Error('Invalid markdown format');
  }
  
  const [, frontmatter, description] = match;
  const matter: ArtworkMatter = parseFrontmatter(frontmatter);
  
  return {
    ...matter,
    description: description.trim()
  };
}

function parseFrontmatter(frontmatter: string): ArtworkMatter {
  const lines = frontmatter.split('\n');
  const result: any = {};
  let currentKey = '';
  let inArray = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    if (trimmed.startsWith('-')) {
      // Array item
      if (inArray && currentKey) {
        if (!result[currentKey]) result[currentKey] = [];
        result[currentKey].push(trimmed.substring(1).trim().replace(/['"]/g, ''));
      }
    } else if (trimmed.includes(':')) {
      const [key, ...valueParts] = trimmed.split(':');
      const value = valueParts.join(':').trim();
      const cleanKey = key.trim();
      
      if (value === '') {
        // This might be the start of an array
        currentKey = cleanKey;
        inArray = true;
      } else {
        inArray = false;
        currentKey = '';
        
        // Parse the value
        let parsedValue: any = value.replace(/['"]/g, '');
        
        // Convert numbers
        if (cleanKey === 'year' && !isNaN(Number(parsedValue))) {
          parsedValue = Number(parsedValue);
        }
        
        result[cleanKey] = parsedValue;
      }
    }
  }
  
  return result as ArtworkMatter;
}

// 모든 작품 데이터를 로드하는 함수
export async function loadAllArtworks(): Promise<Artwork[]> {
  // 현재 환경에서는 동적 MD 파일 import가 제한적이므로 fallback 데이터를 사용합니다.
  // 실제 프로덕션에서는 파일 시스템이나 CMS를 통해 데이터를 로드할 수 있습니다.
  
  console.log('Loading artworks from fallback data...');
  return getFallbackArtworks();
}

// MD 파일 데이터를 기반으로 한 작품 데이터
function getFallbackArtworks(): Artwork[] {
  return [
    {
      id: '1',
      title: 'Fragmented Memory',
      year: 2024,
      materials: 'Bronze, Steel',
      dimensions: '150 × 80 × 60cm',
      description: 'A sculptural exploration of memory and time, where fragmented bronze pieces represent the scattered nature of human recollection. This work delves into the philosophical concepts of how we process and store memories, using the inherent properties of bronze to symbolize permanence while the fragmented structure suggests the incomplete nature of remembrance.\n\nThe interplay between the rigid steel framework and the organic bronze elements creates a dialogue about structure versus chaos in our mental processes.',
      images: [
        'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=1000&fit=crop'
      ],
      projectNumber: '001'
    },
    {
      id: '2',
      title: 'Urban Echoes',
      year: 2024,
      materials: 'Concrete, Iron',
      dimensions: '200 × 120 × 90cm',
      description: 'An abstract representation of city life, capturing the rhythm and chaos of urban environments through geometric forms. The concrete base represents the foundation of modern civilization, while the iron elements reach upward like architectural aspirations.\n\nThis piece explores the contradiction between human desire for order and the inherent chaos of urban living. The rough texture of concrete contrasts with the refined geometry of the iron components, creating visual tension that mirrors the urban experience.',
      images: [
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1544967882-6abcb1c62d43?w=800&h=1000&fit=crop'
      ],
      projectNumber: '002'
    },
    {
      id: '3',
      title: 'Organic Flow',
      year: 2023,
      materials: 'Marble, Wood',
      dimensions: '180 × 100 × 70cm',
      description: 'A harmonious blend of natural materials exploring the relationship between organic and geometric forms. The smooth marble surface flows seamlessly into the textured wood, creating a dialogue between refined and raw natural elements.\n\nThis work investigates the boundaries between nature and human intervention. The careful balance between the two materials suggests that harmony can be achieved when we respect rather than dominate natural forms.',
      images: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=1000&fit=crop'
      ],
      projectNumber: '003'
    },
    {
      id: '4',
      title: 'Silent Conversations',
      year: 2022,
      materials: 'Clay, Bronze',
      dimensions: '140 × 60 × 50cm',
      description: 'An exploration of human connection and isolation through abstract figurative forms. The clay elements represent the malleable nature of human relationships, while the bronze components symbolize the lasting impact of meaningful encounters.\n\nThis piece reflects on the unspoken communication that occurs between individuals - the subtle gestures, shared glances, and understood silences that form the foundation of deep human connection.',
      images: [
        'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=1000&fit=crop'
      ],
      projectNumber: '004'
    }
  ];
}

// 향후 실제 MD 파일을 로드할 때 사용할 함수들
export function parseArtworkMD(content: string): Artwork {
  // content가 문자열인지 확인
  if (typeof content !== 'string') {
    console.error('Content is not a string:', typeof content, content);
    throw new Error('Content must be a string');
  }

  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    throw new Error('Invalid markdown format');
  }
  
  const [, frontmatter, description] = match;
  const matter: ArtworkMatter = parseFrontmatter(frontmatter);
  
  return {
    ...matter,
    description: description.trim()
  };
}