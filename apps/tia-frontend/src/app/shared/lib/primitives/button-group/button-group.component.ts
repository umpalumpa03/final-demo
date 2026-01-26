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

  // Add functions for button-groups
  protected readonly finalButtons = computed((): ButtonGroupItem[] => {
    const configItems = this.items();
    
    if (configItems.length > 0) return configItems;

    const total = this.count() || this.labels().length || 3;
    const providedLabels = this.labels();
    
    return Array.from({ length: total }, (_, i) => ({
      label: providedLabels[i] ?? `Option ${i + 1}`
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