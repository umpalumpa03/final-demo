import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-loans-container',
  imports: [],
  templateUrl: './loans-container.html',
  styleUrl: './loans-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoansContainer {}
