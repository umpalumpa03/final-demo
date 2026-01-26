import { Component } from '@angular/core';
import { AccountsComponent } from '../components/accounts.component';

@Component({
  selector: 'app-accounts-container',
  imports: [AccountsComponent],
  templateUrl: './accounts-container.html',
  styleUrl: './accounts-container.scss',
})
export class AccountsContainer {
}
