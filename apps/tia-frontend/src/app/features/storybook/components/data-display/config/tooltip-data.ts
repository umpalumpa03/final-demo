import { TranslateService } from '@ngx-translate/core';
import { TooltipPlacement } from '../../../../../shared/lib/data-display/models/tooltip.models';

export type TooltipDemoVariant = 'default' | 'circle' | 'solid';

export interface TooltipDemoItem {
  label: string;
  content: string;
  placement: TooltipPlacement;
  variant: TooltipDemoVariant;
}

export const getTooltipDemoItems = (translate: TranslateService): TooltipDemoItem[] => [
  {
    label: translate.instant('storybook.data-display.sections.tooltips.items.topDefault'),
    content: translate.instant('storybook.data-display.sections.tooltips.items.tooltipOnTop'),
    placement: 'top',
    variant: 'default',
  },
  {
    label: translate.instant('storybook.data-display.sections.tooltips.items.bottom'),
    content: translate.instant('storybook.data-display.sections.tooltips.items.tooltipOnBottom'),
    placement: 'bottom',
    variant: 'default',
  },
  {
    label: translate.instant('storybook.data-display.sections.tooltips.items.left'),
    content: translate.instant('storybook.data-display.sections.tooltips.items.tooltipOnLeft'),
    placement: 'left',
    variant: 'default',
  },
  {
    label: translate.instant('storybook.data-display.sections.tooltips.items.right'),
    content: translate.instant('storybook.data-display.sections.tooltips.items.tooltipOnRight'),
    placement: 'right',
    variant: 'default',
  },
  {
    label: 'JD',
    content: translate.instant('storybook.data-display.sections.tooltips.items.janeDoe'),
    placement: 'top',
    variant: 'circle',
  },
  {
    label: translate.instant('storybook.data-display.sections.tooltips.items.hoverMe'),
    content: translate.instant('storybook.data-display.sections.tooltips.items.primaryAction'),
    placement: 'top',
    variant: 'solid',
  },
];
