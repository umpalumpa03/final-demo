import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { IFeature } from '../models/auth.models';
import { AUTH_SIDE_PANEL_DATA } from '../models/input-config.models';
import { Routes } from '../models/tokens.model';
import { SidePanel } from '../shared/side-panel/side-panel';

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
  private destroyRef = inject(DestroyRef);

  public sidePanelData = signal<IFeature | null>(null);

  ngOnInit() {
    this.updateSidePanelForRoute(this.router.url);

    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.updateSidePanelForRoute(event.url);
        }
      });
  }

  private updateSidePanelForRoute(url: string): void {
    const route = url;

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
      case Routes.PHONE:
        this.sidePanelData.set(AUTH_SIDE_PANEL_DATA.phone);
        break;
      default:
        this.sidePanelData.set(AUTH_SIDE_PANEL_DATA.signIn);
        break;
    }
  }
}
