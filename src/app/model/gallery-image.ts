export interface GalleryImage {
  id: number;
  url: string;
  alt?: string;
  type: 'image' | 'video'; // Type of media: image or video
  thumbnail?: string; // Thumbnail URL for videos
}
