import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Separator } from '@tia/shared/lib/layout/components/separator/separator';
import { Accordion } from '@tia/shared/lib/layout/components/accordion/container/accordion';
import { AccordionItem } from '@tia/shared/lib/layout/components/accordion/accordion-item/accordion-item';

@Component({
  selector: 'app-layout',
  imports: [Separator, Accordion, AccordionItem],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout {}
