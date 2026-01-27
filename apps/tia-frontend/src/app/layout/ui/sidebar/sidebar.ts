import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SIDEBARDATA } from './config/routes.config';
import { NavigationBar } from '@tia/shared/lib/navigation/navigation-bar/navigation-bar';

@Component({
  selector: 'app-sidebar',
  imports: [NavigationBar],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  public readonly items = SIDEBARDATA;
  public readonly router = inject(Router);
}
