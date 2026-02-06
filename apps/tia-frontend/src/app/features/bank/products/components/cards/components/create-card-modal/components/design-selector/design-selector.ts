import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CardDesign } from 'apps/tia-frontend/src/app/features/bank/products/components/cards/models/card-design.model';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';

@Component({
  selector: 'app-design-selector',
  templateUrl: './design-selector.html',
  styleUrls: ['./design-selector.scss'],
  imports: [Skeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesignSelector {
  readonly designs = input.required<CardDesign[]>();
  readonly selectedDesign = input.required<string>();
  readonly isLoading = input.required<boolean>();

  readonly designSelected = output<string>();

  protected onSelectDesign(designId: string): void {
    this.designSelected.emit(designId);
  }
}
