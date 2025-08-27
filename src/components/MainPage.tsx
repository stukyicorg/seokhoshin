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
  // 작품에서 년도 추출
  const years = [...new Set(artworks.map(artwork => artwork.year))].sort((a, b) => b - a);
  
  // 랜덤한 년도로 초기화
  const getRandomYear = () => {
    if (years.length === 0) return 2024;
    const randomIndex = Math.floor(Math.random() * years.length);
    return years[randomIndex];
  };
  
  const [selectedYear, setSelectedYear] = useState<number>(getRandomYear());
  const [currentArtworkIndex, setCurrentArtworkIndex] = useState<number>(0);
  const [mainContent, setMainContent] = useState<MainContent>({
    description: '',
    contact: ''
  });
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [mouseStart, setMouseStart] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  
  // 스와이프 설정
  const minSwipeDistance = 50;
  const swipeThreshold = 0.1; // 화면 너비의 50%
  
  // 선택된 년도의 작품 필터링 및 projectNumber로 정렬
  const filteredArtworks = artworks
    .filter(artwork => artwork.year === selectedYear)
    .sort((a, b) => {
      // projectNumber로 정렬 (숫자 부분만 추출하여 비교)
      const aNum = parseInt(a.projectNumber.replace(/[^0-9]/g, '') || '0');
      const bNum = parseInt(b.projectNumber.replace(/[^0-9]/g, '') || '0');
      return aNum - bNum;
    });

  // 메인 콘텐츠 로드
  useEffect(() => {
    loadMainContent().then(content => {
      setMainContent(content);
    });
  }, []);

  // 년도가 변경될 때 인덱스 리셋 및 안전성 확인
  React.useEffect(() => {
    setCurrentArtworkIndex(0);
    setDragOffset(0);
    setIsDragging(false);
    setMouseStart(null);
    setTouchStart(null);
    setTouchEnd(null);
  }, [selectedYear]);

  // currentArtworkIndex가 유효한 범위를 벗어나면 보정
  React.useEffect(() => {
    if (filteredArtworks.length > 0 && currentArtworkIndex >= filteredArtworks.length) {
      setCurrentArtworkIndex(0);
    }
  }, [filteredArtworks.length, currentArtworkIndex]);

  // 전역 마우스 이벤트 핸들러를 위한 useEffect
  React.useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!mouseStart) return;
      
      let currentOffset = e.clientX - mouseStart;
      
      // 양 끝에서 저항 효과 적용
      const resistance = 0.3;
      const maxOverscroll = 100;
      
      // 첫 번째 이미지에서 오른쪽으로 드래그
      if (currentArtworkIndex === 0 && currentOffset > 0) {
        currentOffset = Math.min(currentOffset * resistance, maxOverscroll);
      }
      // 마지막 이미지에서 왼쪽으로 드래그
      else if (currentArtworkIndex === filteredArtworks.length - 1 && currentOffset < 0) {
        currentOffset = Math.max(currentOffset * resistance, -maxOverscroll);
      }
      
      setDragOffset(currentOffset);
      
      if (Math.abs(currentOffset) > 5) {
        setIsDragging(true);
      }
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (!mouseStart) return;
      
      // 컨테이너 너비를 추정 (뷰포트 너비의 일부)
      const containerWidth = window.innerWidth * 0.3; // 대략적인 이미지 컨테이너 너비
      const threshold = containerWidth * swipeThreshold;
      
      // 양 끝에서 오버스크롤된 경우는 무조건 원위치
      const isAtFirstAndOverscrolled = currentArtworkIndex === 0 && dragOffset > 0;
      const isAtLastAndOverscrolled = currentArtworkIndex === filteredArtworks.length - 1 && dragOffset < 0;
      
      if (!isAtFirstAndOverscrolled && !isAtLastAndOverscrolled && 
          isDragging && filteredArtworks.length > 1) {
        if (Math.abs(dragOffset) > threshold) {
          if (dragOffset < 0) {
            handleNextArtwork();
          } else {
            handlePrevArtwork();
          }
        }
      }
      
      setMouseStart(null);
      setIsDragging(false);
      setDragOffset(0);
    };

    if (mouseStart) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [mouseStart, isDragging, dragOffset, filteredArtworks.length, swipeThreshold, currentArtworkIndex]);

  // 자동 슬라이드 기능 (10초마다)
  React.useEffect(() => {
    if (filteredArtworks.length <= 1) return; // 작품이 1개 이하면 자동 슬라이드 불필요

    const intervalId = setInterval(() => {
      handleNextArtwork();
    }, 3000); // 10초

    // 컴포넌트 언마운트 시 또는 의존성 변경 시 인터벌 정리
    return () => clearInterval(intervalId);
  }, [filteredArtworks.length, currentArtworkIndex]);

  const handleNextArtwork = () => {
    if (filteredArtworks.length <= 1) return; // 작품이 1개 이하면 이동 불필요
    setCurrentArtworkIndex((prev) => {
      const nextIndex = prev < filteredArtworks.length - 1 ? prev + 1 : 0;
      return nextIndex < filteredArtworks.length ? nextIndex : 0;
    });
  };

  const handlePrevArtwork = () => {
    if (filteredArtworks.length <= 1) return; // 작품이 1개 이하면 이동 불필요
    setCurrentArtworkIndex((prev) => {
      const prevIndex = prev > 0 ? prev - 1 : filteredArtworks.length - 1;
      return prevIndex < filteredArtworks.length ? prevIndex : 0;
    });
  };


  // 터치 이벤트 핸들러
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setDragOffset(0);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);
    
    let offset = currentTouch - touchStart;
    
    // 양 끝에서 저항 효과 적용
    const resistance = 0.3; // 저항 계수 (0~1, 작을수록 더 뻑뻑함)
    const maxOverscroll = 100; // 최대 오버스크롤 거리
    
    // 첫 번째 이미지에서 오른쪽으로 드래그 (이전으로 가려고 할 때)
    if (currentArtworkIndex === 0 && offset > 0) {
      offset = Math.min(offset * resistance, maxOverscroll);
    }
    // 마지막 이미지에서 왼쪽으로 드래그 (다음으로 가려고 할 때)
    else if (currentArtworkIndex === filteredArtworks.length - 1 && offset < 0) {
      offset = Math.max(offset * resistance, -maxOverscroll);
    }
    
    setDragOffset(offset);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const containerWidth = (e.currentTarget as HTMLElement).offsetWidth;
    const threshold = containerWidth * swipeThreshold;
    
    // 양 끝에서 오버스크롤된 경우는 무조건 원위치
    const isAtFirstAndOverscrolled = currentArtworkIndex === 0 && dragOffset > 0;
    const isAtLastAndOverscrolled = currentArtworkIndex === filteredArtworks.length - 1 && dragOffset < 0;
    
    if (!isAtFirstAndOverscrolled && !isAtLastAndOverscrolled && 
        Math.abs(dragOffset) > threshold && filteredArtworks.length > 1) {
      if (dragOffset < 0) {
        handleNextArtwork();
      } else {
        handlePrevArtwork();
      }
    }
    
    setDragOffset(0);
    setTouchStart(null);
    setTouchEnd(null);
  };

  // 마우스 이벤트 핸들러
  const onMouseDown = (e: React.MouseEvent) => {
    setMouseStart(e.clientX);
    setIsDragging(false);
    setDragOffset(0);
    e.preventDefault();
  };

  const onMouseMove = (e: React.MouseEvent) => {
    // 전역 이벤트 핸들러에서 처리하므로 여기서는 preventDefault만
    e.preventDefault();
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (!mouseStart || isDragging) return; // 드래그 중이면 전역 핸들러에서 처리
    
    // 클릭한 경우만 처리
    if (!isDragging && filteredArtworks[currentArtworkIndex]) {
      onArtworkClick(filteredArtworks[currentArtworkIndex]);
    }
  };

  const onMouseLeave = () => {
    // 드래그 중이면 상태를 유지 (전역 핸들러가 처리)
    // 드래그가 아닐 때만 초기화
    if (!isDragging && !mouseStart) {
      setDragOffset(0);
    }
  };

  return (
    <div className="min-h-screen p-8 relative">
      {/* 년도 네비게이션 - 왼쪽 상단 */}
      <div className="fixed top-8 left-8 z-10 md:block hidden">
        <h1 className="mb-8 opacity-60">Seokho Shin</h1>
        <h2 className="mb-2 opacity-60">Works</h2>
        <div className="space-y-1">
          {years.map((year, index) => {
            const yearArtworks = artworks
              .filter(artwork => artwork.year === year)
              .sort((a, b) => {
                // projectNumber로 정렬 (숫자 부분만 추출하여 비교)
                const aNum = parseInt(a.projectNumber.replace(/[^0-9]/g, '') || '0');
                const bNum = parseInt(b.projectNumber.replace(/[^0-9]/g, '') || '0');
                return aNum - bNum;
              });
            return (
              <div key={year} className="flex items-start">
                <button
                  onClick={() => setSelectedYear(year)}
                  className={`text-left pl-4 transition-opacity hover:opacity-100 ${
                    selectedYear === year ? 'opacity-100' : 'opacity-60'
                  }`}
                >
                  {year}
                </button>
                
                {/* 서브메뉴 - 항상 표시 */}
                {selectedYear === year && yearArtworks.length > 0 && (
                  <div className="ml-8 space-y-1">
                    {yearArtworks.map((artwork, idx) => (
                      <button
                        key={artwork.id || idx}
                        onClick={() => {
                          setCurrentArtworkIndex(idx);
                        }}
                        className={`block text-left pl-4 text-sm transition-opacity hover:opacity-100 ${
                          currentArtworkIndex === idx ? 'opacity-100' : 'opacity-60'
                        }`}
                      >
                        {artwork.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
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
          {years.map((year, index) => {
            const yearArtworks = artworks
              .filter(artwork => artwork.year === year)
              .sort((a, b) => {
                const aNum = parseInt(a.projectNumber.replace(/[^0-9]/g, '') || '0');
                const bNum = parseInt(b.projectNumber.replace(/[^0-9]/g, '') || '0');
                return aNum - bNum;
              });
            return (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-3 py-1 rounded transition-opacity hover:opacity-100 ${
                  selectedYear === year ? 'opacity-100 bg-black text-white' : 'opacity-60'
                }`}
              >
                {year}
              </button>
            );
          })}
        </div>

        {/* 선택된 년도의 작품 목록 - 모바일 */}
        {years.map((year) => {
          const yearArtworks = artworks
            .filter(artwork => artwork.year === year)
            .sort((a, b) => {
              const aNum = parseInt(a.projectNumber.replace(/[^0-9]/g, '') || '0');
              const bNum = parseInt(b.projectNumber.replace(/[^0-9]/g, '') || '0');
              return aNum - bNum;
            });
          
          if (selectedYear === year && yearArtworks.length > 0) {
            return (
              <div key={`submenu-${year}`} className="mt-4 pl-4 space-y-1">
                {yearArtworks.map((artwork, idx) => (
                  <button
                    key={artwork.id || idx}
                    onClick={() => {
                      setCurrentArtworkIndex(idx);
                    }}
                    className={`block text-left text-sm transition-opacity hover:opacity-100 ${
                      currentArtworkIndex === idx ? 'opacity-100' : 'opacity-60'
                    }`}
                  >
                    {artwork.title}
                  </button>
                ))}
              </div>
            );
          }
          return null;
        })}

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

          {filteredArtworks.length > 0 && filteredArtworks[currentArtworkIndex] && (
            <div className="relative">
            {/* 현재 작품 */}
            <div 
              className={`group ${isDragging ? 'cursor-grabbing' : 'cursor-pointer'}`}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseLeave}
            >
              <div className="relative overflow-hidden aspect-[4/5] bg-white">
                {/* 슬라이드 컨테이너 */}
                <div 
                  className={`flex h-full ${isDragging || dragOffset !== 0 ? '' : 'transition-transform duration-500 ease-in-out'}`}
                  style={{ 
                    transform: `translateX(calc(-${currentArtworkIndex * 100}% + ${dragOffset}px))` 
                  }}
                >
                  {filteredArtworks.map((artwork, index) => (
                    <div key={artwork.id || index} className="w-full h-full flex-shrink-0">
                      {artwork.images && artwork.images.length > 0 ? (
                        <ImageWithFallback
                          src={typeof artwork.images[0] === 'string' 
                            ? artwork.images[0] 
                            : artwork.images[0].url}
                          alt={artwork.title}
                          className="w-full h-full object-cover select-none"
                          draggable={false}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white text-gray-400">
                          <div className="text-center">
                            <p className="text-sm">No image available</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 bg-gray-800 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
                
                {/* 네비게이션 버튼 - 작품이 2개 이상일 때만 표시 */}
                {filteredArtworks.length > 1 && (
                  <>
                    <button
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handlePrevArtwork();
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-sm z-10"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-800" />
                    </button>
                    <button
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleNextArtwork();
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-sm z-10"
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
