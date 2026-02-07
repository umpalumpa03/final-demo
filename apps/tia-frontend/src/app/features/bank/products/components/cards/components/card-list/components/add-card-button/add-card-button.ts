import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-add-card-button',
  templateUrl: './add-card-button.html',
  styleUrls: ['./add-card-button.scss'],
  imports: [ButtonComponent, BasicCard,TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCardButton {
  public readonly clicked = output<void>();

  public handleClick(): void {
    this.clicked.emit();
  }
}