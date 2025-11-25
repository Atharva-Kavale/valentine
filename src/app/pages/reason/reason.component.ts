import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Reason } from '../../model/reason';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReasonService } from '../../service/reason.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reason',
  imports: [CommonModule, RouterModule],
  templateUrl: './reason.component.html',
  styleUrl: './reason.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReasonComponent implements OnInit {
  reason: Reason | undefined;

  constructor(
    private route: ActivatedRoute,
    private reasonsService: ReasonService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // Fetch the specific reason from backend
    this.reasonsService.fetchReasonById(id).subscribe({
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
}
