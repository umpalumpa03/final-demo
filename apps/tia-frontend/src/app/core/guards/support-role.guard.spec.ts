import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { firstValueFrom, Observable } from 'rxjs';
import { supportRoleGuard } from './support-role.guard';
import { userInfoFeature } from '../../store/user-info/user-info.reducer';
import { describe, it, expect, beforeEach } from 'vitest';

describe('supportRoleGuard', () => {
  let store: MockStore;
  let router: Router;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        {
          provide: Router,
          useValue: {
            createUrlTree: (commands: string[]) =>
              ({ path: commands.join('/') }) as unknown as UrlTree,
          },
        },
      ],
    });

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
  });

  it('should redirect to dashboard if user role is NOT SUPPORT', async () => {
    store.overrideSelector(userInfoFeature.selectRole, 'CONSUMER');

    const result = await TestBed.runInInjectionContext(async () => {
      const guardOutput = supportRoleGuard({} as any, {} as any) as Observable<
        boolean | UrlTree
      >;
      return await firstValueFrom(guardOutput);
    });
    expect((result as any).path).toBe('/bank/dashboard');
  });
});
