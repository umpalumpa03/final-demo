import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';

@Component({
  selector: 'app-loan-header',
  imports: [ButtonComponent, TranslatePipe],
  templateUrl: './loan-header.html',
  styleUrl: './loan-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanHeader {
  protected requestClick = output<void>();
}
