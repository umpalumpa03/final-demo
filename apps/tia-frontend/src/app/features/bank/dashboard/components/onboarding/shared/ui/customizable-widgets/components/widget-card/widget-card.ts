import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { WidgetItem } from '../../models/customizable-widgets.model';

@Component({
  selector: 'app-widget-card',
  imports: [TranslatePipe],
  templateUrl: './widget-card.html',
  styleUrl: './widget-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetCard {
  public readonly item = input.required<WidgetItem>();
}
