import {
  ChangeDetectionStrategy,
  Component,
  inject,
  computed,
  OnDestroy,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { StepperHeader } from 'apps/tia-frontend/src/app/features/storybook/components/forms/multistep-form/stepper-header/stepper-header';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TransferStore } from '../../../store/transfers.store';

@Component({
  selector: 'app-transfers-internal',
  imports: [RouterOutlet, StepperHeader, TranslatePipe],
  templateUrl: './transfers-internal.html',
  styleUrl: './transfers-internal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransfersInternal implements OnDestroy {
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly transferStore = inject(TransferStore);

  public readonly steps = computed(() => [
    {
      key: 'from-account',
      label: this.translate.instant('transfers.internal.stepper.fromAccount'),
    },
    {
      key: 'to-account',
      label: this.translate.instant('transfers.internal.stepper.toAccount'),
    },
    {
      key: 'amount',
      label: this.translate.instant('transfers.internal.stepper.amount'),
    },
  ]);

  public get currentStep(): number {
    const url = this.router.url;
    if (url.includes('from-account')) return 1;
    if (url.includes('to-account')) return 2;
    if (url.includes('amount')) return 3;
    return 1;
  }

  public ngOnDestroy(): void {
    this.transferStore.reset();
  }
}
