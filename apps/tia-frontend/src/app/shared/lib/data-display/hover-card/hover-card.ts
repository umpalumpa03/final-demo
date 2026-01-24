import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { HoverCardPlacement } from '../models/hover-card.models';

@Component({
  selector: 'app-hover-card',
  imports: [],
  templateUrl: './hover-card.html',
  styleUrl: './hover-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HoverCard {
  public placement = input<HoverCardPlacement>('top');
  public isOpen = signal(false);

  public open(): void {
    this.isOpen.set(true);
  }

  public close(): void {
    this.isOpen.set(false);
  }
}
