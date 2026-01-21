import { Component, Input } from '@angular/core';
import { BadgeVariant } from './models/badges.models';


@Component({
  selector: 'app-badges',
  imports: [],
  templateUrl: './badges.html',
  styleUrl: './badges.scss',
})
export class Badges {
  @Input() variant: BadgeVariant = 'default';
  @Input() text: string = '';

  get badgeClass(): string {
    return `badge badge--${this.variant}`;
  }
}
