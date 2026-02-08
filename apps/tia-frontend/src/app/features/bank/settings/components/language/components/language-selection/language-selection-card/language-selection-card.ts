import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Language } from '../../../models/language.model';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-language-selection-card',
  imports: [TranslatePipe],
  templateUrl: './language-selection-card.html',
  styleUrl: './language-selection-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelectionCard {
  public language = input.required<Language>();
  public isSelected = input<boolean>(false);
  public selected = output<Language>();

  public onCardClick(): void {
    this.selected.emit(this.language());
  }
}
