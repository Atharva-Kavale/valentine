import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

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
  @Output() muteToggle = new EventEmitter<void>();

  onToggleMute(): void {
    this.muteToggle.emit();
  }
}
