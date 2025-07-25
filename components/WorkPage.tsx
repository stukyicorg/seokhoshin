import React, { useState } from 'react';
import { Artwork } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface WorkPageProps {
  artwork: Artwork;
  onBack: () => void;
}

export function WorkPage({ artwork, onBack }: WorkPageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* 헤더 */}
      <div className="border-b border-gray-200 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-8 space-y-2 md:space-y-0">
          <div className="bg-gray-100 px-3 py-1 text-sm w-fit">
            📋 TEST PRESENTATION
          </div>
          <div className="text-center md:text-left">
            <div className="font-mono text-sm">Ut Id Felis Metus</div>
            <div className="text-sm opacity-60">2265-23</div>
          </div>
        </div>
        
        <div className="text-left md:text-right">
          <div className="text-sm">Nam Consectetur Ante</div>
          <div className="text-sm opacity-60">Network: 📧 📸</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 grid-cols-1 gap-8 p-4 md:p-8 min-h-[calc(100vh-80px)]">
        {/* 왼쪽 - 작품 이미지들 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="text-sm opacity-60 mb-4">
            Non Rhoncus (ut id felis metus)
          </div>
          
          <div className="space-y-4">
            {artwork.images.map((image, index) => (
              <div key={index} className="w-full">
                <ImageWithFallback
                  src={image}
                  alt={`${artwork.title} - Image ${index + 1}`}
                  className="w-full h-auto object-cover rounded"
                />
              </div>
            ))}
          </div>

          {/* 하단 이미지들 - 추가 작업 예시 */}
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mt-8">
            <div className="aspect-video bg-blue-100 rounded">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=300&fit=crop"
                alt="Additional work 1"
                className="w-full h-full object-cover rounded"
              />
            </div>
            <div className="aspect-video bg-red-100 rounded">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop"
                alt="Additional work 2"
                className="w-full h-full object-cover rounded"
              />
            </div>
          </div>
        </div>

        {/* 오른쪽 - 작품 정보 */}
        <div className="space-y-8">
          {/* 제목 */}
          <div className="text-6xl tracking-tight">
            A
          </div>

          {/* 작품 정보 박스 */}
          <div className="bg-yellow-200 p-4 rounded">
            <div className="font-mono text-sm mb-2">Test Board 01</div>
            <p className="text-sm leading-relaxed">
              {artwork.description}
            </p>
            
            <div className="mt-4 space-y-1 text-sm">
              <div>1. {artwork.title}</div>
              <div>2. Materials: {artwork.materials}</div>
              <div>3. Dimensions: {artwork.dimensions}</div>
              <div>4. Year: {artwork.year}</div>
              <div>5. Project Number: {artwork.projectNumber}</div>
              <div>6. Status: Completed</div>
            </div>
          </div>

          {/* 상세 설명 */}
          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              Ut id felis metus. Donec a tempor turpis. Mauris 
              quis tristique libero. Donec auctor ut elit eu 
              lobortis. Sed sit amet tempor orci, a faucibus enim.
            </p>
            
            <p>
              Maecenas hendrerit lorem arcu ornare tempus. 
              Pellentesque rutrum. Proin tristique dolor est, 
              vestibulum vulputate. Phasellus ut pretium risus. Morbi porta sit orci eu 
              tincidunt. Vivamus quis nulla orci.
            </p>
          </div>

          {/* 뒤로 가기 버튼 */}
          <button
            onClick={onBack}
            className="text-sm opacity-60 hover:opacity-100 transition-opacity border-b border-transparent hover:border-black pb-1"
          >
            ← Back to Index
          </button>
        </div>
      </div>
    </div>
  );
}