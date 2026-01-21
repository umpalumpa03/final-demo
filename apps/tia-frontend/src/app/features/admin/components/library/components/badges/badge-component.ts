import { Component } from '@angular/core';
import { Badges } from '../../../../../../shared/lib/primitives/badges/badges';

@Component({
  selector: 'app-badge-component',
  imports: [Badges],
  templateUrl: './badge-component.html',
  styleUrl: './badge-component.scss',
})
export class BadgeComponent {}
