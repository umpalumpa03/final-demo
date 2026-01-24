import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Separator } from '@tia/shared/lib/layout/components/separator/separator';
import { Accordion } from '@tia/shared/lib/layout/components/accordion/container/accordion';
import { AccordionItem } from '@tia/shared/lib/layout/components/accordion/accordion-item/accordion-item';
import { LibraryTitle } from '../../../shared/library-title/library-title';
import { ShowcaseCard } from '../../../shared/showcase-card/showcase-card';
import {
  accordionContent,
  collapsibleConfig,
  flexLayoutConfig,
  multiAccordionContent,
  scrollAreaContent,
  scrollAreaContent2,
} from '../config/layout.config';
import { Collapsible } from '@tia/shared/lib/layout/components/collapsible/collapsible';
import { ScrollArea } from '@tia/shared/lib/layout/components/scroll-area/container/scroll-area';
import { ResizableHorizontal } from '@tia/shared/lib/layout/components/resizable-panels/resizable-horizontal/resizable-horizontal';
import { GridLayout } from '@tia/shared/lib/layout/components/grid-layout/container/grid-layout';
import { FlexLayout } from '@tia/shared/lib/layout/components/flex-layout/container/flex-layout';

@Component({
  selector: 'app-layout',
  imports: [
    Separator,
    Accordion,
    AccordionItem,
    LibraryTitle,
    ShowcaseCard,
    Collapsible,
    ScrollArea,
    ResizableHorizontal,
    GridLayout,
    FlexLayout,
  ],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout {
  public readonly accordionContent = signal(accordionContent);
  public readonly multiAccordionContent = signal(multiAccordionContent);
  public readonly collapsibleData = signal(collapsibleConfig);
  public readonly scrollAreaContent = signal(scrollAreaContent);
  public readonly scrollAreaContent2 = signal(scrollAreaContent2);
  public readonly flexLayoutConfig = signal(flexLayoutConfig);
}
