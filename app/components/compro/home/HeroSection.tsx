"use client"; 

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { fetchHomepageBySection } from '@/lib/homepage';
import styles from './styles/HeroSection.module.css';

export default function HeroSection() {
  const [isMuted, setIsMuted] = useState(true);
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    loadHeroSection();
  }, []);

  const loadHeroSection = async () => {
    try {
      const data = await fetchHomepageBySection('hero');
      
      // Jika ada image_url, gunakan image. Jika tidak, gunakan default video
      if (data?.image_url) {
        setHeroImageUrl(data.image_url);
      }
      
      setLoading(false);
    } catch (error: any) {
      // Jika error atau tidak ada data, gunakan default video
      console.log("No custom hero image, using default video");
      setHeroImageUrl(null);
      setLoading(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted; 
      setIsMuted(video.muted);
    }
  };

  if (loading) {
    return (
      <section className={styles.hero}>
        <div className="flex items-center justify-center h-full">
          <p className="text-white text-xl">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.hero}>
      {heroImageUrl ? (
        // Tampilkan image jika ada
        <div className={styles.heroImage}>
          <Image
            src={heroImageUrl}
            alt="Hero Section"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ) : (
        // Tampilkan default video jika tidak ada image
        <>
          <video
            ref={videoRef}
            className={styles.heroVideo}
            src="/videos/ramenramein_video.mp4"
            autoPlay  
            loop     
            muted    
            playsInline
          />

          <button onClick={toggleMute} className={styles.unmuteButton}>
            {isMuted ? "🔇" : "🔊"}
          </button>
        </>
      )}
    </section>
  );
}