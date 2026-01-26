import { TooltipPlacement } from '../../../../../shared/lib/data-display/models/tooltip.models';

export type TooltipDemoVariant = 'default' | 'circle' | 'solid';

export interface TooltipDemoItem {
  label: string;
  content: string;
  placement: TooltipPlacement;
  variant: TooltipDemoVariant;
}

export const TOOLTIP_DEMO_ITEMS: TooltipDemoItem[] = [
  {
    label: 'Top (default)',
    content: 'Tooltip on top',
    placement: 'top',
    variant: 'default',
  },
  {
    label: 'Bottom',
    content: 'Tooltip on bottom',
    placement: 'bottom',
    variant: 'default',
  },
  {
    label: 'Left',
    content: 'Tooltip on left',
    placement: 'left',
    variant: 'default',
  },
  {
    label: 'Right',
    content: 'Tooltip on right',
    placement: 'right',
    variant: 'default',
  },
  {
    label: 'JD',
    content: 'Jane Doe',
    placement: 'top',
    variant: 'circle',
  },
  {
    label: 'Hover me',
    content: 'Primary action',
    placement: 'top',
    variant: 'solid',
  },
];
