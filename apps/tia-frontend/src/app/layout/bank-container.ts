import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BankHeaderContainer } from 'apps/tia-frontend/src/app/layout/ui/bank-header/container/bank-header-container';
import { Sidebar } from './ui/sidebar/container/sidebar';

@Component({
  selector: 'app-bank-container',
  imports: [Sidebar, RouterModule, BankHeaderContainer],
  templateUrl: './bank-container.html',
  styleUrl: './bank-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankContainer {}
