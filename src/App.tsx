import React, { useState, useEffect } from 'react';
import { MainPage } from './components/MainPage';
import { WorkPage } from './components/WorkPage';
import { loadAllArtworks } from './utils/artworkLoader';

export interface Artwork {
  id: string;
  title: string;
  year: number;
  materials: string;
  dimensions: string;
  description: string;
  images: string[];
  projectNumber: string;
}



export default function App() {
  const [currentView, setCurrentView] = useState<'main' | 'work'>('main');
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

  const navigateToWork = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setCurrentView('work');
  };

  const navigateToMain = () => {
    setCurrentView('main');
    setSelectedArtwork(null);
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
        <MainPage artworks={artworksData} onArtworkClick={navigateToWork} />
      ) : (
        selectedArtwork && (
          <WorkPage artwork={selectedArtwork} onBack={navigateToMain} />
        )
      )}
    </div>
  );
}