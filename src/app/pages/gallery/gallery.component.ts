import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  Renderer2,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { GalleryService } from '../../service/gallery.service';
import { AudioService } from '../../service/audio.service';
import { GalleryImage } from '../../model/gallery-image';
import { Heart } from '../../model/heart';

@Component({
  selector: 'app-gallery',
  imports: [CommonModule, RouterModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryComponent implements OnInit {
  galleryItems: GalleryImage[] = [];
  hearts: Heart[] = [];
  private originalOverflow: string = '';
  private heartsCache: Heart[] = [];

  selectedItem: GalleryImage | null = null;
  currentItemIndex: number = -1;

  // Track original volume before muting for video
  private originalVolume: number = 0;

  constructor(
    private imageService: GalleryService,
    private audioService: AudioService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
  ) {
    this.preCreateHearts();
  }

  ngOnInit(): void {
    // Subscribe to cached gallery items
    this.imageService.getGalleryItems().subscribe((items) => {
      this.galleryItems = items;

      // Trigger change detection
      this.cdr.markForCheck();
    });
  }

  isVideo(item: GalleryImage): boolean {
    return item.type === 'video';
  }

  getItemDisplayUrl(item: GalleryImage): string {
    return item.type === 'video' ? item.thumbnail || item.url : item.url;
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.selectedItem) {
      this.closeModal();
    }
  }

  @HostListener('document:keydown.arrowleft')
  onLeftArrow(): void {
    if (this.selectedItem) {
      this.previousItem();
    }
  }

  @HostListener('document:keydown.arrowright')
  onRightArrow(): void {
    if (this.selectedItem) {
      this.nextItem();
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

  openModalWithItem(item: GalleryImage): void {
    this.currentItemIndex = this.galleryItems.indexOf(item);
    this.selectedItem = item;
    this.originalOverflow = document.body.style.overflow;
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    this.hearts = this.heartsCache;

    // If opening a video, set music volume to 0
    if (this.isVideo(item)) {
      this.originalVolume = this.audioService.getVolume();
      this.audioService.setVolume(0);
    }

    this.cdr.markForCheck();
  }

  closeModal(): void {
    // Restore original volume if closing a video
    if (
      this.selectedItem &&
      this.isVideo(this.selectedItem) &&
      this.originalVolume > 0
    ) {
      this.audioService.setVolume(this.originalVolume);
      this.originalVolume = 0;
    }

    this.selectedItem = null;
    this.currentItemIndex = -1;
    this.renderer.setStyle(
      document.body,
      'overflow',
      this.originalOverflow || 'auto',
    );
    this.hearts = [];
    this.cdr.markForCheck();
  }

  nextItem(): void {
    if (this.currentItemIndex < this.galleryItems.length - 1) {
      const previousItem = this.selectedItem;
      this.currentItemIndex++;
      this.selectedItem = this.galleryItems[this.currentItemIndex];

      // Handle music when switching between video and image
      this.handleMediaTransition(previousItem, this.selectedItem);

      this.cdr.markForCheck();
    }
  }

  previousItem(): void {
    if (this.currentItemIndex > 0) {
      const previousItem = this.selectedItem;
      this.currentItemIndex--;
      this.selectedItem = this.galleryItems[this.currentItemIndex];

      // Handle music when switching between video and image
      this.handleMediaTransition(previousItem, this.selectedItem);

      this.cdr.markForCheck();
    }
  }

  private handleMediaTransition(
    fromItem: GalleryImage | null,
    toItem: GalleryImage | null,
  ): void {
    if (!fromItem || !toItem) return;

    const wasVideo = this.isVideo(fromItem);
    const isVideo = this.isVideo(toItem);

    // Transitioning from image to video - set volume to 0
    if (!wasVideo && isVideo) {
      this.originalVolume = this.audioService.getVolume();
      this.audioService.setVolume(0);
    }

    // Transitioning from video to image - restore volume
    if (wasVideo && !isVideo && this.originalVolume > 0) {
      this.audioService.setVolume(this.originalVolume);
      this.originalVolume = 0;
    }
  }

  get canGoNext(): boolean {
    return this.currentItemIndex < this.galleryItems.length - 1;
  }

  get canGoPrevious(): boolean {
    return this.currentItemIndex > 0;
  }

  get totalItems(): number {
    return this.galleryItems.length;
  }
}
