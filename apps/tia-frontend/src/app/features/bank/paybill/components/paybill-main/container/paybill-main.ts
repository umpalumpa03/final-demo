import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { CategoryGrid } from '../components/category-grid/category-grid';
import { ProviderList } from '../components/provider-list/provider-list';
import { PaybillForm } from '../components/paybill-form/paybill-form';
import { PaybillOtpVerification } from '../components/paybill-otp-verification/paybill-otp-verification';
import {
  PaybillFormProceedEvent,
  PaybillFormVerifyEvent,
} from '../shared/models/paybill.model';
import { PaybillConfirmPayment } from '../components/paybill-confirm-payment/paybill-confirm-payment';
import { PaybillSuccess } from '../components/paybill-success/paybill-success';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  ReactiveFormsModule,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith, tap } from 'rxjs';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { PaybillMainFacade } from '../services/paybill-main-facade';

@Component({
  selector: 'app-paybill-main',
  imports: [
    CategoryGrid,
    ProviderList,
    PaybillForm,
    PaybillOtpVerification,
    PaybillConfirmPayment,
    PaybillSuccess,
    TextInput,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
  ],
  templateUrl: './paybill-main.html',
  styleUrl: './paybill-main.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaybillMain implements OnInit {
  public readonly facade = inject(PaybillMainFacade);
  private readonly destroyRef = inject(DestroyRef);

  public readonly searchControl = new FormControl('');

  public ngOnInit(): void {
    this.facade.init();

    this.searchControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
        tap((val) => this.facade.setSearchQuery(val || '')),
      )
      .subscribe();
  }

  public onFinalConfirm(): void {
    this.facade.confirmPayment();
  }

  public onBackToDetails(): void {
    this.facade.backToDetails();
  }

  public onOtpVerified(otpCode: string): void {
    this.facade.verifyOtp(otpCode);
  }

  public onResetFlow(): void {
    this.facade.resetFlow();
  }

  public onGoDashboard(): void {
    this.facade.resetToDashboard();
  }

  public onProviderListBack(): void {
    this.facade.navigateBack();
  }

  public onProviderSelected(providerId: string): void {
    const category = this.facade.activeCategory();
    if (!category?.providers) return;

    const provider = category.providers.find((p) => p.id === providerId);
    if (!provider) return;

    if (provider.isFinal) {
      this.facade.selectProvider(providerId);
    } else {
      this.facade.selectParentId(provider.id);
    }
  }

  public onVerifyAccount(data: PaybillFormVerifyEvent): void {
    this.facade.verifyAccount(data.value);
  }

  public onProceedToPayment(data: PaybillFormProceedEvent): void {
    this.facade.proceedToPayment(data.amount, data.value);
  }
}
