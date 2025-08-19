import React, { useState, useEffect } from 'react';
import { MainPage } from './components/MainPage';
import { WorkPage } from './components/WorkPage';
import { TextPage } from './components/TextPage';
import { loadAllArtworks } from './utils/artworkLoader';

export interface ImageConfig {
  url: string;
  layout?: 'full' | 'half' | 'third' | 'quarter';
  height?: 'auto' | 'tall' | 'short' | 'square';
}

export interface Artwork {
  id: string;
  title: string;
  year: number;
  materials: string;
  dimensions: string;
  description: string;
  detailedDescription?: string;
  images: (string | ImageConfig)[];
  projectNumber: string;
}



export default function App() {
  const [currentView, setCurrentView] = useState<'main' | 'work' | 'text'>('main');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [artworksData, setArtworksData] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArtworks = async () => {
      try {
        const artworks = await loadAllArtworks();
        setArtworksData(artworks);
      } catch (error) {
        console.error('Failed to load artworks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArtworks();
  }, []);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.artworkId) {
        const artwork = artworksData.find(a => a.id === event.state.artworkId);
        if (artwork) {
          setSelectedArtwork(artwork);
          setCurrentView('work');
        }
      } else {
        setCurrentView('main');
        setSelectedArtwork(null);
      }
    };

    window.addEventListener('popstate', handlePopState);

    const path = window.location.pathname;
    if (path.startsWith('/work/')) {
      const artworkId = path.replace('/work/', '');
      const artwork = artworksData.find(a => a.id === artworkId);
      if (artwork) {
        setSelectedArtwork(artwork);
        setCurrentView('work');
      }
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [artworksData]);

  const navigateToWork = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setCurrentView('work');
    window.history.pushState({ artworkId: artwork.id }, '', `/work/${artwork.id}`);
  };

  const navigateToMain = () => {
    setCurrentView('main');
    setSelectedArtwork(null);
    window.history.pushState(null, '', '/');
  };

  const navigateToText = () => {
    setCurrentView('text');
    window.history.pushState({ view: 'text' }, '', '/text');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-gray-500">Loading artworks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {currentView === 'main' ? (
        <MainPage 
          artworks={artworksData} 
          onArtworkClick={navigateToWork}
          onTextClick={navigateToText}
        />
      ) : currentView === 'work' && selectedArtwork ? (
        <WorkPage artwork={selectedArtwork} onBack={navigateToMain} />
      ) : currentView === 'text' ? (
        <TextPage onBack={navigateToMain} />
      ) : null}
    </div>
  );
}