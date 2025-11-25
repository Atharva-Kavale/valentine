import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Reason } from '../../model/reason';
import { ReasonService } from '../../service/reason.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  reasons: Reason[] = [];
  private countdownInterval: any;

  constructor(
    private reasonsService: ReasonService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.reasons = this.reasonsService.getAllReasons();
  }

  ngOnInit(): void {
    this.countdownInterval = setInterval(() => {
      this.cdr.markForCheck();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  isUnlocked(reason: Reason): boolean {
    return this.reasonsService.isUnlocked(reason);
  }

  getCountdownText(reason: Reason): string {
    const remaining = this.reasonsService.getRemainingTime(reason);
    return this.reasonsService.formatCountdown(remaining);
  }

  hasActiveTimer(reason: Reason): boolean {
    if (this.isUnlocked(reason)) return false;
    const remaining = this.reasonsService.getRemainingTime(reason);
    return remaining !== Infinity && remaining > 0;
  }

  openReason(reason: Reason): void {
    if (this.isUnlocked(reason)) {
      this.router.navigate(['/reason', reason.id]);
    }
  }
}
