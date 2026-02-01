import { describe, it, expect } from 'vitest';
import { signal } from '@angular/core';

import { updateSidePanelForRoute } from './resolve-panel-data';
import { Routes } from '../models/tokens.model';
import { AUTH_SIDE_PANEL_DATA } from '../config/inputs.config';

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

  it('sets otpSignIn panel for OTP_SIGN_IN', () => {
    const s = signal(null as any);
    updateSidePanelForRoute(Routes.OTP_SIGN_IN, s);
    expect(s()).toEqual(AUTH_SIDE_PANEL_DATA.otpSignIn);
  });

  it('sets otpSignUp panel for OTP_SIGN_UP', () => {
    const s = signal(null as any);
    updateSidePanelForRoute(Routes.OTP_SIGN_UP, s);
    expect(s()).toEqual(AUTH_SIDE_PANEL_DATA.otpSignUp);
  });

  it('sets otpForgotPassword panel for OTP_FORGOT_PASSWORD', () => {
    const s = signal(null as any);
    updateSidePanelForRoute(Routes.OTP_FORGOT_PASSWORD, s);
    expect(s()).toEqual(AUTH_SIDE_PANEL_DATA.otpForgotPassword);
  });

  it('sets phone panel for PHONE', () => {
    const s = signal(null as any);
    updateSidePanelForRoute(Routes.PHONE, s);
    expect(s()).toEqual(AUTH_SIDE_PANEL_DATA.phone);
  });

  it('sets resetPassword panel for RESET_PASSWORD', () => {
    const s = signal(null as any);
    updateSidePanelForRoute(Routes.RESET_PASSWORD, s);
    expect(s()).toEqual(AUTH_SIDE_PANEL_DATA.resetPassword);
  });

  it('sets signIn panel as default for unknown routes', () => {
    const s = signal(null as any);
    updateSidePanelForRoute('/unknown-route', s);
    expect(s()).toEqual(AUTH_SIDE_PANEL_DATA.signIn);
  });
});
