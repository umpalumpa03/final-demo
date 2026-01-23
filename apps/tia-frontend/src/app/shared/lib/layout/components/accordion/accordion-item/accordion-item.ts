import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
} from '@angular/core';
import { Accordion } from '../container/accordion';

@Component({
  selector: 'app-accordion-item',
  imports: [],
  templateUrl: './accordion-item.html',
  styleUrl: './accordion-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionItem {
  private accordion = inject(Accordion, { optional: true });

  public title = input.required<string>();

  public isOpen = model<boolean>(false);

  toggle(): void {
    const nextState = !this.isOpen();
    this.isOpen.set(nextState);

    if (nextState && this.accordion) {
      this.accordion.notifyOpen(this);
    }
  }
}
