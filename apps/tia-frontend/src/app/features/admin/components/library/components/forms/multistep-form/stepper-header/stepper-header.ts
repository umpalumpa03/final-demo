import { Component, computed, input, Input } from '@angular/core';
import { IStepConfig } from '../../models/contact-forms.model';

@Component({
  selector: 'app-stepper-header',
  imports: [],
  templateUrl: './stepper-header.html',
  styleUrl: './stepper-header.scss',
})
export class StepperHeader {
  public content = input.required<IStepConfig[]>();
  public step = input.required<number>();

  public isCompleted(index: number) {
    return index + 1 < this.step();
  }

  public isActive(index: number) {
    return index + 1 === this.step();
  }

  public isLineActive(index: number) {
    return index + 1 < this.step();
  }
}
