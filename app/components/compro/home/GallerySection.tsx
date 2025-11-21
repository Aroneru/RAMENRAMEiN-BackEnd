"use client";

import React, { useState, useEffect } from 'react';
import styles from './styles/GallerySection.module.css';
import { useScrollReveal } from '../../../hooks/useScrollReveal';

const INSTAGRAM_TOKEN = 'IGAARerRzLhXNBZAFFkbC1fUHNsbEFjVXhPU1FTQXVsMmYxWW92LUVubFNqM0NDb25VMXdpM0JDbkZAYU1VsTTg5T2NDU1psMjQ5bWhiWm41ZAGxmb0FhQjlCRU05Ty1pMC1GQ2w1R0JTMGZAQV0pfSFNHdl82bnhsNjZAoN3lFN2F3SQZDZD';
const DEFAULT_IMAGES = ['1.png', '2.png', '3.png', '4.png', '5.png'];

interface InstagramPost {
  id: string;
  media_url: string;
  media_type: string;
  permalink: string;
  caption?: string;
}

export default function GallerySection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1, once: false });
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [useDefault, setUseDefault] = useState(false);

  useEffect(() => {
    fetchInstagramPosts();
  }, []);

  const fetchInstagramPosts = async () => {
    try {
      const response = await fetch(
        `https://graph.instagram.com/me/media?fields=id,media_url,media_type,permalink,caption&access_token=${INSTAGRAM_TOKEN}&limit=10`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch Instagram posts');
      }

      const data = await response.json();
      
      // Filter only IMAGE and CAROUSEL_ALBUM types
      const imagePosts = data.data?.filter((post: InstagramPost) => 
        post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL_ALBUM'
      ) || [];

      if (imagePosts.length > 0) {
        setPosts(imagePosts.slice(0, 5)); // Take first 5 posts
        setUseDefault(false);
      } else {
        setUseDefault(true);
      }
    } catch (error) {
      console.error('Error fetching Instagram posts:', error);
      setUseDefault(true);
    } finally {
      setLoading(false);
    }
  };

  const displayImages = useDefault 
    ? DEFAULT_IMAGES.map(name => ({ type: 'default' as const, url: `/images/gallery/${name}`, alt: 'Suasana Ramein Ramen' }))
    : posts.map(post => ({ type: 'instagram' as const, url: post.media_url, alt: post.caption || 'Instagram Post', permalink: post.permalink }));

  if (loading) {
    return (
      <section ref={ref} className={styles.gallerySection}>
        <div className="flex items-center justify-center py-20">
          <p className="text-white text-xl">Loading gallery...</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className={`${styles.gallerySection} transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className={styles.scroller}>
        <div className={styles.scrollerTrack}>
          {displayImages.map((image, idx) => (
            <div className={styles.imageContainer} key={`gallery-1-${idx}`}>
              {image.type === 'instagram' && image.permalink ? (
                <a href={image.permalink} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </a>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
          {/* Duplicate for infinite scroll effect */}
          {displayImages.map((image, idx) => (
            <div className={styles.imageContainer} key={`gallery-2-${idx}`}>
              {image.type === 'instagram' && image.permalink ? (
                <a href={image.permalink} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </a>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}