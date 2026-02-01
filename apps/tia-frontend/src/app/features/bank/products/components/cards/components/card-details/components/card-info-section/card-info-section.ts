import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-card-info-section',
  templateUrl: './card-info-section.html',
  styleUrls: ['./card-info-section.scss'],
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardInfoSection {
  readonly cardName = input.required<string>();
  readonly cardType = input.required<string>();
  readonly currency = input.required<string>();
  readonly status = input.required<string>();
  readonly isActiveStatus = input.required<boolean>();
  readonly formattedBalance = input.required<string>();
  readonly shouldShowCreditLimit = input.required<boolean>();
  readonly formattedCreditLimit = input.required<string>();
}