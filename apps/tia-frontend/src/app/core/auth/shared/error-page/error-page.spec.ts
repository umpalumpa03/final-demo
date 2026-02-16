import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ErrorPage } from './error-page';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { vi } from 'vitest';

describe('ErrorPage', () => {
  it('navigates to sign-in after timer elapses', () => {
    vi.useFakeTimers();

    const routerMock = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [ErrorPage, { provide: Router, useValue: routerMock }],
    });

    const comp = TestBed.inject(ErrorPage);

    vi.advanceTimersByTime(6000);

    expect(routerMock.navigate).toHaveBeenCalledWith(["/auth/sign-in"].map((p) => p === '/auth/sign-in' ? '/auth/sign-in' : p));

    vi.useRealTimers();
  });
});

describe('ErrorPage', () => {
  let component: ErrorPage;
  let fixture: ComponentFixture<ErrorPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorPage, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
