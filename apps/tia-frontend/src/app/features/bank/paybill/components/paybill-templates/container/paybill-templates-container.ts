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

  // protected currentModalConfig = computed(() => {
  //   const modal = this.modalType();
  //   return modal ? this.modalConfig[modal] : null;
  // });

  protected currentModalConfig = computed(() => {
    const modal = this.modalType();
    if (!modal) return null;

    const baseConfig = this.modalConfig[modal];

    if (modal === ModalType.RenameGroup || modal === ModalType.RenameTemplate) {
      return {
        ...baseConfig,
        initialValues: {
          currentName: this.selectedItemName(),
        },
      };
    }

    return baseConfig;
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
        break;
      case 'rename-template':
        const templateId = this.selectedId();
        if (templateId) {
          this.store.dispatch(
            TemplatesPageActions.renameTemplate({
              templateId,
              nickName: payload.values['name'],
            }),
          );
        }
        break;
    }
  }

  public selectedItemName = signal<string>('');
  public selectedId = signal<string>('');

  private withSelectedId(action: (id: string) => void) {
    const id = this.selectedId();
    if (!id) return;

    action(id);
    this.handleModalToggle();
  }

  // This will select active template
  private selectTemplate(id: string) {
    const template = this.templates().find((t) => t.id === id);

    this.selectedId.set(id);
    this.selectedItemName.set(template?.title ?? '');
  }

  private selectGroup(id: string) {
    const group = this.templateGroups().find((t) => t.id === id);

    this.selectedId.set(id);
    this.selectedItemName.set(group?.groupName ?? '');
  }

  // This will open the modal
  private openTemplateModal(id: string, type: ModalType) {
    this.selectTemplate(id);
    this.modalType.set(type);
    this.handleModalToggle();
  }

  private openGroupModal(id: string, type: ModalType) {
    this.selectGroup(id);
    this.modalType.set(type);
    this.handleModalToggle();
  }

  // Modal Openers
  onItemEditAction(id: string) {
    this.openTemplateModal(id, ModalType.RenameTemplate);
  }

  onItemDeleteAction(id: string) {
    this.openTemplateModal(id, ModalType.DeleteTemplate);
  }

  onGroupDeleteAction(id: string) {
    this.openGroupModal(id, ModalType.DeleteGroup);
  }

  // Actual delete / edit logic
  deleteTemplate() {
    this.withSelectedId((id) =>
      this.store.dispatch(
        TemplatesPageActions.deleteTemplate({ templateId: id }),
      ),
    );
  }

  deleteGroup() {
    this.withSelectedId((id) =>
      this.store.dispatch(
        TemplatesPageActions.deleteTemplateGroup({ groupId: id }),
      ),
    );
  }
}
