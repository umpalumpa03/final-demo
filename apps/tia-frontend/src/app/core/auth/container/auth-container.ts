import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { updateSidePanelForRoute } from '../utils/resolve-panel-data';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { IFeature } from '../models/auth.models';
import { SidePanel } from '../shared/side-panel/side-panel';
import { tap } from 'rxjs';
import { LanguageContainer } from "../../../features/bank/settings/components/language/container/language-container";

@Component({
  selector: 'app-auth-container',
  imports: [RouterOutlet, SidePanel, LanguageContainer],
  templateUrl: './auth-container.html',
  styleUrl: './auth-container.scss',
  providers: [TokenService, AuthService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthContainer implements OnInit {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  public sidePanelData = signal<IFeature | null>(null);

  public ngOnInit(): void {
    updateSidePanelForRoute(this.router.url, this.sidePanelData);

    this.router.events
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          if (res instanceof NavigationEnd) {
            updateSidePanelForRoute(res.url, this.sidePanelData);
          }
        }),
      )
      .subscribe();
  }
}
