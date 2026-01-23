import { NavItemLibrary } from '../interfaces/item.model';

export const navItems: NavItemLibrary[] = [
  { label: 'Profile', icon: 'profile' },
  { label: 'Settings', icon: 'settings' },
  { label: 'Messages', icon: 'messages' },
  { label: 'Logout', icon: 'logout' },
] as const;
