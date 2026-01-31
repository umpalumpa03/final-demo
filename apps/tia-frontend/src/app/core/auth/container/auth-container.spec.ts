import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

import { AuthContainer } from './auth-container';
import { Routes } from '../models/tokens.model';
import { AUTH_SIDE_PANEL_DATA } from '../config/inputs.config';

describe('AuthContainer', () => {
  let fixture: ComponentFixture<AuthContainer>;
  let component: AuthContainer;
  let events$: Subject<any>;
  let routerStub: any;

  beforeEach(async () => {
    events$ = new Subject<any>();
    routerStub = {
      url: Routes.SIGN_IN,
      events: events$,
    };

    await TestBed.configureTestingModule({
      imports: [AuthContainer],
      providers: [{ provide: Router, useValue: routerStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('sets signIn panel on init when route is SIGN_IN', () => {
    const panel = component.sidePanelData();
    expect(panel).toEqual(AUTH_SIDE_PANEL_DATA.signIn);
  });

  it('updates panel on NavigationEnd events for various routes', () => {
    // SIGN_UP
    events$.next(new NavigationEnd(1, Routes.SIGN_UP, Routes.SIGN_UP));
    expect(component.sidePanelData()).toEqual(AUTH_SIDE_PANEL_DATA.signUp);

    // PHONE
    events$.next(new NavigationEnd(2, Routes.PHONE, Routes.PHONE));
    expect(component.sidePanelData()).toEqual(AUTH_SIDE_PANEL_DATA.phone);

    events$.next(new NavigationEnd(3, Routes.OTP_SIGN_IN, Routes.OTP_SIGN_IN));
    expect(component.sidePanelData()).toEqual(AUTH_SIDE_PANEL_DATA.otpSignIn);

    events$.next(new NavigationEnd(4, Routes.OTP_SIGN_UP, Routes.OTP_SIGN_UP));
    expect(component.sidePanelData()).toEqual(AUTH_SIDE_PANEL_DATA.otpSignUp);

    events$.next(
      new NavigationEnd(5, Routes.OTP_FORGOT_PASSWORD, Routes.OTP_FORGOT_PASSWORD),
    );
    expect(component.sidePanelData()).toEqual(AUTH_SIDE_PANEL_DATA.otpForgotPassword);

    events$.next(new NavigationEnd(6, Routes.ROTGOT_PASSWORD, Routes.ROTGOT_PASSWORD));
    expect(component.sidePanelData()).toEqual(AUTH_SIDE_PANEL_DATA.forgotPassword);
  });

  it('defaults to signIn panel for unknown routes', () => {
    events$.next(new NavigationEnd(4, '/some/unknown', '/some/unknown'));
    expect(component.sidePanelData()).toEqual(AUTH_SIDE_PANEL_DATA.signIn);
  });
});
