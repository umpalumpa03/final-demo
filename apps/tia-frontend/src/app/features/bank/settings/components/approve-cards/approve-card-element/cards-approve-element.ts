import { Component, input, output } from '@angular/core';
import { APPROVE_CARD_BUTTONS } from '../config/approve-card-element.config';
import { ActionButton, buttonEmit, CardAction } from '../shared/model/approve-card-element.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cards-approve-element',
  imports: [DatePipe],
  templateUrl: './cards-approve-element.html',
  styleUrl: './cards-approve-element.scss',
})
export class CardsApproveElement {
  public readonly id = input.required<string>();
  public readonly title = input<string>('');
  public readonly status = input<string>('pending');
  public readonly email = input<string>('');
  public readonly network = input<string>('');
  public readonly balance = input<string>('');
  public readonly creationDate = input<string>('');
  public readonly marked = input<boolean>(false);

  public readonly buttons:ActionButton[] = APPROVE_CARD_BUTTONS;
  
  public cardAction = output<buttonEmit>();
  
  public onAction(action: CardAction): void {
    this.cardAction.emit({ action, id: this.id() });
  }
}
