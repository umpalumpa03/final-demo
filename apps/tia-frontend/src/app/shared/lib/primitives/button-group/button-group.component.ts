import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonGroupItem } from './button-group.models/button-group.models';

@Component({
  selector: 'app-button-group',
  imports: [RouterModule],
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonGroupComponent {
  public readonly items = input<ButtonGroupItem[]>([]);
  public readonly count = input<number>(0);
  public readonly labels = input<string[]>([]);

  protected readonly activeIndex = signal<number>(0);
  public readonly selectionChange = output<number>();

  protected readonly finalButtons = computed(() => {
    const configItems = this.items();
    const currentActive = this.activeIndex();
    
    let baseButtons: ButtonGroupItem[] = [];

    if (configItems.length > 0) {
      baseButtons = configItems;
    } else {
      const total = this.count() || this.labels().length || 3;
      const providedLabels = this.labels();
      baseButtons = Array.from({ length: total }, (_, i) => ({
        label: providedLabels[i] ?? `Option ${i + 1}`
      }));
    }

    return baseButtons.map((btn, index) => ({
      ...btn,
      isActive: index === currentActive
    }));
  });

  public onSelect(index: number): void {
    if (this.activeIndex() === index) return;
    
    this.activeIndex.set(index);
    this.selectionChange.emit(index);

    const selectedItem = this.finalButtons()[index];
    if (selectedItem?.action) {
      selectedItem.action();
    }
  }
}