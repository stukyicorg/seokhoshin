import { Artwork } from '../App';
import { parseArtworkMD } from './artworkParser';

const artworkModules = import.meta.glob('/data/artworks/*.md', {
  query: '?raw',
  import: 'default'
});

const animationModules = import.meta.glob('/data/animations/*.md', {
  query: '?raw',
  import: 'default'
});

const exhibitionModules = import.meta.glob('/data/exhibitions/*.md', {
  query: '?raw',
  import: 'default'
});

export async function loadAllArtworks(): Promise<Artwork[]> {
  const artworks: Artwork[] = [];
  
  for (const path in artworkModules) {
    try {
      const module = await artworkModules[path]() as string;
      const artwork = parseArtworkMD(module);
      artworks.push(artwork);
    } catch (error) {
      console.error(`Failed to load artwork from ${path}:`, error);
    }
  }
  
  artworks.sort((a, b) => b.year - a.year || a.id.localeCompare(b.id));

  return artworks;
}

export async function loadAllAnimations(): Promise<Artwork[]> {
  const animations: Artwork[] = [];

  for (const path in animationModules) {
    try {
      const module = await animationModules[path]() as string;
      const animation = parseArtworkMD(module);
      animations.push(animation);
    } catch (error) {
      console.error(`Failed to load animation from ${path}:`, error);
    }
  }

  animations.sort((a, b) => b.year - a.year || a.id.localeCompare(b.id));

  return animations;
}

export async function loadAllExhibitions(): Promise<Artwork[]> {
  const exhibitions: Artwork[] = [];

  for (const path in exhibitionModules) {
    try {
      const module = await exhibitionModules[path]() as string;
      const exhibition = parseArtworkMD(module);
      exhibitions.push(exhibition);
    } catch (error) {
      console.error(`Failed to load exhibition from ${path}:`, error);
    }
  }

  exhibitions.sort((a, b) => b.year - a.year || a.id.localeCompare(b.id));

  return exhibitions;
}