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
import { BasicCard } from "@tia/shared/lib/cards/basic-card/basic-card";

@Component({
  selector: 'app-language-container',
  imports: [TranslatePipe, SettingsBody, LanguageSelection, BasicCard],
  templateUrl: './language-container.html',
  styleUrl: './language-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageContainer implements OnInit {
  public readonly languagesStore = inject(LanguagesStore);

  public readonly isLoading = this.languagesStore.isLoading;
  public readonly languages = this.languagesStore.languages;
  public readonly hasError = this.languagesStore.hasError;
  public readonly hasLoaded = this.languagesStore.hasLoaded;
  public readonly isRefreshing = this.languagesStore.isRefreshing;

  public ngOnInit(): void {
    this.languagesStore.fetchLanguages({});
  }
}
