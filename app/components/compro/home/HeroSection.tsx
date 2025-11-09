"use client"; 

import { useState, useRef } from 'react';
import styles from './styles/HeroSection.module.css';

export default function HeroSection() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted; 
      setIsMuted(video.muted);
    }
  };

  return (
    <section className={styles.hero}>
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

    </section>
  );
}