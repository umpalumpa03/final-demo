import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-external-amount',
  imports: [],
  templateUrl: './external-amount.html',
  styleUrl: './external-amount.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalAmount {}
