import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { WidgetItem } from '../../models/customizable-widgets.model';

@Component({
  selector: 'app-widget-card',
  templateUrl: './widget-card.html',
  styleUrl: './widget-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetCard {
  public readonly item = input.required<WidgetItem>();
}
