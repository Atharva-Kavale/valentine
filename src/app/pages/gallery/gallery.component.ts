import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  Renderer2,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { GalleryService } from '../../service/gallery.service';
import { Heart } from '../../model/heart';

@Component({
  selector: 'app-gallery',
  imports: [CommonModule, RouterModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryComponent implements OnInit {
  photos: string[];
  hearts: Heart[] = [];
  private originalOverflow: string = '';
  private heartsCache: Heart[] = [];

  constructor(
    private imageService: GalleryService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
  ) {
    this.photos = this.imageService.getAllImages();
    this.preCreateHearts();
  }

  async ngOnInit(): Promise<void> {
    // Preload images into cache
    await this.imageService.preloadImages();
    // Get cached images
    this.photos = this.imageService.getCachedImages();
    // Trigger change detection to update view
    this.cdr.markForCheck();
  }

  selectedPhoto: string | null = null;
  currentPhotoIndex: number = -1;

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.selectedPhoto) {
      this.closeModal();
    }
  }

  @HostListener('document:keydown.arrowleft')
  onLeftArrow(): void {
    if (this.selectedPhoto) {
      this.previousPhoto();
    }
  }

  @HostListener('document:keydown.arrowright')
  onRightArrow(): void {
    if (this.selectedPhoto) {
      this.nextPhoto();
    }
  }

  private preCreateHearts(): void {
    const numberOfHearts = 100;

    for (let i = 0; i < numberOfHearts; i++) {
      this.heartsCache.push({
        id: i,
        left: `${Math.random() * 100}%`,
        animationDuration: `${5 + Math.random() * 3}s`,
        size: `${24 + Math.random() * 24}px`,
        delay: `${Math.random() * 2}s`,
      });
    }
  }

  openModal(photo: string): void {
    this.currentPhotoIndex = this.photos.indexOf(photo);
    this.selectedPhoto = photo;
    this.originalOverflow = document.body.style.overflow;
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    this.hearts = this.heartsCache;
  }

  closeModal(): void {
    this.selectedPhoto = null;
    this.currentPhotoIndex = -1;
    this.renderer.setStyle(
      document.body,
      'overflow',
      this.originalOverflow || 'auto',
    );
    this.hearts = [];
  }

  nextPhoto(): void {
    if (this.currentPhotoIndex < this.photos.length - 1) {
      this.currentPhotoIndex++;
      this.selectedPhoto = this.photos[this.currentPhotoIndex];
    }
  }

  previousPhoto(): void {
    if (this.currentPhotoIndex > 0) {
      this.currentPhotoIndex--;
      this.selectedPhoto = this.photos[this.currentPhotoIndex];
    }
  }

  get canGoNext(): boolean {
    return this.currentPhotoIndex < this.photos.length - 1;
  }

  get canGoPrevious(): boolean {
    return this.currentPhotoIndex > 0;
  }

  trackByPhotoUrl(_index: number, photo: string): string {
    return photo;
  }

  trackByHeartId(_index: number, heart: Heart): number {
    return heart.id;
  }
}
