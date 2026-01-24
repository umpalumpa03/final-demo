import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NAVIGATION_ITEMS } from './config/navigation.config';
import { NavigationItem } from './model/navigation.model';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
})
export class Navigation {
  public readonly navigationItems: NavigationItem[] = NAVIGATION_ITEMS;
}
