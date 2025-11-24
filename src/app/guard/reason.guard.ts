import { CanActivateFn, Router } from '@angular/router';
import { ReasonService } from '../service/reason.service';
import { inject } from '@angular/core';

export const reasonGuard: CanActivateFn = (route, state) => {
  const reasonsService = inject(ReasonService);
  const router = inject(Router);

  const reasonId = Number(route.paramMap.get('id'));
  const reason = reasonsService.getReason(reasonId);

  if (!reason) {
    router.navigate(['/']);
    return false;
  }

  const isUnlocked = reasonsService.isUnlocked(reason);

  if (!isUnlocked) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
