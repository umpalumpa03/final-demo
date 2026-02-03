import { Injectable, signal } from '@angular/core';
import { IModalState } from '../models/users.model';

@Injectable()
export class UserModalService {
  readonly modalState = signal<IModalState>('none');
  readonly userToDeleteId = signal<string | null>(null);

  public openDetails(): void {
    this.modalState.set('details');
  }

  public openDelete(userId: string): void {
    this.userToDeleteId.set(userId);
    this.modalState.set('delete');
  }

  public close(): void {
    this.modalState.set('none');
    this.userToDeleteId.set(null);
  }

  get isDetailsOpen(): boolean {
    return this.modalState() === 'details';
  }

  get isDeleteOpen(): boolean {
    return this.modalState() === 'delete';
  }
}
