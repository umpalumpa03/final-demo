import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { PillItem } from '@tia/shared/lib/navigation/models/pills.model';
import { PillsNav } from "@tia/shared/lib/navigation/pills-nav/pills-nav";
import { PILLARRAY } from '../../config/tabs-data';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pills-component',
  imports: [PillsNav],
  templateUrl: './pills-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PillsComponent implements OnInit {
  private translate = inject(TranslateService);

  public readonly pillsData = signal<PillItem[]>(PILLARRAY(this.translate));

  public readonly selectedPill = signal<PillItem | null>(null);

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.pillsData.set(PILLARRAY(this.translate));
    });
  }

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
