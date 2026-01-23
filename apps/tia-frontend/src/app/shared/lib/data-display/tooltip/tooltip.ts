import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { TooltipPlacement } from './models/tooltip.models';

@Component({
  selector: 'app-tooltip',
  imports: [],
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tooltip {
  public content = input.required<string>();
  public placement = input<TooltipPlacement>('top');
  public isOpen = signal(false);

  public open(): void {
    this.isOpen.set(true);
  }

  public close(): void {
    this.isOpen.set(false);
  }
}
