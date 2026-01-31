import { Component, inject, OnInit } from '@angular/core';
import { PaybillTemplates } from '../components/paybill-templates';
import { PaybillTemplatesService } from '../services/paybill-templates-service';
import { Store } from '@ngrx/store';
import { selectTemplatesGroup } from '../../../store/paybill.selectors';
import { TemplatesPageActions } from '../../../store/paybill.actions';

@Component({
  selector: 'app-paybill-templates-container',
  imports: [PaybillTemplates],
  templateUrl: './paybill-templates-container.html',
  styleUrl: './paybill-templates-container.scss',
})
export class PaybillTemplatesContainer implements OnInit {
  public paybillTemplatesService = inject(PaybillTemplatesService);
  public store = inject(Store);

  ngOnInit(): void {
    // this.store.dispatch(TemplatesPageActions.loadTemplates());
  }

  public readonly templateGroups =
    this.store.selectSignal(selectTemplatesGroup);
}
