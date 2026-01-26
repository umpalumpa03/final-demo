import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { signUpGuard } from './sign-up-guard';

describe('signUpGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => signUpGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
