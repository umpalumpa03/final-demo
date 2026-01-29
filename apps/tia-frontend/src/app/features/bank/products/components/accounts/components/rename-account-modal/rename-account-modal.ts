import {
  Component,
  input,
  output,
  signal,
  ChangeDetectionStrategy,
  OnInit,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiModal } from '../../../../../../../shared/lib/overlay/ui-modal/ui-modal';
import { TextInput } from '../../../../../../../shared/lib/forms/input-field/text-input';
import { ButtonComponent } from '../../../../../../../shared/lib/primitives/button/button';

@Component({
  selector: 'app-rename-account-modal',
  imports: [CommonModule, FormsModule, UiModal, TextInput, ButtonComponent],
  templateUrl: './rename-account-modal.html',
  styleUrl: './rename-account-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenameAccountModalComponent implements OnInit {
  public isOpen = input.required<boolean>();
  public currentName = input.required<string>();
  public isLoading = input.required<boolean>();
  public error = input<string | null>(null);

  public closed = output<void>();
  public renamed = output<string>();

  protected newName = signal<string>('');

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.newName.set(this.currentName());
      }
    });
  }

  public ngOnInit(): void {
    if (this.isOpen()) {
      this.newName.set(this.currentName());
    }
  }

  public handleClose(): void {
    this.newName.set('');
    this.closed.emit();
  }

  public handleRename(): void {
    const trimmedName = this.newName().trim();
    if (trimmedName && trimmedName !== this.currentName()) {
      this.renamed.emit(trimmedName);
    }
  }

  public isRenameDisabled(): boolean {
    const trimmedName = this.newName().trim();
    return (
      this.isLoading() || !trimmedName || trimmedName === this.currentName()
    );
  }
}
