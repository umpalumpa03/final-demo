import { CurrencyPipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { debounceTime, distinctUntilChanged, startWith, tap } from 'rxjs';

@Component({
  selector: 'app-total-amount',
  imports: [TextInput, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './total-amount.html',
  styleUrl: './total-amount.scss',
})
export class TotalAmount implements OnInit {
  public selectedItemsLength = input<number>();
  private readonly destroyRef = inject(DestroyRef);
  public amountControl = new FormControl('');

  public calculatedDistribution = signal<number>(0);

  ngOnInit(): void {
    this.amountControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
        tap((value) => {
          if (value) {
            this.calculatedDistribution.set(
              +value / (this.selectedItemsLength() ?? 1),
            );
          } else {
            this.calculatedDistribution.set(0);
          }
        }),
      )
      .subscribe();
  }
}
