import { ChangeDetectionStrategy, Component, } from '@angular/core';
import { LanguageSwitcher } from "../components/language-switcher/language-switcher";
import { TranslatePipe } from '@ngx-translate/core';
import { SettingsBody } from "../../../shared/ui/settings-body/settings-body";


@Component({
  selector: 'app-language-container',
  imports: [LanguageSwitcher, TranslatePipe, SettingsBody],
  templateUrl: './language-container.html',
  styleUrl: './language-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageContainer {
}

