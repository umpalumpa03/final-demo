import { ChangeDetectionStrategy, Component, } from '@angular/core';
import { LanguageSwitcher } from "../components/language-switcher/language-switcher";
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-language-container',
  imports: [LanguageSwitcher, TranslatePipe],
  templateUrl: './language-container.html',
  styleUrl: './language-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageContainer {
}

