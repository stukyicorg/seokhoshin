import { TextContent } from '../components/TextPage';

const textModules = import.meta.glob('/data/texts/*.md', { 
  query: '?raw',
  import: 'default'
});

export async function loadTextContent(): Promise<TextContent> {
  try {
    // content.md 파일 로드
    const contentPath = '/data/texts/content.md';
    if (textModules[contentPath]) {
      const content = await textModules[contentPath]() as string;
      return parseTextMD(content);
    }
  } catch (error) {
    console.error('Failed to load text content:', error);
  }
  
  // 기본 콘텐츠 반환
  return getDefaultContent();
}

function parseTextMD(content: string): TextContent {
  const lines = content.split('\n');
  let title = 'TEST STUDIO DOC';
  let subtitle = 'LOREM IPSUM DOLOR';
  let leftColumn = '';
  let rightColumn = '';
  let currentSection = '';
  let inFrontmatter = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Frontmatter 처리
    if (line === '---') {
      if (!inFrontmatter && i === 0) {
        inFrontmatter = true;
        continue;
      } else if (inFrontmatter) {
        inFrontmatter = false;
        continue;
      }
    }
    
    if (inFrontmatter) {
      if (line.startsWith('title:')) {
        title = line.replace('title:', '').trim().replace(/['"]/g, '');
      } else if (line.startsWith('subtitle:')) {
        subtitle = line.replace('subtitle:', '').trim().replace(/['"]/g, '');
      }
      continue;
    }
    
    // 섹션 헤더 확인
    if (line.startsWith('## leftColumn')) {
      currentSection = 'left';
      continue;
    } else if (line.startsWith('## rightColumn')) {
      currentSection = 'right';
      continue;
    }
    
    // 콘텐츠 추가
    if (currentSection === 'left') {
      leftColumn += (leftColumn ? '\n' : '') + line;
    } else if (currentSection === 'right') {
      rightColumn += (rightColumn ? '\n' : '') + line;
    }
  }
  
  return {
    title,
    subtitle,
    leftColumn: leftColumn.trim(),
    rightColumn: rightColumn.trim()
  };
}

function getDefaultContent(): TextContent {
  return {
    title: "TEST STUDIO DOC",
    subtitle: "LOREM IPSUM DOLOR",
    leftColumn: `Sed a suscipit tortor. Pellentesque volutpat metus a odio sollicitudin pulvinar.
In finibus metus at eros faucibus consequat. Ut posuere interdum leo id pharetra. Vivamus pellentesque, lectus.
Fusce id vehicula ipsum. Duis lacinia porttitor justo, ac interdum leo sollicitudin quis. Praesent bibendum a elit non efficitur.
Etiam et velit vitae quam aliquet fermentum.
Quisque sit amet nulla dictum, cursus erat a, tempus est.`,
    rightColumn: `Curabitur vitae odio pretium, volutpat augue efficitur, ullamcorper ante. Nunc ultrices eget urna in aliquet. Nulla at ullamcorper leo. Aliquam egestas non lacus sed tempor. Ut bibendum mauris sit amet augue mollis, et tincidunt nisl gravida. Proin dictum dapibus libero vitae luctus. Morbi gravida dolor sit amet erat sagittis, suscipit blandit nibh ullamcorper.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut nisl metus, accumsan id eros id, vehicula tincidunt nisl. Nulla sit amet urna ut mi tempor euismod. Fusce elementum sapien eget elit sodales fringilla. Pellentesque et nulla vel velit malesuada fermentum vitae vitae justo. Nulla dignissim volutpat interdum. Pellentesque at molestie tortor. Proin magna ante, fermentum ac elementum at, lacinia et arcu.

Ut volutpat pharetra orci, ac bibendum nunc vulputate in. Praesent porttitor venenatis lacus sed mollis. Nulla varius leo nec porta tempus. Nunc orci enim, bibendum in gravida eu, pretium eu purus. Sed vestibulum quam sed eros malesuada hendrerit. Praesent pellentesque ipsum non commodo congue. Nam et metus malesuada leo aliquet facilisis in in enim. In consequat orci eleifend, feugiat eros eu, lobortis purus. Curabitur facilisis gravida ipsum a tempus. Vestibulum pharetra, magna eu eleifend ultricies, sem tellus ullamcorper elit, sed porttitor nisl libero non dui. Aenean porttitor arcu sem. Sed id ipsum felis. Vivamus ut placerat ex, sit amet eleifend ligula.

Curabitur vitae odio pretium, volutpat augue efficitur, ullamcorper ante. Nunc ultrices eget urna in aliquet. Nulla at ullamcorper leo.`
  };
}