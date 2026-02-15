import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { OverlayModule, ConnectedPosition } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { TooltipPlacement } from '../models/tooltip.models';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule, OverlayModule],
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Tooltip {
  public content = input.required<string>();
  public placement = input<TooltipPlacement>('top');
  public disabled = input<boolean>(false);
  public isOpen = signal(false);

  public positionStrategy = computed((): ConnectedPosition[] => {
    switch (this.placement()) {
      case 'top':
        return [
          {
            originX: 'center',
            originY: 'top',
            overlayX: 'center',
            overlayY: 'bottom',
            offsetY: -8,
          },
        ];
      case 'bottom':
        return [
          {
            originX: 'center',
            originY: 'bottom',
            overlayX: 'center',
            overlayY: 'top',
            offsetY: 8,
          },
        ];
      case 'left':
        return [
          {
            originX: 'start',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center',
            offsetX: -8,
          },
        ];
      case 'right':
        return [
          {
            originX: 'end',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'center',
            offsetX: 8,
          },
        ];
      default:
        return [
          {
            originX: 'center',
            originY: 'top',
            overlayX: 'center',
            overlayY: 'bottom',
            offsetY: -8,
          },
        ];
    }
  });

  public open(): void {
    if (!this.disabled()) {
      this.isOpen.set(true);
    }
  }

  public close(): void {
    this.isOpen.set(false);
  }
}
