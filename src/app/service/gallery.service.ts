import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
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

  getAllImages(): string[] {
    return this.images;
  }
}
