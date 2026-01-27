import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';

@Component({
  selector: 'app-loan-header',
  imports: [ButtonComponent],
  templateUrl: './loan-header.html',
  styleUrl: './loan-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanHeader {}
