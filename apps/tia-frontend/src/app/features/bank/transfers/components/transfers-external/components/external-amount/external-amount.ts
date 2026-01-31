import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { TransfersApiService } from '../../../../services/transfersApi.service';

@Component({
  selector: 'app-external-amount',
  imports: [],
  templateUrl: './external-amount.html',
  styleUrl: './external-amount.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalAmount implements OnInit {
  private readonly transfersApi = inject(TransfersApiService);

  //test code
  ngOnInit(): void {
    const testAccountId = 'a1000001-0001-4000-8000-000000000001';
    const testAmount = 100;

    this.transfersApi.getFee(testAccountId, testAmount).subscribe({
      next: (response) => {
        // console.log('Fee response:', response);
      },
      error: (error) => {
        // console.error('Fee error:', error);
      },
    });
  }
}
