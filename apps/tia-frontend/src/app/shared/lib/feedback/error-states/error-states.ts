import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import { ErrorStateVariant } from "@tia/shared/lib/feedback/models/error-state.model";

@Component({
  selector: 'app-error-states',
  imports: [],
  templateUrl: './error-states.html',
  styleUrl: './error-states.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorStates {
  public readonly variant = input<ErrorStateVariant>('failed');
  public readonly header = input<string>('Failed');
  public readonly message = input<string>('Failed');
  public readonly buttonMessage = input<string>('Retry');
  public readonly width = input<string>('32rem');
  public readonly height = input<string>('23.8rem');

  public readonly errorClass = computed(() => `error-state error-state--${this.variant()}`);
}
