import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { reasonGuard } from './reason.guard';

describe('reasonGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => reasonGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
