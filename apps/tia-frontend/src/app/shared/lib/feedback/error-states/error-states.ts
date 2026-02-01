import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ErrorStateVariant } from "../models/error-state.model";

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
  public readonly width = input<string>('100%');
  public readonly height = input<string>('23.8rem');
  public readonly maxWidth = input<string>('32.8rem');
  public readonly border = input<boolean>(true);
  public readonly showButton = input<boolean>(true);
  public readonly isCentered = input<boolean>(true);

  public readonly buttonClick = output<void>();

  public readonly containerClass = computed(() => {
    const baseClass = 'error-container';
    return this.isCentered() ? `${baseClass} error-container--centered` : baseClass;
  })

  public readonly errorClass = computed(() => {
    const baseClass = `error-state error-state--${this.variant()}`;
    return this.border() ? baseClass : `${baseClass} error-state--no-border`;
  });

}
