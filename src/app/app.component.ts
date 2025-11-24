import {
  Component,
  OnInit,
  OnDestroy,
  Renderer2,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AudioService } from './service/audio.service';
import { CursorService } from './service/cursor.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { Song } from './model/song';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'love-website';

  isPlaying$: Observable<boolean>;
  isMuted$: Observable<boolean>;
  volume$: Observable<number>;
  currentSong$: Observable<Song | null>;
  songs: Song[];

  private destroy$ = new Subject<void>();

  constructor(
    private audioService: AudioService,
    private cursorService: CursorService,
    private renderer: Renderer2,
  ) {
    this.isPlaying$ = this.audioService.isPlaying$;
    this.isMuted$ = this.audioService.isMuted$;
    this.volume$ = this.audioService.volume$;
    this.currentSong$ = this.audioService.currentSong$;
    this.songs = this.audioService.getSongs();
  }

  ngOnInit() {
    this.cursorService.initializeTrail();
    this.playMusic();

    // Disable scroll when music is not playing
    this.isPlaying$.pipe(takeUntil(this.destroy$)).subscribe((isPlaying) => {
      if (!isPlaying) {
        this.renderer.setStyle(document.body, 'overflow', 'hidden');
      } else {
        this.renderer.setStyle(document.body, 'overflow', 'auto');
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  playMusic() {
    this.audioService.play();
  }

  toggleMute() {
    this.audioService.toggleMute();
  }

  onVolumeChange(volume: number) {
    this.audioService.setVolume(volume);
  }

  onSongSelect(song: Song) {
    this.audioService.selectSong(song);
  }
}
