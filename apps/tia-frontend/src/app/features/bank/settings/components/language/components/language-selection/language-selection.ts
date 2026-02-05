import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Language } from '../../models/language.model';
import { LanguageSelectionCard } from './language-selection-card/language-selection-card';

@Component({
  selector: 'app-language-selection',
  imports: [LanguageSelectionCard],
  templateUrl: './language-selection.html',
  styleUrl: './language-selection.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelection {
  public languages = input.required<Language[]>();
  public isLoading = input.required<boolean>();
  public hasError = input.required<boolean>();
}
