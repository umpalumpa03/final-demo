import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Tabs } from '@tia/shared/lib/navigation/tabs/tabs';
import { TRANSFERTABS } from '../config/transfer-tabs.config';
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-transfers-container',
  imports: [Tabs, RouterModule],
  templateUrl: './transfers-container.html',
  styleUrl: './transfers-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransfersContainer {
  public readonly transferTabs = signal(TRANSFERTABS);
}
