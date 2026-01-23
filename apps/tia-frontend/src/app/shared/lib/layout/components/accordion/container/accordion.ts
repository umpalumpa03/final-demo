import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  forwardRef,
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
  public multi = input<boolean>(false);

  private items = contentChildren(forwardRef(() => AccordionItem));

  notifyOpen(openedItem: AccordionItem): void {
    if (this.multi()) return;

    this.items().forEach((item) => {
      if (item !== openedItem) {
        item.isOpen.set(false);
      }
    });
  }
}
