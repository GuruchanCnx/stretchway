// Asset preloader for Veo-3 Video demonstrations & sound effects
import { VEO3_EXERCISE_CLIPS } from '../data/veoClips';
import { CURATED_ROUTINES } from '../data/exercises';

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(
        (reg) => {
          console.log('[StretchWay] Service Worker active with scope:', reg.scope);
          preloadVeo3Clips(reg);
        },
        (err) => {
          console.warn('[StretchWay] Service Worker registration failed:', err);
        }
      );
    });
  }
}

export function preloadVeo3Clips(registration?: ServiceWorkerRegistration) {
  // Collect all Veo-3 poster image URLs
  const imageUrls: string[] = [];
  Object.values(VEO3_EXERCISE_CLIPS).forEach((clip) => {
    if (clip.posterImage) {
      imageUrls.push(clip.posterImage);
    }
  });

  // Pre-fetch images in memory via standard Image constructor
  imageUrls.forEach((src) => {
    const img = new Image();
    img.src = src;
  });

  // Message Service Worker to cache assets
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'PRELOAD_ASSETS',
      urls: imageUrls
    });
  }

  // Pre-cache protocols in localStorage for offline availability
  try {
    const offlineProtocolsKey = 'stretchway_offline_protocols';
    if (!localStorage.getItem(offlineProtocolsKey)) {
      localStorage.setItem(offlineProtocolsKey, JSON.stringify(CURATED_ROUTINES));
    }
  } catch (e) {
    console.warn('Could not cache offline protocols:', e);
  }
}
