import { Injectable } from '@angular/core';
import { Reason } from '../model/reason';
import { ReasonWithImage } from '../model/reason-with-image';
import { LocalStorageService } from './local-storage.service';
import { HttpService } from './http.service';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReasonService {
  private reasonsCountCache$ = new BehaviorSubject<number | null>(null);
  private isCountLoaded = false;

  constructor(
    private localStorageService: LocalStorageService,
    private httpService: HttpService,
  ) {}

  /**
   * Fetch a single reason from backend by ID
   */
  fetchReasonById(id: number): Observable<Reason | undefined> {
    return this.httpService.getReasonById(id).pipe(
      map((backendReason: ReasonWithImage) => ({
        id: backendReason.id,
        text: backendReason.text,
        image: backendReason.imageUrl,
      })),
      catchError((error) => {
        console.error(`Failed to fetch reason ${id} from backend:`, error);
        // Return undefined on error - backend should always be available
        return of(undefined);
      }),
    );
  }

  /**
   * Fetch the total count of reasons from backend
   * Caches the result to prevent unnecessary API calls
   */
  fetchReasonsCount(): Observable<number> {
    // If already loaded, return cached value
    if (this.isCountLoaded && this.reasonsCountCache$.value !== null) {
      return of(this.reasonsCountCache$.value);
    }

    // Otherwise, fetch from backend
    return this.httpService.getReasonsCount().pipe(
      map((response) => response.count),
      tap((count) => {
        this.reasonsCountCache$.next(count);
        this.isCountLoaded = true;
      }),
      catchError((error) => {
        console.error('Failed to fetch reasons count from backend:', error);
        // Return default count of 9 on error
        const defaultCount = 9;
        this.reasonsCountCache$.next(defaultCount);
        this.isCountLoaded = true;
        return of(defaultCount);
      }),
    );
  }

  isUnlocked(reason: Reason): boolean {
    return this.localStorageService.isBoxUnlocked(reason.id);
  }

  getUnlockTime(reason: Reason): number | null {
    return this.localStorageService.getNextUnlockTime(reason.id);
  }

  getRemainingTime(reason: Reason): number {
    return this.localStorageService.getRemainingTime(reason.id);
  }

  markBoxAsOpened(reasonId: number): void {
    this.localStorageService.setBoxOpenedTime(reasonId);
  }

  formatCountdown(milliseconds: number): string {
    if (milliseconds === Infinity) {
      return 'Locked';
    }

    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }
}
