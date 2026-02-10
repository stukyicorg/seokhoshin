import React, { useState, useEffect } from 'react';
import { loadAllTextSections, TextSection } from '../utils/textLoader';

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

// 마크다운 링크 [text](url)를 파싱하여 React 엘리먼트로 변환
function renderLineWithLinks(line: string): React.ReactNode {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(line.slice(lastIndex, match.index));
    }
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:opacity-70 transition-opacity"
      >
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < line.length) {
    parts.push(line.slice(lastIndex));
  }

  return parts.length > 0 ? parts : line;
}

export function TextPage({ onBack }: TextPageProps) {
  const [sections, setSections] = useState<TextSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const textSections = await loadAllTextSections();
        setSections(textSections);
      } catch (error) {
        console.error('Failed to load text content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black/60">Loading content...</div>
      </div>
    );
  }

  if (!sections.length) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="mb-8">
          <h1 
            onClick={onBack}
            className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer w-fit"
          >
            Seokho Shin
          </h1>
        </div>
        <div className="text-center mt-20 text-black/60">
          No text content available
        </div>
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

      {/* 각 섹션을 노란색 배경으로 표시 */}
      <div className="space-y-12">
        {sections.map((section, index) => (
          <div key={section.id} className="max-w-6xl mx-auto">
            {/* 노란색 배경 컨테이너 */}
            <div className="bg-yellow-300 p-12">
              {/* 제목 섹션 */}
              <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-4">{section.title}</h1>
                {section.subtitle && (
                  <h2 className="text-xl">{section.subtitle}</h2>
                )}
              </div>

              {/* 단일 컬럼 가운데 배치, 왼쪽 정렬 */}
              <div className="max-w-3xl mx-auto mb-16 text-left">
                <div className="text-sm leading-relaxed">
                  {section.content.split('\n\n').map((paragraph, pIndex) => (
                    <p key={pIndex} className={pIndex > 0 ? "mt-4" : ""}>
                      {paragraph.split('\n').map((line, lineIndex) => (
                        <React.Fragment key={lineIndex}>
                          {/* 이탤릭 처리 */}
                          {line.startsWith('*') && line.endsWith('*') ? (
                            <em>{renderLineWithLinks(line.slice(1, -1))}</em>
                          ) : (
                            renderLineWithLinks(line)
                          )}
                          {lineIndex < paragraph.split('\n').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </p>
                  ))}
                </div>
              </div>

              {/* 하단 푸터 텍스트 */}
              {section.footer && (
                <div className="max-w-3xl mx-auto border-t border-black/20 pt-8 mt-8 text-left">
                  <p className="text-sm opacity-60">{renderLineWithLinks(section.footer)}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 뒤로 가기 버튼 */}
      <div className="max-w-6xl mx-auto mt-12 text-center">
        <button
          onClick={onBack}
          className="text-sm opacity-60 hover:opacity-100 transition-opacity border-b border-transparent hover:border-black pb-1"
        >
          ← Back to Index
        </button>
      </div>
    </div>
  );
}