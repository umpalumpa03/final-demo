import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { PaybillTemplates } from '../components/paybill-templates';
import { PaybillTemplatesService } from '../services/paybill-templates-service';
import { Store } from '@ngrx/store';
import {
  selectActiveProvider,
  selectCategories,
  selectProviders,
  selectTemplatesAsTreeItems,
  selectTemplatesGroupWithConfigs,
} from '../../../store/paybill.selectors';
import {
  PaybillActions,
  TemplatesPageActions,
} from '../../../store/paybill.actions';
import {
  FormSubmitPayload,
  HeaderCtaAction,
  ModalType,
} from '../models/paybill-templates.model';
import { ModalConfig } from '../configs/cta-buttons.config';
import { NgPlural } from '@angular/common';

@Component({
  selector: 'app-paybill-templates-container',
  imports: [PaybillTemplates],
  templateUrl: './paybill-templates-container.html',
  styleUrl: './paybill-templates-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaybillTemplatesContainer implements OnInit {
  public paybillTemplatesService = inject(PaybillTemplatesService);
  public store = inject(Store);

  ngOnInit(): void {
    this.store.dispatch(TemplatesPageActions.loadTemplateGroups());
    this.store.dispatch(TemplatesPageActions.loadTemplates());
  }

  public readonly templateGroups = this.store.selectSignal(
    selectTemplatesGroupWithConfigs,
  );

  public readonly templates = this.store.selectSignal(
    selectTemplatesAsTreeItems,
  );

  // Handles to determine what is modals type based on clicks in header
  public handleHeaderAction(action: HeaderCtaAction): void {
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

  // Select Template Categories
  public templateCategories = this.store.selectSignal(selectCategories);
  public templateProviders = this.store.selectSignal(selectProviders);

  // Mapped values to be compatible with <lib-select></lib-select> component
  categoryOptions = computed(() => {
    return this.templateCategories().map((category) => ({
      label: category.name,
      value: category.id,
    }));
  });

  onCategorySelected(categoryId: string) {
    this.store.dispatch(PaybillActions.selectCategory({ categoryId }));
  }

  // Handle what type of modal's config should be sent
  protected readonly modalConfig = ModalConfig;
  public modalType = signal<ModalType | null>(null);

  protected currentModalConfig = computed(() => {
    const modal = this.modalType();
    return modal ? this.modalConfig[modal] : null;
  });

  public handleFormSubmit(payload: FormSubmitPayload) {
    switch (payload.type) {
      case 'create-group':
        this.store.dispatch(
          TemplatesPageActions.createTemplatesGroups({
            groupName: payload.values['name'],
            templateIds: [],
          }),
        );
    }
  }

  public selectedItemName = signal<string>('');
  public selectedId = signal<string | null>(null);
  onItemDeleteAction(id: string) {
    const template = this.templates().find((t) => t.id === id);
    this.selectedItemName.set(template?.title ?? '');
    this.modalType.set(ModalType.DeleteTemplate);
    this.selectedId.set(id);
    this.handleModalToggle();
  }

  deleteTemplate() {
    const id = this.selectedId();
    if (id) {
      this.store.dispatch(
        TemplatesPageActions.deleteTemplates({ templateId: id }),
      );

      this.handleModalToggle();
    }
  }
}
