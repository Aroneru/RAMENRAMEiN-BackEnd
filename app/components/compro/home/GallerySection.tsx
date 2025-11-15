"use client";

import React from 'react';
import Image from 'next/image';
import styles from './styles/GallerySection.module.css';
import { useScrollReveal } from '../../../hooks/useScrollReveal';

const imageNames = ['1.png', '2.png', '3.png', '4.png', '5.png'];

export default function GallerySection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1, once: false });

  return (
    <section ref={ref} className={`${styles.gallerySection} transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className={styles.scroller}>
        <div className={styles.scrollerTrack}>
          {imageNames.map((name) => (
            <div className={styles.imageContainer} key={`gallery-1-${name}`}>
              <Image
                src={`/images/gallery/${name}`}
                alt="Suasana Ramein Ramen"
                layout="fill"
                objectFit="cover"
              />
            </div>
          ))}
          {imageNames.map((name) => (
            <div className={styles.imageContainer} key={`gallery-2-${name}`}>
              <Image
                src={`/images/gallery/${name}`}
                alt="Suasana Ramein Ramen"
                layout="fill"
                objectFit="cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}