import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PaybillTemplates } from '../components/paybill-templates';
import { PaybillTemplatesService } from '../services/paybill-templates-service';
import { Store } from '@ngrx/store';
import { selectTemplatesGroup } from '../../../store/paybill.selectors';
import { TemplatesPageActions } from '../../../store/paybill.actions';
import { HeaderCtaAction, ModalType } from '../models/paybill-templates.model';
import { ModalConfig } from '../configs/cta-buttons.config';

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

  // Handles to determine what is modals type based on clicks in header
  public handleHeaderAction(action: HeaderCtaAction) {
    if (action === 'createTemplate') {
      this.modalType.set(ModalType.Template);
      this.handleModalToggle();
    }

    if (action === 'createGroup') {
      this.modalType.set(ModalType.Group);
      this.handleModalToggle();
    }
  }

  // Handle Modal Open / Close Action
  public isModalOpen = signal<boolean>(false);

  public handleModalToggle(): void {
    this.isModalOpen.update((val) => !val);
  }

  // Handle what type of modal's config should be sent
  protected readonly modalConfig = ModalConfig;
  public modalType = signal<ModalType | null>(null);

  protected currentModalConfig = computed(() => {
    const modal = this.modalType();
    return modal ? this.modalConfig[modal] : null;
  });
}
