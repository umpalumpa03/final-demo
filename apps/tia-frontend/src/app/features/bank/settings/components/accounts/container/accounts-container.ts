import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SettingsBody } from "../../../shared/ui/settings-body/settings-body";
import { AccountCard } from "../shared/account-card/account-card";


@Component({
  selector: 'app-accounts-container',
  imports: [SettingsBody, AccountCard],
  templateUrl: './accounts-container.html',
  styleUrl: './accounts-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsContainer {
}
