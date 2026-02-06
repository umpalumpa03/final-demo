import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Avatar } from '@tia/shared/lib/data-display/avatars/avatar';
import { Textarea } from '@tia/shared/lib/forms/textarea/textarea';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { BreakpointService } from 'apps/tia-frontend/src/app/core/services/breakpoints/breakpoint.service';

@Component({
  selector: 'app-reply-form',
  imports: [ReactiveFormsModule, Avatar, Textarea, ButtonComponent],
  templateUrl: './reply-form.html',
  styleUrl: './reply-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReplyForm {
  private readonly fb = new FormBuilder();
  public readonly sendReply = output<string>();
  public readonly cancel = output<void>();
  private readonly breakpointService = inject(BreakpointService);
  public readonly isExtraSmall = this.breakpointService.isExtraSmall;

  public readonly form = this.fb.group({
    body: ['', Validators.required],
  });

  public onSendReply(): void {
    if (this.form.valid) {
      this.sendReply.emit(this.form.value.body || '');
      this.form.reset();
    }
  }

  public onCancel(): void {
    this.form.reset();
    this.cancel.emit();
  }
}