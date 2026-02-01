import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  OnDestroy,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Tabs } from '@tia/shared/lib/navigation/tabs/tabs';
import { TabItem } from '@tia/shared/lib/navigation/models/tab.model';
import { LibraryTitle } from '../../../storybook/shared/library-title/library-title';
import { getTransferTabs } from '../config/transfer-tabs.config';
import { TransferStore } from '../store/transfers.store';

@Component({
  selector: 'app-transfers-container',
  imports: [Tabs, RouterModule, LibraryTitle, TranslatePipe],
  templateUrl: './transfers-container.html',
  styleUrl: './transfers-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransfersContainer implements OnDestroy {
  private translate = inject(TranslateService);
  private store = inject(TransferStore);

  public readonly transferTabs = signal<TabItem[]>(
    getTransferTabs(this.translate),
  );

  public ngOnDestroy(): void {
    this.store.reset();
  }
}
