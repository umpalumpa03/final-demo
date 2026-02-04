import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { PaybillSuccess } from '../components/paybill-success/paybill-success';
import { PaybillMainFacade } from '../../../services/paybill-main-facade';

@Component({
  selector: 'app-paybill-success-container',
  imports: [PaybillSuccess],
  templateUrl: './paybill-success-container.html',
  styleUrl: './paybill-success-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaybillSuccessContainer implements OnInit {
  protected readonly facade = inject(PaybillMainFacade);

  ngOnInit(): void {
    if (!this.facade.paymentPayload()) {
      this.facade.resetFlow();
    }
  }

  public onPayAnother(): void {
    this.facade.resetFlow();
  }

  public onGoDashboard(): void {
    this.facade.resetToDashboard();
  }
}
