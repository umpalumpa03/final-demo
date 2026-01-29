import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-paybill-otp-verification',
  imports: [],
  templateUrl: './paybill-otp-verification.html',
  styleUrl: './paybill-otp-verification.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class PaybillOtpVerification {
  public readonly summary = input.required<any>();
  public readonly verify = output<string>();
  public readonly cancelPayment = output<void>();

  
}
