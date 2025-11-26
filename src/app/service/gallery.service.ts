import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { GalleryImage } from '../model/gallery-image';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
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
}
