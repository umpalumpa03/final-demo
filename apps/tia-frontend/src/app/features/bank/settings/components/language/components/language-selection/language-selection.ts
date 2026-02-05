import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Language } from '../../models/language.model';

@Component({
  selector: 'app-language-selection',
  imports: [],
  templateUrl: './language-selection.html',
  styleUrl: './language-selection.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelection {
  public languages = input.required<Language[]>();
  public isLoading = input.required<boolean>();
  public hasError = input.required<boolean>();
}
