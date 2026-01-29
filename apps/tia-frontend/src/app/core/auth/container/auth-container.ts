import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { SidePanel } from '../components/shared/side-panel/side-panel';
import { IFeature } from '../models/auth.models';
import { AUTH_SIDE_PANEL_DATA } from '../models/input-config.models';
import { Routes } from '../models/tokens.model';

@Component({
  selector: 'app-auth-container',
  imports: [RouterOutlet, SidePanel],
  templateUrl: './auth-container.html',
  styleUrl: './auth-container.scss',
  providers: [TokenService, AuthService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthContainer implements OnInit {
  private router = inject(Router);
  private destroRef = inject(DestroyRef);

  public sidePanelData = signal<IFeature | null>(null);

  ngOnInit() {
    this.updateSidePanelForRoute(this.router.url);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateSidePanelForRoute(event.url);
      }
    });
  }

  private updateSidePanelForRoute(url: string): void {
    const route = url.split('/').pop() || '';

    switch (route) {
      case Routes.SIGN_IN:
        this.sidePanelData.set(AUTH_SIDE_PANEL_DATA.signIn);
        break;
      case Routes.SIGN_UP:
        this.sidePanelData.set(AUTH_SIDE_PANEL_DATA.signUp);
        break;
      case Routes.ROTGOT_PASSWORD:
        this.sidePanelData.set(AUTH_SIDE_PANEL_DATA.forgotPassword);
        break;
      case Routes.OTP_SIGN_IN:
        this.sidePanelData.set(AUTH_SIDE_PANEL_DATA.otpSignIn);
        break;
      case Routes.OTP_SIGN_UP:
        this.sidePanelData.set(AUTH_SIDE_PANEL_DATA.otpSignUp);
        break;
      case Routes.OTP_FORGOT_PASSWORD:
        this.sidePanelData.set(AUTH_SIDE_PANEL_DATA.otpForgotPassword);
        break;
      case Routes.SIGN_UP_SUCCESS:
        this.sidePanelData.set(AUTH_SIDE_PANEL_DATA.signUpSuccess);
        break;
      case Routes.FORGOT_PASSWORD_SUCCESS:
        this.sidePanelData.set(AUTH_SIDE_PANEL_DATA.forgotPasswordSuccess);
        break;
      case Routes.PHONE:
        this.sidePanelData.set(AUTH_SIDE_PANEL_DATA.phone);
        break;
      default:
        this.sidePanelData.set(AUTH_SIDE_PANEL_DATA.signIn);
        break;
    }
  }
}
