import React from 'react';

const YT_ID = /^[\w-]{11}$/;

// URL(youtu.be, watch?v=, embed, shorts) 또는 순수 ID에서 영상 ID 추출
export function extractYouTubeId(input: string): string | null {
  const s = input.trim();
  const patterns = [
    /youtu\.be\/([\w-]{11})/,
    /[?&]v=([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
    /youtube\.com\/shorts\/([\w-]{11})/,
  ];
  for (const p of patterns) {
    const m = s.match(p);
    if (m) return m[1];
  }
  return YT_ID.test(s) ? s : null;
}

export interface YouTubeSpec {
  id: string;
  width?: number;
  height?: number;
}

// 단축문법 괄호 안 내용 파싱: "URL/ID" 또는 "URL/ID, 800" 또는 "URL/ID, 640x360"
export function parseYouTubeShortcode(inner: string): YouTubeSpec | null {
  const parts = inner.split(',').map((s) => s.trim());
  const id = extractYouTubeId(parts[0]);
  if (!id) return null;

  const spec: YouTubeSpec = { id };
  if (parts[1]) {
    const m = parts[1].match(/^(\d+)(?:[x×](\d+))?$/);
    if (m) {
      spec.width = Number(m[1]);
      if (m[2]) spec.height = Number(m[2]);
    }
  }
  return spec;
}

const SHORTCODE = /@\[youtube\]\(([^)]+)\)/g;

export type Segment =
  | { type: 'text'; value: string }
  | { type: 'youtube'; spec: YouTubeSpec };

// 본문 텍스트를 단축문법 기준으로 분할 (텍스트/영상 세그먼트 배열)
export function splitYouTubeSegments(text: string): Segment[] {
  const segments: Segment[] = [];
  const re = new RegExp(SHORTCODE.source, 'g');
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const spec = parseYouTubeShortcode(m[1]);
    if (!spec) continue;
    if (m.index > last) segments.push({ type: 'text', value: text.slice(last, m.index) });
    segments.push({ type: 'youtube', spec });
    last = m.index + m[0].length;
  }
  if (last < text.length) segments.push({ type: 'text', value: text.slice(last) });
  return segments;
}

// 문단 전체가 하나의 단축문법인 경우 spec 반환 (라인 기반 렌더러용)
export function matchWholeYouTube(text: string): YouTubeSpec | null {
  const m = text.trim().match(/^@\[youtube\]\(([^)]+)\)$/);
  return m ? parseYouTubeShortcode(m[1]) : null;
}

interface YouTubeEmbedProps {
  id: string;
  width?: number;
  height?: number;
  className?: string;
}

export function YouTubeEmbed({ id, width, height, className }: YouTubeEmbedProps) {
  // 너비 지정 시 height(없으면 16:9)로 비율 계산, 미지정 시 반응형 16:9
  const ratio = width ? ((height ?? Math.round((width * 9) / 16)) / width) * 100 : 56.25;

  return (
    <div className={className} style={width ? { width, maxWidth: '100%' } : undefined}>
      <div style={{ position: 'relative', paddingBottom: `${ratio}%`, height: 0 }}>
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          title="YouTube video player"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full rounded"
          style={{ border: 0 }}
        />
      </div>
    </div>
  );
}
