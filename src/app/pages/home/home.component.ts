import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Reason } from '../../model/reason';
import { ReasonService } from '../../service/reason.service';
import { LocalStorageService } from '../../service/local-storage.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

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
  private destroy$ = new Subject<void>();

  constructor(
    private reasonsService: ReasonService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Fetch the count from backend and generate reason boxes dynamically
    this.reasonsService
      .fetchReasonsCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (count) => {
          // Initialize localStorage with the dynamic count from backend
          this.localStorageService.initializeStorageWithCount(count);

          // Generate reason boxes based on the count from API
          this.reasons = Array.from({ length: count }, (_, index) => ({
            id: index + 1,
            text: '', // Text will be fetched when box is opened
            image: '', // Image will be fetched when box is opened
          }));
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading reasons count:', error);
          this.cdr.markForCheck();
        },
      });

    this.countdownInterval = setInterval(() => {
      this.cdr.markForCheck();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

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
