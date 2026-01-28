import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
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
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IFeaturePanel } from '../models/config.models';

@Component({
  selector: 'app-auth-container',
  imports: [RouterOutlet, SidePanel],
  templateUrl: './auth-container.html',
  styleUrl: './auth-container.scss',
  providers: [TokenService, AuthService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthContainer {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  public sidePanelData = signal<{
    title: string;
    description: string;
    features: IFeaturePanel[];
  } | null>(null);

  constructor() {
    this.updateSidePanelData();

    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.updateSidePanelData();
      });
  }

  private updateSidePanelData(): void {
    let current = this.route;
    while (current.firstChild) {
      current = current.firstChild;
    }
    current.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      this.sidePanelData.set(data['sidePanel'] ?? null);
    });
  }
}
