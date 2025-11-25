import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Song } from '../../model/song';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input() isPlaying$!: Observable<boolean>;
  @Input() isMuted$!: Observable<boolean>;
  @Input() volume$!: Observable<number>;
  @Input() currentSong$!: Observable<Song | null>;
  @Input() songs: Song[] = [];
  @Output() muteToggle = new EventEmitter<void>();
  @Output() volumeChange = new EventEmitter<number>();
  @Output() songSelect = new EventEmitter<Song>();

  showVolumeSlider = false;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const volumeControl = target.closest('.volume-control');
    if (!volumeControl && this.showVolumeSlider) {
      this.showVolumeSlider = false;
    }
  }

  onToggleMute(): void {
    this.muteToggle.emit();
  }

  onVolumeChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.volumeChange.emit(Number(value) / 100);
  }

  toggleVolumeSlider(): void {
    this.showVolumeSlider = !this.showVolumeSlider;
  }

  onSongSelect(song: Song): void {
    this.songSelect.emit(song);
  }
}
