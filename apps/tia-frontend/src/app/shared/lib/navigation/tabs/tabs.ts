import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TabItem } from '../models/tab.model';

@Component({
  selector: 'app-tabs',
  imports: [RouterModule],
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tabs {
  public readonly tabs = input<TabItem[]>();
  public readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
}
