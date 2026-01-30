import { Component, input, output } from '@angular/core';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';

@Component({
  selector: 'app-create-card',
  imports: [UiModal],
  templateUrl: './createCard.html',
  styleUrl: './createCard.scss',
})
export class CreateCard {
 isOpen = input.required<boolean>();
  closed = output<void>();

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.onClose();
  }

  protected onClose(): void {
    this.closed.emit();
  }
}
