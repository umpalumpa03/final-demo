import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WidgetCard } from './components/widget-card/widget-card';
import { WIDGET_ITEMS } from './config/customizable-widgets.config';

@Component({
  selector: 'app-customizable-widgets',
  imports: [WidgetCard],
  templateUrl: './customizable-widgets.html',
  styleUrl: './customizable-widgets.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomizableWidgets {
  protected readonly items = WIDGET_ITEMS;
}
