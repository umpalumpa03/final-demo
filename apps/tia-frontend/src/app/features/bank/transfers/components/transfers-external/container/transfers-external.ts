import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { StepperHeader } from 'apps/tia-frontend/src/app/features/storybook/components/forms/multistep-form/stepper-header/stepper-header';

@Component({
  selector: 'app-transfers-external',
  imports: [RouterOutlet, TranslatePipe, StepperHeader],
  templateUrl: './transfers-external.html',
  styleUrl: './transfers-external.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransfersExternal {
  private router = inject(Router);
  public steps = [
    { key: 'recipient', label: 'Recipient' },
    { key: 'accounts', label: 'Accounts' },
    { key: 'amount', label: 'Amount' },
  ];

  public get currentStep(): number {
    const url = this.router.url;
    if (url.includes('recipient')) return 1;
    if (url.includes('accounts')) return 2;
    if (url.includes('amount')) return 3;
    return 1;
  }
}
