import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Separator } from '@tia/shared/lib/layout/components/separator/separator';
import { Accordion } from '@tia/shared/lib/layout/components/accordion/container/accordion';
import { AccordionItem } from '@tia/shared/lib/layout/components/accordion/accordion-item/accordion-item';
import { LibraryTitle } from '../../../shared/library-title/library-title';
import { ShowcaseCard } from '../../../shared/showcase-card/showcase-card';
import { accordionContent, multiAccordionContent } from './layout.config';

@Component({
  selector: 'app-layout',
  imports: [Separator, Accordion, AccordionItem, LibraryTitle, ShowcaseCard],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout {
  accordionContent = accordionContent;
  multiAccordionContent = multiAccordionContent;
}
