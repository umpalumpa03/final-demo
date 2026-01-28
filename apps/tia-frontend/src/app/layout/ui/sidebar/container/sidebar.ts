import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  OnInit,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationBar } from '@tia/shared/lib/navigation/navigation-bar/navigation-bar';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from 'apps/tia-frontend/src/app/core/auth/services/auth.service';
import { NavigationItem } from '@tia/shared/lib/navigation/models/nav-bar.model';
import { getSidebarItems } from '../config/routes.config';

@Component({
  selector: 'app-sidebar',
  imports: [NavigationBar, ButtonComponent, TranslatePipe],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar implements OnInit {
  private translate = inject(TranslateService);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  public isCollapsed = signal(false);
  public items = signal<NavigationItem[]>([]);

  ngOnInit(): void {
    this.updateItems();

    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateItems());
  }

  private updateItems(): void {
    this.items.set(getSidebarItems(this.translate));
  }

  public toggleCollapse(): void {
    this.isCollapsed.update((v) => !v);
  }

  public onLogout(): void {
    this.authService.logout().subscribe();
  }
}
