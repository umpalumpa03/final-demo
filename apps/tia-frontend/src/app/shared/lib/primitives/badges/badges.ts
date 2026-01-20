import { Component, Input } from '@angular/core';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

@Component({
  selector: 'app-badges',
  imports: [],
  templateUrl: './badges.html',
  styleUrl: './badges.scss',
})
export class Badges {
  @Input() variant: BadgeVariant = 'default';
  @Input() text: string = '';
}
