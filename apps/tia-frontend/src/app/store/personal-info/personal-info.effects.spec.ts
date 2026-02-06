import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError, firstValueFrom } from 'rxjs';
import { Action } from '@ngrx/store';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { PersonalInfoEffects } from './personal-info.effects';
import { PersonalInfoApiService } from '../../shared/services/personal-info/personal-info.api.service';
import { PersonalInfoActions } from './pesronal-info.actions';
import { PersonalInfoDto } from './personal-info.state';

describe('PersonalInfoEffects (Vitest)', () => {
  let actions$: Observable<Action>;
  let effects: PersonalInfoEffects;
  let apiService: {
    getPersonalInfo: ReturnType<typeof vi.fn>;
    updatePersonalInfo: ReturnType<typeof vi.fn>;
  };

  const mockDto: PersonalInfoDto = {
    pId: '12345678901',
    phone: '555999333',
  };

  const basePersonalInfoPayload = {
    pId: '12345678901',
    phoneNumber: '555999333',
    loading: false,
    error: null,
  };

  beforeEach(() => {
    apiService = {
      getPersonalInfo: vi.fn(),
      updatePersonalInfo: vi.fn(),
    };

    actions$ = of(PersonalInfoActions.loadPersonalInfo());

    TestBed.configureTestingModule({
      providers: [
        PersonalInfoEffects,
        provideMockActions(() => actions$),
        { provide: PersonalInfoApiService, useValue: apiService },
      ],
    });

    effects = TestBed.inject(PersonalInfoEffects);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should dispatch loadPersonalInfoSuccess with mapped state', async () => {
    (apiService.getPersonalInfo as any).mockReturnValue(of(mockDto));

    const action = await firstValueFrom(effects.loadPersonalInfo$);

    expect(action).toEqual(
      PersonalInfoActions.loadPersonalInfoSuccess({
        personalInfo: {
          pId: mockDto.pId,
          phoneNumber: mockDto.phone,
          loading: false,
          error: null,
        },
      }),
    );

    expect(apiService.getPersonalInfo).toHaveBeenCalledTimes(1);
  });

 

  it('should dispatch updatePersonalInfoSuccess when update succeeds', async () => {
    (apiService.updatePersonalInfo as any).mockReturnValue(
      of({ message: 'pId updated' }),
    );

    actions$ = of(
      PersonalInfoActions.updatePersonalInfo({ personalInfo: basePersonalInfoPayload }),
    );

    const action = await firstValueFrom(effects.updatePersonalInfo$);

    expect(action).toEqual(
      PersonalInfoActions.updatePersonalInfoSuccess({
        personalInfo: {
          ...basePersonalInfoPayload,
          loading: false,
          error: null,
        },
      }),
    );

    expect(apiService.updatePersonalInfo).toHaveBeenCalledWith({
      pId: basePersonalInfoPayload.pId,
    });
  });

  it('should dispatch updatePersonalInfoFailure when update throws', async () => {
    (apiService.updatePersonalInfo as any).mockReturnValue(
      throwError(() => new Error('Update failed')),
    );

    actions$ = of(
      PersonalInfoActions.updatePersonalInfo({ personalInfo: basePersonalInfoPayload }),
    );

    const action = await firstValueFrom(effects.updatePersonalInfo$);

    expect(action).toEqual(
      PersonalInfoActions.updatePersonalInfoFailure({
        error: 'Update failed',
      }),
    );
  });
});

