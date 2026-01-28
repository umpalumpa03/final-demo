import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { ResetSuccess } from './reset-success';
import { AuthService } from '../../../../services/auth.service';

describe('ResetSuccess', () => {
  let component: ResetSuccess;
  let fixture: ComponentFixture<ResetSuccess>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetSuccess],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetSuccess);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  it('redirects to sign-in after countdown', () => {
    vi.useFakeTimers();

    component.ngOnInit();
    vi.advanceTimersByTime(5000);

    expect(router.navigate).toHaveBeenCalledWith(['/auth/sign-in']);
    expect(component.countdown()).toBe(0);

    vi.useRealTimers();
  });

  it('clears interval on destroy', () => {
    vi.useFakeTimers();
    const clearSpy = vi.spyOn(window, 'clearInterval');

    component.ngOnInit();
    component.ngOnDestroy();

    expect(clearSpy).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
