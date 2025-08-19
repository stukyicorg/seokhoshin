import yaml from 'js-yaml';

export interface MainContent {
  description: string;
  contact: string;
}

export async function loadMainContent(): Promise<MainContent> {
  try {
    const aboutModule = await import('../../data/main/about.md?raw');
    const content = aboutModule.default;
    
    // Parse YAML frontmatter and content
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    
    if (!match) {
      throw new Error('Invalid markdown format');
    }
    
    const [, , markdownContent] = match;
    
    // Split content into description and contact sections
    const sections = markdownContent.split(/^## /m);
    const description = sections[0].trim();
    const contactSection = sections.find((s: string) => s.startsWith('Contact'));
    const contact = contactSection ? contactSection.replace('Contact\n', '').trim() : '';
    
    return {
      description,
      contact
    };
  } catch (error) {
    console.error('Failed to load main content:', error);
    // Return default content as fallback
    return {
      description: 'A collection of sculptural works exploring the intersection of form, material, and concept. Each piece represents a dialogue between traditional craftsmanship and contemporary artistic expression.',
      contact: 'Artist Profile\nhello@example.com\nInstagram'
    };
  }
}