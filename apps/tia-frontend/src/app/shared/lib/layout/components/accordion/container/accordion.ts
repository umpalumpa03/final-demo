import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  input,
} from '@angular/core';
import { AccordionItem } from '../accordion-item/accordion-item';

@Component({
  selector: 'app-accordion',
  imports: [],
  templateUrl: './accordion.html',
  styleUrl: './accordion.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Accordion {
  multi = input<boolean>(false);

  // Queries all child app-accordion-item components
  private items = contentChildren(AccordionItem);

  notifyOpen(openedItem: AccordionItem) {
    if (this.multi()) return;

    // Close every item except the one that just opened
    this.items().forEach((item) => {
      if (item !== openedItem) {
        item.isOpen.set(false);
      }
    });
  }
}
