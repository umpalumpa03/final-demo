import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  ReactiveFormsModule,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith, tap } from 'rxjs';
import { PaybillMainFacade } from '../services/paybill-main-facade';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-paybill-main',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, RouterModule],
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
}
