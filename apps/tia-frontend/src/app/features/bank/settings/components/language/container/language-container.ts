import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SettingsBody } from '../../../shared/ui/settings-body/settings-body';
import { LanguageSelection } from '../components/language-selection/language-selection';
import { LanguagesStore } from '../store/languages.store';

@Component({
  selector: 'app-language-container',
  imports: [
    TranslatePipe,
    SettingsBody,
    LanguageSelection,
],
  providers: [LanguagesStore],
  templateUrl: './language-container.html',
  styleUrl: './language-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageContainer implements OnInit {
  public languagesStore = inject(LanguagesStore);

  public isLoading = this.languagesStore.isLoading;
  public languages = this.languagesStore.languages; 
  public hasError = this.languagesStore.hasError;

  public ngOnInit(): void {
    this.languagesStore.fetchLanguages();
  }
}
