import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.reason = this.reasonsService.getReason(id);

    if (this.reason) {
      this.reasonsService.markBoxAsOpened(id);
    }
  }
}
