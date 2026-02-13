import { TranslateService } from '@ngx-translate/core';
import { TermsSection } from '../models/dialog.model';

export const getTermsAndConditions = (translate: TranslateService): TermsSection[] => [
  {
    title: translate.instant('storybook.overlays.largeDialog.sections.section1.title'),
    content: translate.instant('storybook.overlays.largeDialog.sections.section1.content'),
  },
  {
    title: translate.instant('storybook.overlays.largeDialog.sections.section2.title'),
    content: translate.instant('storybook.overlays.largeDialog.sections.section2.content'),
  },
  {
    title: translate.instant('storybook.overlays.largeDialog.sections.section3.title'),
    content: translate.instant('storybook.overlays.largeDialog.sections.section3.content'),
  },
  {
    title: translate.instant('storybook.overlays.largeDialog.sections.section4.title'),
    content: translate.instant('storybook.overlays.largeDialog.sections.section4.content'),
  },
];
