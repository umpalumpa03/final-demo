import { Component, inject, input, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TreeContainer } from '@tia/shared/lib/drag-n-drop/components/tree-container/tree-container';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { ctaButtonConfig } from '../configs/cta-buttons.config';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';

@Component({
  selector: 'app-paybill-templates',
  imports: [TreeContainer, TranslatePipe, ButtonComponent, UiModal],
  templateUrl: './paybill-templates.html',
  styleUrl: './paybill-templates.scss',
})
export class PaybillTemplates {
  private readonly translate = inject(TranslateService);
  public templateGroups = input();
  public headerButtons = ctaButtonConfig(this.translate);

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

  public isModalOpen = signal<boolean>(false);

  public modalHandler(action: string): void {
    if (action === 'select') {
      return;
    }

    if (action === 'template') {
    }
    this.isModalOpen.update((val) => !val);
  }
}
