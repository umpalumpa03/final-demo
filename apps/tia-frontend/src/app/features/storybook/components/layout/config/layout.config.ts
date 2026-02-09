import { ResizableOrientation } from '@tia/shared/lib/layout/components/resizable-panels/resizable-panels.model';
import { FlexLayoutVariant } from '@tia/shared/lib/layout/components/flex-layout/flex-layout.model';
import { GridColumns } from '@tia/shared/lib/layout/components/grid-layout/container/grid-layout.model';

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

export interface CollapsibleItem {
  id: number;
  title: string;
  content: string;
  isOpenDefault?: boolean;
}

export interface ScrollAreaItem {
  id: number;
  content: string;
}

export interface ScrollAreaCardItem {
  id: number;
  title: string;
}

export interface FlexWrapItem {
  id: number;
  title: string;
}

export interface FlexLayoutItem {
  id: number;
  label: string;
}

export interface FlexLayoutConfig {
  id: number;
  title: string;
  variant: FlexLayoutVariant | undefined;
  wrap: boolean;
  items: FlexLayoutItem[];
}

export interface GridLayoutItem {
  id: number;
  label: string;
}

export interface GridLayoutConfig {
  id: number;
  title: string;
  cols: GridColumns;
  items: GridLayoutItem[];
}

export interface ResizablePanelItem {
  id: number;
  label: string;
}

export interface ResizablePanelConfig {
  id: number;
  title: string;
  orientation: ResizableOrientation;
  panelSize: 2 | 3;
  panels: ResizablePanelItem[];
}


export const accordionContent: AccordionItem[] = [
  {
    id: '1',
    title: 'storybook.layout.accordionContent.0.title',
    content: 'storybook.layout.accordionContent.0.content',
  },
  {
    id: '2',
    title: 'storybook.layout.accordionContent.1.title',
    content: 'storybook.layout.accordionContent.1.content',
  },
  {
    id: '3',
    title: 'storybook.layout.accordionContent.2.title',
    content: 'storybook.layout.accordionContent.2.content',
  },
  {
    id: '4',
    title: 'storybook.layout.accordionContent.3.title',
    content: 'storybook.layout.accordionContent.3.content',
  },
  {
    id: '5',
    title: 'storybook.layout.accordionContent.4.title',
    content: 'storybook.layout.accordionContent.4.content',
  },
] as const;

export const multiAccordionContent: AccordionItem[] = [
  {
    id: '1',
    title: 'storybook.layout.multiAccordionContent.0.title',
    content: 'storybook.layout.multiAccordionContent.0.content',
  },
  {
    id: '2',
    title: 'storybook.layout.multiAccordionContent.1.title',
    content: 'storybook.layout.multiAccordionContent.1.content',
  },
  {
    id: '3',
    title: 'storybook.layout.multiAccordionContent.2.title',
    content: 'storybook.layout.multiAccordionContent.2.content',
  },
] as const;

export const collapsibleConfig: CollapsibleItem[] = [
  {
    id: 1,
    title: 'storybook.layout.collapsibleContent.0.title',
    content:
      'storybook.layout.collapsibleContent.0.content',
  },
  {
    id: 2,
    title: 'storybook.layout.collapsibleContent.1.title',
    isOpenDefault: true,
    content:
      'storybook.layout.collapsibleContent.1.content',
  },
] as const;

export const scrollAreaContent: ScrollAreaItem[] = [
  {
    id: 1,
    content: 'storybook.layout.scrollAreaContent.0.content',
  },
  {
    id: 2,
    content: 'storybook.layout.scrollAreaContent.1.content',
  },
  {
    id: 3,
    content: 'storybook.layout.scrollAreaContent.2.content',
  },
  {
    id: 4,
    content: 'storybook.layout.scrollAreaContent.3.content',
  },
  {
    id: 5,
    content: 'storybook.layout.scrollAreaContent.4.content',
  },
  {
    id: 6,
    content: 'storybook.layout.scrollAreaContent.5.content',
  },
] as const;

export const scrollAreaContent2: ScrollAreaCardItem[] = [
  {
    id: 1,
    title: 'storybook.layout.scrollAreaContent2.0.title',
  },
  {
    id: 2,
    title: 'storybook.layout.scrollAreaContent2.1.title',
  },
  {
    id: 3,
    title: 'storybook.layout.scrollAreaContent2.2.title',
  },
  {
    id: 4,
    title: 'storybook.layout.scrollAreaContent2.3.title',
  },
  {
    id: 5,
    title: 'storybook.layout.scrollAreaContent2.4.title',
  },
  {
    id: 6,
    title: 'storybook.layout.scrollAreaContent2.5.title',
  },
] as const;

export const flexWrapContent: FlexWrapItem[] = [
  { id: 1, title: 'Item 1' },
  { id: 2, title: 'Item 2' },
  { id: 3, title: 'Item 3' },
  { id: 4, title: 'Item 4' },
  { id: 5, title: 'Item 5' },
  { id: 6, title: 'Item 6' },
  { id: 7, title: 'Item 7' },
  { id: 8, title: 'Item 8' },
  { id: 9, title: 'Item 9' },
  { id: 10, title: 'Item 10' },
] as const;

export const flexLayoutConfig: FlexLayoutConfig[] = [
  {
    id: 1,
    title: 'storybook.layout.flex.0.title',
    variant: 'space-between',
    wrap: false,
    items: [
      { id: 1, label: 'storybook.layout.flex.0.items.0.label' },
      { id: 2, label: 'storybook.layout.flex.0.items.1.label' },
      { id: 3, label: 'storybook.layout.flex.0.items.2.label' },
    ],
  },
  {
    id: 2,
    title: 'storybook.layout.flex.1.title',
    variant: 'center',
    wrap: false,
    items: [{ id: 1, label: 'storybook.layout.flex.1.items.0.label' }],
  },
  {
    id: 3,
    title: 'storybook.layout.flex.2.title',
    variant: undefined,
    wrap: true,
    items: flexWrapContent.map((item, index) => ({ id: item.id, label: `storybook.layout.flex.2.items.${index}.label` })),
  },
] as const;

export const gridLayoutConfig: GridLayoutConfig[] = [
  {
    id: 1,
    title: 'storybook.layout.grid.0.title',
    cols: '2',
    items: [
      { id: 1, label: 'storybook.layout.grid.0.items.0.label' },
      { id: 2, label: 'storybook.layout.grid.0.items.1.label' },
    ],
  },
  {
    id: 2,
    title: 'storybook.layout.grid.1.title',
    cols: '3',
    items: [
      { id: 1, label: 'storybook.layout.grid.1.items.0.label' },
      { id: 2, label: 'storybook.layout.grid.1.items.1.label' },
      { id: 3, label: 'storybook.layout.grid.1.items.2.label' },
    ],
  },
  {
    id: 3,
    title: 'storybook.layout.grid.2.title',
    cols: '4',
    items: [
      { id: 1, label: 'storybook.layout.grid.2.items.0.label' },
      { id: 2, label: 'storybook.layout.grid.2.items.1.label' },
      { id: 3, label: 'storybook.layout.grid.2.items.2.label' },
      { id: 4, label: 'storybook.layout.grid.2.items.3.label' },
    ],
  },
  {
    id: 4,
    title: 'storybook.layout.grid.3.title',
    cols: '2-1',
    items: [
      { id: 1, label: 'storybook.layout.grid.3.items.0.label' },
      { id: 2, label: 'storybook.layout.grid.3.items.1.label' },
    ],
  },
] as const;

export const resizablePanelsConfig: ResizablePanelConfig[] = [
  {
    id: 1,
    title: 'storybook.layout.sections.resizablePanels.example-1.title',
    orientation: 'horizontal',
    panelSize: 2,
    panels: [
      { id: 1, label: 'storybook.layout.sections.resizablePanels.example-1.content-1' },
      { id: 2, label: 'storybook.layout.sections.resizablePanels.example-1.content-2' },
    ],
  },
  {
    id: 2,
    title: 'storybook.layout.sections.resizablePanels.example-2.title',
    orientation: 'horizontal',
    panelSize: 3,
    panels: [
      { id: 1, label: 'storybook.layout.sections.resizablePanels.example-2.content-1' },
      { id: 2, label: 'storybook.layout.sections.resizablePanels.example-2.content-2' },
      { id: 3, label: 'storybook.layout.sections.resizablePanels.example-2.content-3' },
    ],
  },
  {
    id: 3,
    title: 'storybook.layout.sections.resizablePanels.example-3.title',
    orientation: 'vertical',
    panelSize: 2,
    panels: [
      { id: 1, label: 'storybook.layout.sections.resizablePanels.example-3.content-1' },
      { id: 2, label: 'storybook.layout.sections.resizablePanels.example-3.content-2' },
    ],
  },
] as const;
