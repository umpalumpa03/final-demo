import { NavigationItem } from '../model/navigation.model';

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: '1',
    routerLink: 'colorpalettes',
    activeLink: 'active',
    link: 'storybook.navigationMenu.colorPalettes',
  },
  {
    id: '2',
    routerLink: 'buttons',
    activeLink: 'active',
    link: 'storybook.navigationMenu.buttons',
  },
  {
    id: '3',
    routerLink: 'inputs',
    activeLink: 'active',
    link: 'storybook.navigationMenu.inputs',
  },
  {
    id: '4',
    routerLink: 'forms',
    activeLink: 'active',
    link: 'storybook.navigationMenu.forms',
  },
  {
    id: '5',
    routerLink: 'cards',
    activeLink: 'active',
    link: 'storybook.navigationMenu.cards',
  },
  {
    id: '6',
    routerLink: 'alerts',
    activeLink: 'active',
    link: 'storybook.navigationMenu.alerts',
  },
  {
    id: '7',
    routerLink: 'badges',
    activeLink: 'active',
    link: 'storybook.navigationMenu.badges',
  },
  {
    id: '8',
    routerLink: 'tables',
    activeLink: 'active',
    link: 'storybook.navigationMenu.tables',
  },
  {
    id: '9',
    routerLink: 'navigation',
    activeLink: 'active',
    link: 'storybook.navigationMenu.navigation',
  },
  {
    id: '10',
    routerLink: 'feedback',
    activeLink: 'active',
    link: 'storybook.navigationMenu.feedback',
  },
  {
    id: '11',
    routerLink: 'layout',
    activeLink: 'active',
    link: 'storybook.navigationMenu.layout',
  },
  {
    id: '12',
    routerLink: 'datadisplay',
    activeLink: 'active',
    link: 'storybook.navigationMenu.dataDisplay',
  },
  {
    id: '13',
    routerLink: 'overlay',
    activeLink: 'active',
    link: 'storybook.navigationMenu.overlays',
  },
  {
    id: '14',
    routerLink: 'draganddrop',
    activeLink: 'active',
    link: 'storybook.navigationMenu.dragAndDrop',
  },
] as const;
