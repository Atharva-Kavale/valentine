import { Injectable, OnDestroy } from '@angular/core';
import { HttpService } from './http.service';
import { GalleryImage } from '../model/gallery-image';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { catchError, tap, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GalleryService implements OnDestroy {
  // Cache for gallery items
  private galleryItemsCache$ = new BehaviorSubject<GalleryImage[]>([]);
  private isLoaded = false;
  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  private destroy$ = new Subject<void>();

  isLoading$ = this.isLoadingSubject.asObservable();

  constructor(private httpService: HttpService) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize and fetch gallery data from backend
   * Call this on app initialization
   */
  async initializeGallery(): Promise<void> {
    if (!this.isLoaded) {
      this.isLoadingSubject.next(true);

      try {
        // Fetch gallery data
        const items = await new Promise<GalleryImage[]>((resolve, reject) => {
          this.httpService
            .getGalleryImages()
            .pipe(
              takeUntil(this.destroy$),
              tap((items) => {
                this.galleryItemsCache$.next(items);
              }),
              catchError((error) => {
                console.error('Failed to fetch gallery images:', error);
                reject(error);
                return of([]);
              }),
            )
            .subscribe((items) => resolve(items));
        });

        // Preload all images
        const imagePromises = items
          .filter((item) => item.type === 'image')
          .map((item) => {
            return new Promise<void>((resolve) => {
              const img = new Image();
              img.onload = () => resolve();
              img.onerror = () => {
                console.warn(`Failed to preload image: ${item.url}`);
                resolve(); // Resolve anyway to not block the loading
              };
              img.src = item.url;
            });
          });

        // Wait for all images to preload
        await Promise.all(imagePromises);
        this.isLoaded = true;
        this.isLoadingSubject.next(false);
      } catch (error) {
        console.error('Error initializing gallery:', error);
        this.isLoaded = false;
        this.isLoadingSubject.next(false);
      }
    } else {
      this.isLoadingSubject.next(false);
    }
  }

  /**
   * Get cached gallery items as Observable
   */
  getGalleryItems(): Observable<GalleryImage[]> {
    return this.galleryItemsCache$.asObservable();
  }
}
