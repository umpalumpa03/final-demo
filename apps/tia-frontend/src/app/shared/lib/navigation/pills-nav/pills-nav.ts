import { ChangeDetectionStrategy, Component, input, OnInit, output, signal } from '@angular/core';
import { PillItem } from '../models/pills.model';

@Component({
  selector: 'app-pills-nav',
  templateUrl: './pills-nav.html',
  styleUrl: './pills-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PillsNav implements OnInit {
  public readonly pills = input.required<PillItem[]>();
  public readonly initialSelectedId = input<string>('');
  public readonly pillSelected = output<PillItem>();
  public readonly selectedPillId = signal<string>('');

  ngOnInit() {
    const initial = this.initialSelectedId();
    if (initial) {
      this.selectedPillId.set(initial);
    } else if (this.pills().length > 0) {
      this.selectedPillId.set(this.pills()[0].id);
    }
  }

  public selectPill(pill: PillItem): void {
    this.selectedPillId.set(pill.id);
    this.pillSelected.emit(pill);
  }

  public isSelected(pillId: string): boolean {
    return this.selectedPillId() === pillId;
  }

  public trackByPillId(index: number, pill: PillItem): string {
    return pill.id;
  }
}
