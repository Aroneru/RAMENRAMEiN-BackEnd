"use client";
import { useState, useRef } from "react";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section className={styles.hero}>
      {/* Video */}
      <video
        ref={videoRef}
        className={styles.heroVideo}
        src="/videos/tensai_ramen.mp4"
        loop
        playsInline
        controls={isPlaying}
      />

      {/* Tombol Play */}
      {!isPlaying && (
        <button className={styles.playButton} onClick={handlePlay}>
          ▶
        </button>
      )}
    </section>
  );
}
