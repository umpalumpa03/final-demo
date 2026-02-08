import {
  ChangeDetectionStrategy,
  Component,
  inject,
  computed,
  OnInit,
  signal,
  DestroyRef,
} from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
// import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// import { filter, take } from 'rxjs';
import { StepperHeader } from 'apps/tia-frontend/src/app/features/storybook/components/forms/multistep-form/stepper-header/stepper-header';
import { TransferRepeatService } from '../services/transfer-repeat.service';
// import {
//   externalBankMock,
//   sameBankMock,
// } from '../config/mock-transfer-data.config';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';

@Component({
  selector: 'app-transfers-external',
  imports: [RouterOutlet, TranslatePipe, StepperHeader, RouteLoader],
  templateUrl: './transfers-external.html',
  styleUrl: './transfers-external.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransfersExternal implements OnInit {
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  // private readonly repeatService = inject(TransferRepeatService);
  // private readonly destroyRef = inject(DestroyRef);

  public isLoadingMeta = signal(false);

  public readonly steps = computed(() => [
    {
      key: 'recipient',
      label: this.translate.instant('transfers.external.stepper.recipient'),
    },
    {
      key: 'accounts',
      label: this.translate.instant('transfers.external.stepper.accounts'),
    },
    {
      key: 'amount',
      label: this.translate.instant('transfers.external.stepper.amount'),
    },
  ]);

  public get currentStep(): number {
    const url = this.router.url;
    if (url.includes('recipient')) return 1;
    if (url.includes('accounts')) return 2;
    if (url.includes('amount')) return 3;
    return 1;
  }

  public ngOnInit(): void {
    // const testMeta = externalBankMock;
    // if (testMeta) {
    //   this.isLoadingMeta.set(true);
    //   this.repeatService.initRepeatTransfer(testMeta);
    //   this.router.events
    //     .pipe(
    //       filter((event) => event instanceof NavigationEnd),
    //       take(1),
    //       takeUntilDestroyed(this.destroyRef),
    //     )
    //     .subscribe(() => {
    //       this.isLoadingMeta.set(false);
    //     });
    // }
  }
}
