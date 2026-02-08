import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { NoConnectionService } from '../service/no-connection.service';

@Component({
  selector: 'app-no-connection',
  imports: [UiModal, TranslatePipe],
  templateUrl: './no-connection.html',
  styleUrl: './no-connection.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoConnection implements OnInit {
  private readonly noConnectionService = inject(NoConnectionService);

  public isModalOpen = signal(false);
  public isReconnected = signal(false);

  public ngOnInit(): void {
    if (!this.noConnectionService.isOnline()) {
      this.isModalOpen.set(true);
    }

    this.noConnectionService.onOnline = () => {
      this.isReconnected.set(true);
      setTimeout(() => {
        this.isModalOpen.set(false);
        this.isReconnected.set(false);
      }, 2000);
    };

    this.noConnectionService.onOffline = () => {
      this.isReconnected.set(false);
      this.isModalOpen.set(true);
    };
  }
}
