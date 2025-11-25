import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { GalleryImage } from '../model/gallery-image';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  // Placeholder images - fallback if backend is unavailable
  private readonly placeholderImages: string[] = [
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

  // Cache for gallery items
  private galleryItemsCache$ = new BehaviorSubject<GalleryImage[]>([]);
  private isLoaded = false;

  constructor(private httpService: HttpService) {}

  /**
   * Initialize and fetch gallery data from backend
   * Call this on app initialization
   */
  initializeGallery(): void {
    if (!this.isLoaded) {
      this.httpService
        .getGalleryImages()
        .pipe(
          tap((items) => {
            this.galleryItemsCache$.next(items);
            this.isLoaded = true;
          }),
          catchError((error) => {
            console.error('Failed to fetch gallery images:', error);
            this.isLoaded = false;
            return of([]);
          }),
        )
        .subscribe();
    }
  }

  /**
   * Get cached gallery items as Observable
   */
  getGalleryItems(): Observable<GalleryImage[]> {
    return this.galleryItemsCache$.asObservable();
  }

  /**
   * Get cached gallery items (synchronous)
   */
  getGalleryItemsSync(): GalleryImage[] {
    return this.galleryItemsCache$.value;
  }

  /**
   * Get all images - returns placeholder or cached URLs
   */
  getAllImages(): string[] {
    const cachedItems = this.galleryItemsCache$.value;
    if (cachedItems.length > 0) {
      // Return URLs from images only (not videos)
      return cachedItems
        .filter((item) => item.type === 'image')
        .map((item) => item.url);
    }
    return this.placeholderImages;
  }

  /**
   * Get all media items (images and videos)
   */
  getAllMediaItems(): GalleryImage[] {
    return this.galleryItemsCache$.value;
  }

  /**
   * Check if gallery data is loaded
   */
  isGalleryLoaded(): boolean {
    return this.isLoaded;
  }
}
