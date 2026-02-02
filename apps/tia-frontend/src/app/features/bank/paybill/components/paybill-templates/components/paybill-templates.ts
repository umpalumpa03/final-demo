import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  output,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TreeContainer } from '@tia/shared/lib/drag-n-drop/components/tree-container/tree-container';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { LibraryTitle } from 'apps/tia-frontend/src/app/features/storybook/shared/library-title/library-title';
import { HeaderCtaConfig } from '../configs/cta-buttons.config';
import {
  HeaderCtaAction,
  ModalInfo,
  ModalType,
  TemplateGroups,
} from '../models/paybill-templates.model';
import { Dropdowns } from '@tia/shared/lib/forms/dropdowns/dropdowns';
import { TreeItem } from '@tia/shared/lib/drag-n-drop/model/drag.model';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaybillTemplates {
  public templateGroups = input.required<TemplateGroups[]>();
  public templates = input.required<TreeItem[]>();
  public headerButtons = HeaderCtaConfig;

  public currentModalConfig = input<ModalInfo | null>(null);

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
