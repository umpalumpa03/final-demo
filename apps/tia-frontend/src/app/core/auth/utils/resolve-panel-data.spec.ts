import { describe, it, expect } from 'vitest';
import { signal } from '@angular/core';

import { updateSidePanelForRoute } from './resolve-panel-data';
import { Routes } from '../models/tokens.model';
import { AUTH_SIDE_PANEL_DATA } from '../models/input-config.models';

describe('updateSidePanelForRoute', () => {
  it('sets signIn panel for SIGN_IN', () => {
    const s = signal(null as any);
    updateSidePanelForRoute(Routes.SIGN_IN, s);
    expect(s()).toEqual(AUTH_SIDE_PANEL_DATA.signIn);
  });

  it('sets signUp panel for SIGN_UP', () => {
    const s = signal(null as any);
    updateSidePanelForRoute(Routes.SIGN_UP, s);
    expect(s()).toEqual(AUTH_SIDE_PANEL_DATA.signUp);
  });

  it('sets forgotPassword panel for ROTGOT_PASSWORD', () => {
    const s = signal(null as any);
    updateSidePanelForRoute(Routes.ROTGOT_PASSWORD, s);
    expect(s()).toEqual(AUTH_SIDE_PANEL_DATA.forgotPassword);
  });

  it('sets otpSignUp and phone panels', () => {
    const s1 = signal(null as any);
    updateSidePanelForRoute(Routes.OTP_SIGN_UP, s1);
    expect(s1()).toEqual(AUTH_SIDE_PANEL_DATA.otpSignUp);

    const s2 = signal(null as any);
    updateSidePanelForRoute(Routes.PHONE, s2);
    expect(s2()).toEqual(AUTH_SIDE_PANEL_DATA.phone);
  });
});
