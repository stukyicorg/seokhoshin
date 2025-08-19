import React, { useState, useEffect } from 'react';
import { Artwork } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { loadMainContent, MainContent } from '../utils/mainContentLoader';

interface MainPageProps {
  artworks: Artwork[];
  onArtworkClick: (artwork: Artwork) => void;
  onTextClick: () => void;
}

export function MainPage({ artworks, onArtworkClick, onTextClick }: MainPageProps) {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [currentArtworkIndex, setCurrentArtworkIndex] = useState<number>(0);
  const [mainContent, setMainContent] = useState<MainContent>({
    description: '',
    contact: ''
  });

  // 작품에서 년도 추출
  const years = [...new Set(artworks.map(artwork => artwork.year))].sort((a, b) => b - a);
  
  // 선택된 년도의 작품 필터링
  const filteredArtworks = artworks.filter(artwork => artwork.year === selectedYear);

  // 메인 콘텐츠 로드
  useEffect(() => {
    loadMainContent().then(content => {
      setMainContent(content);
    });
  }, []);

  // 년도가 변경될 때 인덱스 리셋
  React.useEffect(() => {
    setCurrentArtworkIndex(0);
  }, [selectedYear]);

  const handleNextArtwork = () => {
    setCurrentArtworkIndex((prev) => 
      prev < filteredArtworks.length - 1 ? prev + 1 : 0
    );
  };

  const handlePrevArtwork = () => {
    setCurrentArtworkIndex((prev) => 
      prev > 0 ? prev - 1 : filteredArtworks.length - 1
    );
  };

  return (
    <div className="min-h-screen p-8 relative">
      {/* 년도 네비게이션 - 왼쪽 상단 */}
      <div className="fixed top-8 left-8 z-10 md:block hidden">
        <h1 className="mb-8 opacity-60">Seokho Shin</h1>
        <h2 className="mb-2 opacity-60">Works</h2>
        <div className="space-y-1">
          {years.map((year, index) => (
            <div key={year}>
              <button
                onClick={() => setSelectedYear(year)}
                className={`text-left pl-4 transition-opacity hover:opacity-100 ${
                  selectedYear === year ? 'opacity-100' : 'opacity-60'
                }`}
              >
                {year}
              </button>
            </div>
          ))}
        </div>

        {/* Text 그룹 */}
        <div className="mt-8">
          <button 
            onClick={onTextClick}
            className="opacity-60 hover:opacity-100 transition-opacity text-left"
          >
            <h3 className="mb-2">Text</h3>
          </button>
        </div>

      </div>

      {/* 모바일 년도 네비게이션 */}
      <div className="md:hidden mb-8">
        <h1 className="mb-4 opacity-60">Seokho Shin</h1>
        <h2 className="mb-2 opacity-60">Works</h2>
        <div className="flex flex-wrap gap-4">
          {years.map((year, index) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-3 py-1 rounded transition-opacity hover:opacity-100 ${
                selectedYear === year ? 'opacity-100 bg-black text-white' : 'opacity-60'
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Text 그룹 - 모바일 */}
        <div className="mt-6">
          <button 
            onClick={onTextClick}
            className="opacity-60 hover:opacity-100 transition-opacity text-left"
          >
            <h3 className="mb-2">Text</h3>
          </button>
        </div>
      </div>

      {/* 작품 표시 - 오른쪽 */}
      <div className="md:ml-[32rem] md:pl-24">
        <div className="md:max-w-sm md:ml-auto md:mr-24">
          {/* 정보 섹션 */}
          <div className="mb-16 space-y-2 text-sm opacity-60 text-left">
            <div>
              {mainContent.description.split('\n\n').map((paragraph, index) => (
                <p key={index} className={index > 0 ? "mt-4" : ""}>
                  {paragraph.split('\n').map((line, lineIndex) => (
                    <React.Fragment key={lineIndex}>
                      {line}
                      {lineIndex < paragraph.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              ))}
            </div>
            {mainContent.contact && (
              <div className="mt-6">
                {mainContent.contact.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            )}
          </div>

          {filteredArtworks.length > 0 && (
            <div className="relative">
            {/* 현재 작품 */}
            <div 
              className="group cursor-pointer" 
              onClick={() => onArtworkClick(filteredArtworks[currentArtworkIndex])}
            >
              <div className="relative overflow-hidden bg-gray-100 aspect-[4/5]">
                <ImageWithFallback
                  src={typeof filteredArtworks[currentArtworkIndex].images[0] === 'string' 
                    ? filteredArtworks[currentArtworkIndex].images[0] 
                    : filteredArtworks[currentArtworkIndex].images[0].url}
                  alt={filteredArtworks[currentArtworkIndex].title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gray-800 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                
                {/* 네비게이션 버튼 - 작품이 2개 이상일 때만 표시 */}
                {filteredArtworks.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevArtwork();
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-800" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextArtwork();
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-800" />
                    </button>
                  </>
                )}
              </div>
              
              {/* 작품 정보 */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="opacity-80">{filteredArtworks[currentArtworkIndex].title}</h3>
                    <p className="text-sm opacity-60">{filteredArtworks[currentArtworkIndex].materials}</p>
                    <p className="text-sm opacity-60">{filteredArtworks[currentArtworkIndex].year}</p>
                  </div>
                  <div className="text-sm opacity-60">
                    {filteredArtworks[currentArtworkIndex].projectNumber}
                  </div>
                </div>
              </div>
            </div>

            {/* 작품 개수 표시 */}
            {filteredArtworks.length > 1 && (
              <div className="mt-2 text-xs opacity-40 text-center">
                {currentArtworkIndex + 1} / {filteredArtworks.length}
              </div>
            )}
            </div>
          )}
        </div>


      </div>
    </div>
  );
}