import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NAVIGATION_ITEMS } from './navigation.config';

interface NavigationItem {
  routerLink: string;
  activeLink: string;
  link: string;
}

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
})
export class Navigation {
  public readonly navigationItems = NAVIGATION_ITEMS;
}
