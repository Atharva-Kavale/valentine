import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { GalleryImage } from '../model/gallery-image';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

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

  constructor(private httpService: HttpService) {}

  /**
   * Get all images - returns placeholder for now
   * Use fetchImagesFromBackend() to get real images
   */
  getAllImages(): string[] {
    return this.placeholderImages;
  }

  /**
   * Fetch images from backend API
   * Returns Observable with image URLs
   */
  fetchImagesFromBackend(): Observable<string[]> {
    return this.httpService.getGalleryImages().pipe(
      map((images: GalleryImage[]) => images.map((img) => img.url)),
      catchError((error) => {
        console.error('Failed to fetch gallery images:', error);
        // Return placeholder images as fallback
        return of(this.placeholderImages);
      })
    );
  }

  /**
   * Fetch images with full metadata
   */
  fetchImagesWithMetadata(): Observable<GalleryImage[]> {
    return this.httpService.getGalleryImages().pipe(
      catchError((error) => {
        console.error('Failed to fetch gallery images:', error);
        // Return empty array or placeholder data as fallback
        return of([]);
      })
    );
  }
}
