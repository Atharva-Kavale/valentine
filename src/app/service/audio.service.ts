import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Song } from '../model/song';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audio = new Audio();
  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  private isMutedSubject = new BehaviorSubject<boolean>(false);
  private volumeSubject = new BehaviorSubject<number>(0.5);
  private currentSongSubject = new BehaviorSubject<Song | null>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(true);

  isPlaying$ = this.isPlayingSubject.asObservable();
  isMuted$ = this.isMutedSubject.asObservable();
  volume$ = this.volumeSubject.asObservable();
  currentSong$ = this.currentSongSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();

  // Available songs list
  private songs: Song[] = [
    {
      id: 1,
      title: 'Until I Found You (Instrumental)',
      artist: 'Stephen Sanchez',
      audioUrl: 'until_i_found_you.mp3',
      thumbnailUrl: 'until_i_found_you.jpg',
    },
    {
      id: 2,
      title: 'Her',
      artist: 'JVKE',
      audioUrl: 'her.mp3', // Replace with actual song path
      thumbnailUrl: 'her.jpg',
    },
  ];

  constructor(private localStorageService: LocalStorageService) {
    this.audio.loop = true;

    // Load saved volume from localStorage or default to 50%
    const savedVolume = this.localStorageService.loadVolume();
    this.audio.volume = savedVolume;
    this.volumeSubject.next(savedVolume);

    // Initialize muted state based on volume
    const isMuted = savedVolume === 0;
    this.audio.muted = isMuted;
    this.isMutedSubject.next(isMuted);

    // Load saved song from localStorage or default to first song
    const savedSong = this.loadSavedSong();
    this.currentSongSubject.next(savedSong);
    this.audio.src = savedSong.audioUrl;

    // Preload assets
    this.preloadAssets();
  }

  private async preloadAssets(): Promise<void> {
    try {
      // Preload all song thumbnails
      const imagePromises = this.songs.map((song) => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () =>
            reject(new Error(`Failed to load ${song.thumbnailUrl}`));
          img.src = song.thumbnailUrl;
        });
      });

      // Preload the current audio file
      const audioPromise = new Promise<void>((resolve, reject) => {
        const handleCanPlay = () => {
          this.audio.removeEventListener('canplaythrough', handleCanPlay);
          this.audio.removeEventListener('error', handleError);
          resolve();
        };
        const handleError = () => {
          this.audio.removeEventListener('canplaythrough', handleCanPlay);
          this.audio.removeEventListener('error', handleError);
          reject(new Error('Failed to load audio'));
        };
        this.audio.addEventListener('canplaythrough', handleCanPlay);
        this.audio.addEventListener('error', handleError);
        this.audio.load();
      });

      // Wait for all assets to load
      await Promise.all([...imagePromises, audioPromise]);
      this.isLoadingSubject.next(false);
    } catch (error) {
      console.error('Error preloading assets:', error);
      // Still mark as loaded to prevent infinite loading
      this.isLoadingSubject.next(false);
    }
  }

  private loadSavedSong(): Song {
    const savedId = this.localStorageService.loadSongSelection();
    if (savedId !== null) {
      const song = this.songs.find((s) => s.id === savedId);
      if (song) {
        return song;
      }
    }
    return this.songs[0];
  }

  getSongs(): Song[] {
    return this.songs;
  }

  selectSong(song: Song): void {
    const wasPlaying = !this.audio.paused;
    this.audio.src = song.audioUrl;
    this.currentSongSubject.next(song);
    this.localStorageService.saveSongSelection(song.id);

    if (wasPlaying) {
      this.play();
    }
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

  pause() {
    this.audio.pause();
    this.isPlayingSubject.next(false);
  }

  toggleMute() {
    this.audio.muted = !this.audio.muted;
    this.isMutedSubject.next(this.audio.muted);
  }

  setVolume(volume: number) {
    // Clamp volume between 0 and 1
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.audio.volume = clampedVolume;
    this.volumeSubject.next(clampedVolume);
    this.localStorageService.saveVolume(clampedVolume);

    // Auto-mute when volume is 0
    if (clampedVolume === 0 && !this.audio.muted) {
      this.audio.muted = true;
      this.isMutedSubject.next(true);
    } else if (clampedVolume > 0 && this.audio.muted) {
      this.audio.muted = false;
      this.isMutedSubject.next(false);
    }
  }

  getVolume(): number {
    return this.audio.volume;
  }
}
