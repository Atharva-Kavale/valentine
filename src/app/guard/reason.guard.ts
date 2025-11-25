import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '../service/local-storage.service';
import { inject } from '@angular/core';

export const reasonGuard: CanActivateFn = (route, state) => {
  const localStorageService = inject(LocalStorageService);
  const router = inject(Router);

  const reasonId = Number(route.paramMap.get('id'));

  // Check if the reason box is unlocked
  const isUnlocked = localStorageService.isBoxUnlocked(reasonId);

  if (!isUnlocked) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
