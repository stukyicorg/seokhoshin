import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Artwork, ImageConfig, MediaItem, YouTubeConfig } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { YouTubeEmbed, extractYouTubeId, splitYouTubeSegments } from './YouTubeEmbed';

// 갤러리 항목이 유튜브 영상인지 판별
function isYouTube(item: MediaItem): item is YouTubeConfig {
  return typeof item === 'object' && item !== null && 'youtube' in item;
}

interface WorkPageProps {
  artwork: Artwork;
  onBack: () => void;
}

export function WorkPage({ artwork, onBack }: WorkPageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [imagePosition, setImagePosition] = useState({ 
    top: 0, 
    left: 0, 
    width: 0, 
    height: 0,
    translateX: 0,
    translateY: 0
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  // 모달(확대 보기)은 이미지에만 적용 — 유튜브 항목은 제외한 목록
  const imageItems = artwork.images.filter((item) => !isYouTube(item)) as (string | ImageConfig)[];

  const openModal = (index: number, event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    
    // Calculate translation needed to move to center
    const startCenterX = rect.left + rect.width / 2;
    const startCenterY = rect.top + rect.height / 2;
    const targetCenterX = window.innerWidth / 2;
    const targetCenterY = window.innerHeight / 2;
    
    setImagePosition({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      translateX: targetCenterX - startCenterX,
      translateY: targetCenterY - startCenterY
    });
    setModalImageIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
    
    // Start animation after modal is rendered
    setTimeout(() => {
      setIsAnimating(true);
    }, 10);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsAnimating(false);
    document.body.style.overflow = 'unset';
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setModalImageIndex((prev) => (prev > 0 ? prev - 1 : imageItems.length - 1));
    } else {
      setModalImageIndex((prev) => (prev < imageItems.length - 1 ? prev + 1 : 0));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowLeft') {
        navigateImage('prev');
      } else if (e.key === 'ArrowRight') {
        navigateImage('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, imageItems.length]);

  // 이미지 정보 추출 헬퍼 함수
  const getImageInfo = (image: string | ImageConfig) => {
    if (typeof image === 'string') {
      return { url: image, layout: 'full' as const, height: 'auto' as const };
    }
    return { 
      url: image.url, 
      layout: image.layout || 'full', 
      height: image.height || 'auto' 
    };
  };

  // 레이아웃별 클래스 결정
  const getLayoutClass = (layout: string) => {
    switch (layout) {
      case 'half': return 'md:col-span-1';
      case 'third': return 'md:col-span-1';
      case 'quarter': return 'md:col-span-1';
      case 'full': 
      default: return 'md:col-span-2';
    }
  };

  const getHeightClass = (height: string) => {
    switch (height) {
      case 'tall': return 'aspect-[3/4]';
      case 'short': return 'aspect-[4/3]';
      case 'square': return 'aspect-square';
      case 'auto':
      default: return '';
    }
  };

  // 이미지/영상을 레이아웃 그룹으로 정리
  const renderImages = () => {
    const elements: JSX.Element[] = [];
    let currentRow: JSX.Element[] = [];
    let currentRowLayout: string[] = [];
    let modalIndex = 0; // imageItems 기준 인덱스 (모달용)

    const flushRow = (isLast = false) => {
      if (currentRow.length === 0) return;
      const gridCols = getGridColumns(currentRowLayout);
      elements.push(
        <div key={`row-${elements.length}`} className={`grid ${gridCols} gap-4 ${isLast ? '' : 'mb-4'}`}>
          {currentRow}
        </div>
      );
      currentRow = [];
      currentRowLayout = [];
    };

    // full은 단독 행, 그 외는 현재 행에 채우다 꽉 차면 flush
    const place = (layout: string, cell: JSX.Element, key: React.Key) => {
      if (layout === 'full') {
        flushRow();
        elements.push(
          <div key={key} className="mb-4">
            {cell}
          </div>
        );
      } else {
        currentRow.push(cell);
        currentRowLayout.push(layout);
        const totalWidth = currentRowLayout.reduce((sum, l) => {
          return sum + (l === 'half' ? 0.5 : l === 'third' ? 0.33 : l === 'quarter' ? 0.25 : 1);
        }, 0);
        if (totalWidth >= 0.99) flushRow();
      }
    };

    artwork.images.forEach((item, index) => {
      // 유튜브 영상 항목
      if (isYouTube(item)) {
        const layout = item.layout || 'full';
        const videoId = extractYouTubeId(item.youtube) || item.youtube;
        place(layout, <YouTubeEmbed key={index} id={videoId} />, index);
        return;
      }

      // 이미지 항목
      const info = getImageInfo(item);
      const idx = modalIndex++;
      const cell = (
        <div
          key={index}
          className="cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={(e) => openModal(idx, e)}
          data-image-index={idx}
        >
          <div className={`${getHeightClass(info.height)} ${info.height === 'auto' ? '' : 'overflow-hidden'}`}>
            <ImageWithFallback
              src={info.url}
              alt={`${artwork.title} - Image ${idx + 1}`}
              className={`w-full ${info.height === 'auto' ? 'h-auto' : 'h-full'} object-cover rounded`}
            />
          </div>
        </div>
      );
      place(info.layout, cell, index);
    });

    flushRow(true);
    return elements;
  };

  // 본문 텍스트 렌더링: @[youtube](...) 단축문법은 영상으로, 나머지는 마크다운으로
  const renderRichText = (text: string, marginClass: string) => {
    return splitYouTubeSegments(text).map((seg, i) => {
      if (seg.type === 'youtube') {
        return <YouTubeEmbed key={i} {...seg.spec} className={`${marginClass} first:mt-0`} />;
      }
      if (!seg.value.trim()) return null;
      return (
        <ReactMarkdown
          key={i}
          components={{
            a: ({ children, href }) => (
              <a href={href} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70">
                {children}
              </a>
            ),
            p: ({ children }) => <p className={`${marginClass} first:mt-0`}>{children}</p>,
          }}
        >
          {seg.value}
        </ReactMarkdown>
      );
    });
  };

  // 레이아웃 배열에 따른 그리드 컬럼 결정
  const getGridColumns = (layouts: string[]) => {
    const halfCount = layouts.filter(l => l === 'half').length;
    const thirdCount = layouts.filter(l => l === 'third').length;
    const quarterCount = layouts.filter(l => l === 'quarter').length;

    if (halfCount === 2) return 'grid-cols-2';
    if (thirdCount === 3) return 'grid-cols-3';
    if (quarterCount === 4) return 'grid-cols-4';
    if (halfCount === 1 && thirdCount === 0 && quarterCount === 0) return 'grid-cols-2';
    if (thirdCount > 0) return 'grid-cols-3';
    if (quarterCount > 0) return 'grid-cols-4';
    
    return 'grid-cols-2';
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* 헤더 */}
      <div className="border-b border-gray-200 p-8">
        <h1 
          onClick={onBack}
          className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer w-fit"
        >
          Seokho Shin
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 grid-cols-1 gap-8 p-4 md:p-8 min-h-[calc(100vh-80px)]">
        {/* 왼쪽 - 작품 이미지들 */}
        <div className="lg:col-span-2 space-y-6">
          {renderImages()}
        </div>

        {/* 오른쪽 - 작품 정보 */}
        <div className="space-y-8">

          {/* 작품 정보 박스 */}
          <div className="bg-yellow-200 p-4 rounded">
            <div className="text-sm leading-relaxed">
              {renderRichText(artwork.description, 'mt-3')}
            </div>
          </div>

          {/* 상세 설명 */}
          {artwork.detailedDescription && (
            <div className="space-y-4 text-sm leading-relaxed">
              {renderRichText(artwork.detailedDescription, 'mt-4')}
            </div>
          )}

          {/* 뒤로 가기 버튼 */}
          <button
            onClick={onBack}
            className="text-sm opacity-60 hover:opacity-100 transition-opacity border-b border-transparent hover:border-black pb-1"
          >
            ← Back to Index
          </button>
        </div>
      </div>

      {/* 이미지 확대 모달 */}
      {isModalOpen && (
        <>
          {/* 배경 오버레이 */}
          <div 
            className="fixed inset-0 z-40 bg-white transition-opacity duration-200"
            style={{
              opacity: isAnimating ? 1 : 0
            }}
            onClick={closeModal}
          />
          
          {/* 이미지 컨테이너 */}
          <div 
            ref={imageRef}
            className="fixed z-50 flex items-center justify-center"
            style={{
              top: `${imagePosition.top}px`,
              left: `${imagePosition.left}px`,
              width: `${imagePosition.width}px`,
              height: `${imagePosition.height}px`,
              transform: isAnimating 
                ? `translate(${imagePosition.translateX}px, ${imagePosition.translateY}px) scale(${Math.min(window.innerWidth * 0.9 / imagePosition.width, window.innerHeight * 0.85 / imagePosition.height)})`
                : 'translate(0, 0) scale(1)',
              transformOrigin: 'center',
              transition: 'transform 0.1s linear',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ImageWithFallback
              src={getImageInfo(imageItems[modalImageIndex]).url}
              alt={`${artwork.title} - Image ${modalImageIndex + 1}`}
              className="w-full h-full object-contain rounded"
            />
          </div>
            
            {/* 컨트롤 버튼들 */}
            <div className="fixed inset-0 pointer-events-none z-50">
              {/* 이전 버튼 */}
              {imageItems.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('prev');
                  }}
                  className="pointer-events-auto absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 bg-black bg-opacity-10 hover:bg-opacity-20 text-black p-3 rounded-full transition-all"
                  style={{
                    opacity: isAnimating ? 1 : 0,
                    transition: 'opacity 0.15s ease-in-out',
                    transitionDelay: isAnimating ? '0.1s' : '0s'
                  }}
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* 다음 버튼 */}
              {imageItems.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('next');
                  }}
                  className="pointer-events-auto absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 bg-black bg-opacity-10 hover:bg-opacity-20 text-black p-3 rounded-full transition-all"
                  style={{
                    opacity: isAnimating ? 1 : 0,
                    transition: 'opacity 0.15s ease-in-out',
                    transitionDelay: isAnimating ? '0.1s' : '0s'
                  }}
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              {/* 닫기 버튼 */}
              <button
                onClick={closeModal}
                className="pointer-events-auto absolute top-4 right-4 md:top-8 md:right-8 z-50 bg-black bg-opacity-10 hover:bg-opacity-20 text-black p-3 rounded-full transition-all"
                style={{
                  opacity: isAnimating ? 1 : 0,
                  transition: 'opacity 0.15s ease-in-out',
                  transitionDelay: isAnimating ? '0.1s' : '0s'
                }}
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* 이미지 카운터 */}
              {imageItems.length > 1 && (
                <div 
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-20 text-black px-4 py-2 rounded-full text-sm"
                  style={{
                    opacity: isAnimating ? 1 : 0,
                    transition: 'opacity 0.15s ease-in-out',
                    transitionDelay: isAnimating ? '0.1s' : '0s'
                  }}
                >
                  {modalImageIndex + 1} / {imageItems.length}
                </div>
              )}
            </div>
        </>
      )}
    </div>
  );
}