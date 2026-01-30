import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { firstValueFrom, of, throwError } from 'rxjs';
import { SecurityEffects } from './security.effects';
import { SecurityService } from '../service/security.service';
import { SecurityActions } from './security.actions';
import { vi } from 'vitest';

describe('SecurityEffects', () => {
  let effects: SecurityEffects;
  let actions$: any;
  let service: { changePassword: any };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SecurityEffects,
        provideMockActions(() => actions$),
        { provide: SecurityService, useValue: { changePassword: vi.fn() } },
      ],
    });

    effects = TestBed.inject(SecurityEffects);
    service = TestBed.inject(SecurityService) as any;
  });

  it('dispatches success when changePassword succeeds', async () => {
    service.changePassword.mockReturnValue(of(void 0));
    actions$ = of(SecurityActions.changePassword({ currentPassword: 'a', newPassword: 'b' }));

    const action = await firstValueFrom(effects.changePassword$);
    expect(action).toEqual(SecurityActions.changePasswordSuccess());
  });

  it('dispatches failure when changePassword fails', async () => {
    service.changePassword.mockReturnValue(throwError(() => ({})));
    actions$ = of(SecurityActions.changePassword({ currentPassword: 'a', newPassword: 'b' }));

    const action = await firstValueFrom(effects.changePassword$);
    expect(action).toEqual(
      SecurityActions.changePasswordFailure({ error: 'Password change failed' }),
    );
  });
});
