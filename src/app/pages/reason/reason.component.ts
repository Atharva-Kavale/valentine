import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Reason } from '../../model/reason';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReasonService } from '../../service/reason.service';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-reason',
  imports: [CommonModule, RouterModule],
  templateUrl: './reason.component.html',
  styleUrl: './reason.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReasonComponent implements OnInit, OnDestroy {
  reason: Reason | undefined;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private reasonsService: ReasonService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // Fetch the specific reason from backend
    this.reasonsService
      .fetchReasonById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (reason) => {
          this.reason = reason;
          if (this.reason) {
            this.reasonsService.markBoxAsOpened(id);
          }
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error(`Error loading reason ${id}:`, error);
          this.cdr.markForCheck();
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
