import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GalleryImage } from '../model/gallery-image';
import { ReasonWithImage } from '../model/reason-with-image';
import { Highscore } from '../model/highscore';

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
   * Fetch a single reason by ID
   */
  getReasonById(id: number): Observable<ReasonWithImage> {
    return this.http.get<ReasonWithImage>(`${this.apiUrl}/reasons/${id}`);
  }

  /**
   * Fetch the total count of reasons
   */
  getReasonsCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/reasons/count`);
  }

  /**
   * Fetch all highscores
   */
  getHighscores(): Observable<Highscore[]> {
    return this.http.get<Highscore[]>(`${this.apiUrl}/highscores`);
  }

  /**
   * Submit a new highscore
   */
  addHighscore(
    playerName: string,
    moves: number,
  ): Observable<{ message: string; score: Highscore }> {
    return this.http.post<{ message: string; score: Highscore }>(
      `${this.apiUrl}/highscores`,
      {
        playerName,
        moves,
      },
    );
  }
}
