import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { selectSelectedTemplates } from '../../../../../store/paybill.selectors';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';

@Component({
  selector: 'app-selected-items',
  imports: [ButtonComponent],
  templateUrl: './selected-items.html',
  styleUrl: './selected-items.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectedItems {
  private readonly store = inject(Store);
  public selectedItems = this.store.selectSignal(selectSelectedTemplates);
  public paySelectedClick = output<void>();
  public forModal = input<boolean>();

  public onPaySelectedClick(): void {
    this.paySelectedClick.emit();
  }
}
