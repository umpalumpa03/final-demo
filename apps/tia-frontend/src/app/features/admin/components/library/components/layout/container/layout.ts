import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Separator } from '@tia/shared/lib/layout/components/separator/separator';
import { Accordion } from '@tia/shared/lib/layout/components/accordion/container/accordion';
import { AccordionItem } from '@tia/shared/lib/layout/components/accordion/accordion-item/accordion-item';
import { LibraryTitle } from "../../../shared/library-title/library-title";
import { ShowcaseCard } from "../../../shared/showcase-card/showcase-card";

@Component({
  selector: 'app-layout',
  imports: [Separator, Accordion, AccordionItem, LibraryTitle, ShowcaseCard],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout {

  color = "#0EA5E9";
  
  accordionContent = [
    { id: '1', title: 'What is this component library?', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus voluptatum dolor cumque, quaerat magnam eveniet quisquam sint eaque itaque ex?'},
    { id: '2', title: 'How do I use these components?', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus voluptatum dolor cumque, quaerat magnam eveniet quisquam sint eaque itaque ex?'},
    { id: '3', title: 'Are these components accessible?', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus voluptatum dolor cumque, quaerat magnam eveniet quisquam sint eaque itaque ex?'},
    { id: '4', title: 'Can I customize the styling?', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus voluptatum dolor cumque, quaerat magnam eveniet quisquam sint eaque itaque ex?'},
    { id: '5', title: 'Can I customize the styling?', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus voluptatum dolor cumque, quaerat magnam eveniet quisquam sint eaque itaque ex?'},
  ]

  multiAccordionContent = [
    { id: '1', title: 'Features', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus voluptatum dolor cumque, quaerat magnam eveniet quisquam sint eaque itaque ex?'},
    { id: '2', title: 'Installation', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus voluptatum dolor cumque, quaerat magnam eveniet quisquam sint eaque itaque ex?'},
    { id: '3', title: 'Documentation', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus voluptatum dolor cumque, quaerat magnam eveniet quisquam sint eaque itaque ex?'},
  ]
}
