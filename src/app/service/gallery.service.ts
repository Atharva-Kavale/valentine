import { Injectable } from '@angular/core';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  constructor(private sessionStorage: SessionStorageService) {}
  private images: string[] = [
    'placeholder.svg',
    'placeholder.svg',
    'placeholder.svg',
    'placeholder.svg',
    'placeholder.svg',
    'placeholder.svg',
    'placeholder.svg',
    'placeholder.svg',
    'placeholder.svg',
    'placeholder.svg',
    'placeholder.svg',
    'placeholder.svg',
    'placeholder.svg',
    'placeholder.svg',
    'placeholder.svg',
  ];

  private readonly CACHE_KEY = 'gallery_images_cache';
  private readonly CACHE_TIMESTAMP_KEY = 'gallery_images_cache_timestamp';
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  getAllImages(): string[] {
    return this.images;
  }

  /**
   * Preload and cache images in sessionStorage as base64
   */
  async preloadImages(): Promise<void> {
    // Check if cache is valid
    if (this.isCacheValid()) {
      return;
    }

    const cachedImages: { [key: string]: string } = {};

    for (const imageUrl of this.images) {
      if (imageUrl === 'placeholder.svg') {
        continue; // Skip placeholders
      }

      try {
        const base64Image = await this.fetchImageAsBase64(imageUrl);
        cachedImages[imageUrl] = base64Image;
      } catch (error) {
        console.error(`Failed to cache image: ${imageUrl}`, error);
      }
    }

    // Store in sessionStorage
    this.sessionStorage.setObject(this.CACHE_KEY, cachedImages);
    this.sessionStorage.setItem(this.CACHE_TIMESTAMP_KEY, Date.now().toString());
  }

  /**
   * Get cached image or return original URL
   */
  getCachedImage(imageUrl: string): string {
    if (imageUrl === 'placeholder.svg') {
      return imageUrl;
    }

    const cachedImages =
      this.sessionStorage.getObject<{ [key: string]: string }>(this.CACHE_KEY);
    if (cachedImages && cachedImages[imageUrl]) {
      return cachedImages[imageUrl];
    }

    return imageUrl;
  }

  /**
   * Get all cached images or return original URLs
   */
  getCachedImages(): string[] {
    return this.images.map((url) => this.getCachedImage(url));
  }

  /**
   * Check if cache is still valid
   */
  private isCacheValid(): boolean {
    const cachedData = this.sessionStorage.getItem(this.CACHE_KEY);
    const timestamp = this.sessionStorage.getItem(this.CACHE_TIMESTAMP_KEY);

    if (!cachedData || !timestamp) {
      return false;
    }

    const cacheAge = Date.now() - parseInt(timestamp, 10);
    return cacheAge < this.CACHE_DURATION;
  }

  /**
   * Fetch image and convert to base64
   */
  private async fetchImageAsBase64(imageUrl: string): Promise<string> {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Clear the image cache
   */
  clearCache(): void {
    this.sessionStorage.removeItem(this.CACHE_KEY);
    this.sessionStorage.removeItem(this.CACHE_TIMESTAMP_KEY);
  }
}
