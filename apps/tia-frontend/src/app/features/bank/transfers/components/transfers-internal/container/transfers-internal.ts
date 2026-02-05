import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import {
  StepperHeader
} from 'apps/tia-frontend/src/app/features/storybook/components/forms/multistep-form/stepper-header/stepper-header';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-transfers-internal',
  imports: [
    RouterOutlet,
    StepperHeader,
    TranslatePipe
  ],
  templateUrl: './transfers-internal.html',
  styleUrl: './transfers-internal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransfersInternal {
  private router = inject(Router);

  public steps = [
    { key: 'from-account', label: 'From Account' },
    { key: 'to-account', label: 'To Account' },
    { key: 'amount', label: 'Amount' },
  ];

  public get currentStep(): number {
    const url = this.router.url;
    if (url.includes('from-account')) return 1;
    if (url.includes('to-account')) return 2;
    if (url.includes('amount')) return 3;
    return 1;
  }
}
