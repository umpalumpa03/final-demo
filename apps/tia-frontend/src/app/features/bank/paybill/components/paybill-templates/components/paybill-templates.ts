import { Component, computed, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TreeContainer } from '@tia/shared/lib/drag-n-drop/components/tree-container/tree-container';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { LibraryTitle } from 'apps/tia-frontend/src/app/features/storybook/shared/library-title/library-title';
import { HeaderCtaConfig, ModalConfig } from '../configs/cta-buttons.config';
import {
  HeaderCtaAction,
  ModalInfo,
  ModalType,
} from '../models/paybill-templates.model';
import { Dropdowns } from '@tia/shared/lib/forms/dropdowns/dropdowns';

@Component({
  selector: 'app-paybill-templates',
  imports: [
    TreeContainer,
    TranslatePipe,
    ButtonComponent,
    UiModal,
    TextInput,
    LibraryTitle,
    Dropdowns,
  ],
  templateUrl: './paybill-templates.html',
  styleUrl: './paybill-templates.scss',
})
export class PaybillTemplates {
  public templateGroups = input();
  public headerButtons = HeaderCtaConfig;

  public currentModalConfig = input<ModalInfo | null>(null);

  // FIXED DATA SHOULD COME FROM BACKEND
  treeGroups = [
    { id: 'g1', title: 'Group 1', subtitle: 'First group', expanded: true },
    { id: 'g2', title: 'Group 2', subtitle: 'Second group', expanded: true },
    { id: 'g3', title: 'Group 3', subtitle: 'Third group', expanded: false },
  ];

  treeItems = [
    {
      id: 'c1',
      title: 'Child 1',
      subtitle: 'Drag to reorder',
      groupId: 'g1',
      order: 0,
    },
    {
      id: 'c2',
      title: 'Child 2',
      subtitle: 'Drag to reorder',
      groupId: 'g1',
      order: 1,
    },
    {
      id: 'c3',
      title: 'Child 3',
      subtitle: 'Drag to reorder',
      groupId: 'g1',
      order: 2,
    },
    {
      id: 'c4',
      title: 'Child 4',
      subtitle: 'Drag to reorder',
      groupId: 'g2',
      order: 0,
    },
    {
      id: 'c5',
      title: 'Child 5',
      subtitle: 'Drag to reorder',
      groupId: 'g2',
      order: 1,
    },
    {
      id: 'c6',
      title: 'Child 6',
      subtitle: 'Drag to reorder',
      groupId: 'g3',
      order: 0,
    },
  ];

  // Determine Which type of modal to be shown
  public activeModal = input<ModalType | null>();

  // Handle Modal Open / Close actions
  public isModalOpen = input<boolean>(false);

  // Handle Header Button Clicks
  public headerButtonAction = output<HeaderCtaAction>();
  public modalOpenAction = output<void>();

  public handleHeaderButtonClick(action: HeaderCtaAction) {
    this.headerButtonAction.emit(action);
  }

  public toggleModal() {
    this.modalOpenAction.emit();
  }
}
