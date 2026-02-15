import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith, tap } from 'rxjs';
import { PaybillMainFacade } from '../services/paybill-main-facade';
import { RouterModule } from '@angular/router';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { paybillSearchConfig } from '../../../config/paybill.config';
import { BackNavigation } from '../shared/ui/back-navigation/back-navigation';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-paybill-main',
  imports: [ReactiveFormsModule, RouterModule, TextInput, BackNavigation],
  templateUrl: './paybill-main.html',
  styleUrl: './paybill-main.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaybillMain implements OnInit, OnDestroy {
  public readonly facade = inject(PaybillMainFacade);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);
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

  public ngOnDestroy(): void {
    this.facade.clearRepeatTransaction();
  }

  public readonly searchInputConfig = paybillSearchConfig;

  public readonly translatedSearchConfig = computed(() => ({
    ...paybillSearchConfig,
    placeholder: this.translate.instant(paybillSearchConfig.placeholder),
  }));
}
