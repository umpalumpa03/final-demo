import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { PillItem } from '@tia/shared/lib/navigation/models/pills.model';
import { PillsNav } from "@tia/shared/lib/navigation/pills-nav/pills-nav";
import { PILLARRAY } from '../../config/tabs-data';

@Component({
  selector: 'app-pills-component',
  imports: [PillsNav],
  templateUrl: './pills-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PillsComponent {
  public readonly pillsData = signal<PillItem[]>(PILLARRAY);

  public readonly selectedPill = signal<PillItem | null>(null);

  public onPillSelected(pill: PillItem): void {
    this.selectedPill.set(pill);
  }

  // ეს არის საჩვენებელი მაგალითი თუ როგორ შეიძლება გამოიყენოთ 
  // PillsNav კომპონენტი ფილტრაციისთვის.

  // public readonly items = signal<Item[]>(ITEMS);

  // public readonly filteredItems = computed(() => {
  //   const pill = this.selectedPill();
  //   if (!pill || pill.id === 'all') {
  //     return this.items();
  //   }
  //   return this.items().filter(item => item.status === pill.id);
  // });

}
