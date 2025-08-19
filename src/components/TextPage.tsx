import React, { useState, useEffect } from 'react';
import { loadTextContent } from '../utils/textLoader';

interface TextPageProps {
  onBack: () => void;
}

export interface TextContent {
  title: string;
  subtitle: string;
  leftColumn: string;
  rightColumn: string;
  footer?: string;
}

export function TextPage({ onBack }: TextPageProps) {
  const [content, setContent] = useState<TextContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const textContent = await loadTextContent();
        setContent(textContent);
      } catch (error) {
        console.error('Failed to load text content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  if (loading || !content) {
    return (
      <div className="min-h-screen bg-yellow-300 flex items-center justify-center">
        <div className="text-black/60">Loading content...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 
          onClick={onBack}
          className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer w-fit"
        >
          Seokho Shin
        </h1>
      </div>

      {/* 메인 콘텐츠 컨테이너 - 노란색 배경 */}
      <div className="max-w-6xl mx-auto bg-yellow-300 p-12">
        {/* 제목 섹션 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">{content.title}</h1>
          <h2 className="text-xl">{content.subtitle}</h2>
        </div>

        {/* 2단 레이아웃 */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* 왼쪽 컬럼 */}
          <div className="space-y-4">
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {content.leftColumn}
            </p>          
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="space-y-4">
            <div className="text-sm leading-relaxed">
              {content.rightColumn.split('\n\n').map((paragraph, index) => (
                <p key={index} className={index === 0 ? "italic" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 푸터 텍스트 */}
        {content.footer && (
          <div className="border-t border-black/20 pt-8 mt-8">
            <p className="text-sm opacity-60">{content.footer}</p>
          </div>
        )}
      </div>
    </div>
  );
}