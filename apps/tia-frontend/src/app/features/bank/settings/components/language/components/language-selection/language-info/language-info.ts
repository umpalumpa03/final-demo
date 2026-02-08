import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { BasicAlerts } from "@tia/shared/lib/alerts/components/basic-alerts/basic-alerts";

@Component({
  selector: 'app-language-info',
  imports: [BasicAlerts, TranslatePipe],
  templateUrl: './language-info.html',
  styleUrl: './language-info.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageInfo {}
