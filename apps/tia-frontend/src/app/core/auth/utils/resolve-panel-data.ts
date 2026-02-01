import { AUTH_SIDE_PANEL_DATA } from '../config/inputs.config';
import { IFeature } from '../models/auth.models';
import { Routes } from '../models/tokens.model';
import type { WritableSignal } from '@angular/core';

export function updateSidePanelForRoute(
  url: string,
  sidePanelData: WritableSignal<IFeature | null>,
): void {
  switch (url) {
    case Routes.SIGN_IN:
      sidePanelData.set(AUTH_SIDE_PANEL_DATA.signIn);
      break;

    case Routes.SIGN_UP:
      sidePanelData.set(AUTH_SIDE_PANEL_DATA.signUp);
      break;

    case Routes.ROTGOT_PASSWORD:
      sidePanelData.set(AUTH_SIDE_PANEL_DATA.forgotPassword);
      break;

    case Routes.OTP_SIGN_IN:
      sidePanelData.set(AUTH_SIDE_PANEL_DATA.otpSignIn);
      break;

    case Routes.OTP_SIGN_UP:
      sidePanelData.set(AUTH_SIDE_PANEL_DATA.otpSignUp);
      break;

    case Routes.OTP_FORGOT_PASSWORD:
      sidePanelData.set(AUTH_SIDE_PANEL_DATA.otpForgotPassword);
      break;

    case Routes.PHONE:
      sidePanelData.set(AUTH_SIDE_PANEL_DATA.phone);
      break;

    case Routes.RESET_PASSWORD:
      sidePanelData.set(AUTH_SIDE_PANEL_DATA.resetPassword);
      break;

    default:
      sidePanelData.set(AUTH_SIDE_PANEL_DATA.signIn);
  }
}
