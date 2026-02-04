import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CategoryGrid } from '../components/category-items/category-grid';
import { PaybillMainFacade } from '../../../services/paybill-main-facade';

@Component({
  selector: 'app-category-grid-container',
  imports: [CategoryGrid],
  templateUrl: './category-grid-container.html',
  styleUrl: './category-grid-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryGridContainer {
  protected readonly facade = inject(PaybillMainFacade);
}
