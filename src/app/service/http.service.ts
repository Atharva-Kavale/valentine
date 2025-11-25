import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface GalleryImage {
  id: number;
  url: string;
  alt?: string;
}

export interface ReasonWithImage {
  id: number;
  text: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly apiUrl = environment.apiUrl || 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  /**
   * Fetch all gallery images from backend
   */
  getGalleryImages(): Observable<GalleryImage[]> {
    return this.http.get<GalleryImage[]>(`${this.apiUrl}/gallery/images`);
  }

  /**
   * Fetch all reasons with images from backend
   */
  getReasons(): Observable<ReasonWithImage[]> {
    return this.http.get<ReasonWithImage[]>(`${this.apiUrl}/reasons`);
  }

  /**
   * Fetch a single reason by ID
   */
  getReasonById(id: number): Observable<ReasonWithImage> {
    return this.http.get<ReasonWithImage>(`${this.apiUrl}/reasons/${id}`);
  }
}
