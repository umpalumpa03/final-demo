export const accordionContent = [
  {
    id: '1',
    title: 'What is this component library?',
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus voluptatum dolor cumque, quaerat magnam eveniet quisquam sint eaque itaque ex?',
  },
  {
    id: '2',
    title: 'How do I use these components?',
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus voluptatum dolor cumque, quaerat magnam eveniet quisquam sint eaque itaque ex?',
  },
  {
    id: '3',
    title: 'Are these components accessible?',
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus voluptatum dolor cumque, quaerat magnam eveniet quisquam sint eaque itaque ex?',
  },
  {
    id: '4',
    title: 'Can I customize the styling?',
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus voluptatum dolor cumque, quaerat magnam eveniet quisquam sint eaque itaque ex?',
  },
  {
    id: '5',
    title: 'Can I customize the styling?',
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus voluptatum dolor cumque, quaerat magnam eveniet quisquam sint eaque itaque ex?',
  },
] as const;

export const multiAccordionContent = [
  {
    id: '1',
    title: 'Features',
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus voluptatum dolor cumque, quaerat magnam eveniet quisquam sint eaque itaque ex?',
  },
  {
    id: '2',
    title: 'Installation',
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus voluptatum dolor cumque, quaerat magnam eveniet quisquam sint eaque itaque ex?',
  },
  {
    id: '3',
    title: 'Documentation',
    content:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus voluptatum dolor cumque, quaerat magnam eveniet quisquam sint eaque itaque ex?',
  },
] as const;

export const collapsibleConfig = [
  {
    id: 1,
    title: 'Click To Expand',
    content:
      'This content is dynamic and passed from the parent configuration.',
  },
  {
    id: 2,
    title: 'Default Open',
    isOpenDefault: true,
    content:
      'This collapsible section is open by default and contains specific project details.',
  },
] as const;

export const scrollAreaContent = [
  {
    id: 1,
    content: 'Item 1 - This is a scrollable content area with many items',
  },
  {
    id: 2,
    content: 'Item 2 - This is a scrollable content area with many items',
  },
  {
    id: 3,
    content: 'Item 3 - This is a scrollable content area with many items',
  },
  {
    id: 4,
    content: 'Item 4 - This is a scrollable content area with many items',
  },
  {
    id: 5,
    content: 'Item 5 - This is a scrollable content area with many items',
  },
  {
    id: 6,
    content: 'Item 6 - This is a scrollable content area with many',
  },
] as const;

export const scrollAreaContent2 = [
  {
    id: 1,
    title: 'Card 1',
  },
  {
    id: 2,
    title: 'Card 2',
  },
  {
    id: 3,
    title: 'Card 3',
  },
  {
    id: 4,
    title: 'Card 4',
  },
  {
    id: 5,
    title: 'Card 5',
  },
  {
    id: 6,
    title: 'Card 6',
  },
] as const;

export const flexWrapContent = [
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

export const flexLayoutConfig = [
  {
    id: 1,
    title: 'Space Between:',
    variant: 'space-between',
    wrap: false,
    items: [
      { id: 1, label: 'Left' },
      { id: 2, label: 'Center' },
      { id: 3, label: 'Right' },
    ],
  },
  {
    id: 2,
    title: 'Centered:',
    variant: 'center',
    wrap: false,
    items: [{ id: 1, label: 'Centered Content' }],
  },
  {
    id: 3,
    title: 'Flex Wrap:',
    variant: undefined,
    wrap: true,
    items: flexWrapContent.map((item) => ({ id: item.id, label: item.title })),
  },
] as const;

export const gridLayoutConfig = [
  {
    id: 1,
    title: 'Two Column Grid:',
    cols: '2',
    items: [
      { id: 1, label: 'Column 1' },
      { id: 2, label: 'Column 2' },
    ],
  },
  {
    id: 2,
    title: 'Three Column Grid:',
    cols: '3',
    items: [
      { id: 1, label: 'Column 1' },
      { id: 2, label: 'Column 2' },
      { id: 3, label: 'Column 3' },
    ],
  },
  {
    id: 3,
    title: 'Four Column Grid:',
    cols: '4',
    items: [
      { id: 1, label: 'Column 1' },
      { id: 2, label: 'Column 2' },
      { id: 3, label: 'Column 3' },
      { id: 4, label: 'Column 4' },
    ],
  },
  {
    id: 4,
    title: 'Asymmetric (2:1):',
    cols: '2-1',
    items: [
      { id: 1, label: 'Wide Column (2/3)' },
      { id: 2, label: 'Narrow (1/3)' },
    ],
  },
] as const;

export const resizablePanelsConfig = [
  {
    id: 1,
    title: 'Horizontal Resize:',
    panelSize: 2,
    panels: [
      { id: 1, label: 'Left Panel' },
      { id: 2, label: 'Right Panel' },
    ],
  },
  {
    id: 2,
    title: 'Three Panel Layout:',
    panelSize: 3,
    panels: [
      { id: 1, label: 'Sidebar' },
      { id: 2, label: 'Main Content' },
      { id: 3, label: 'Details' },
    ],
  },
] as const;
