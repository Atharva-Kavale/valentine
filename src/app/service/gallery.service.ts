import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  // Placeholder images - will be replaced with backend API calls
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

  // TODO: Implement backend API integration
  // async fetchImagesFromBackend(): Promise<string[]> {
  //   // Fetch images from your backend API
  //   return this.images;
  // }
}
