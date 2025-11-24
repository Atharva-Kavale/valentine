import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audio = new Audio('song.mp3');
  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  private isMutedSubject = new BehaviorSubject<boolean>(false);

  isPlaying$ = this.isPlayingSubject.asObservable();
  isMuted$ = this.isMutedSubject.asObservable();

  constructor() {
    this.audio.loop = true;
  }

  async play() {
    try {
      await this.audio.play();
      this.isPlayingSubject.next(true);
    } catch (error) {
      console.error('Audio playback failed:', error);
      this.isPlayingSubject.next(false);
    }
  }

  toggleMute() {
    this.audio.muted = !this.audio.muted;
    this.isMutedSubject.next(this.audio.muted);
  }
}
