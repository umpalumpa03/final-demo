import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Verify } from './verify';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterEvent } from '@angular/router';
import { Subject } from 'rxjs';
import { LoanVerifyState } from '../../../state/loan-verify.state';
import { signal } from '@angular/core';

describe('Verify', () => {
  let component: Verify;
  let fixture: ComponentFixture<Verify>;
  let routerEvents$: Subject<RouterEvent>;

  const mockVerifyState = {
    otpConfig: signal({}),
  };

  beforeEach(async () => {
    routerEvents$ = new Subject<RouterEvent>();

    await TestBed.configureTestingModule({
      imports: [Verify, TranslateModule.forRoot()],
      providers: [
        {
          provide: Router,
          useValue: {
            events: routerEvents$.asObservable(),
            navigate: vi.fn(),
          },
        },
      ],
    })
      .overrideComponent(Verify, {
        set: {
          providers: [{ provide: LoanVerifyState, useValue: mockVerifyState }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Verify);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit cancel', () => {
    const spy = vi.spyOn(component.cancel, 'emit');
    component.cancel.emit();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit verify on valid otp event', () => {
    const spy = vi.spyOn(component.verify, 'emit');

    component.onVerify('1234');

    expect(spy).toHaveBeenCalledWith('1234');
  });
});
