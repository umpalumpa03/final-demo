import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as CONFIG from '../button-config/button-library.config';
import { ButtonVariant } from '../../../../../shared/lib/primitives/button/button.model';
import { ButtonDemoItem } from '../models/button-demo.model';

@Injectable()
export class ButtonDemoState {
  private readonly translate = inject(TranslateService);

  public readonly pageInfo = signal({
    title: this.translate.instant('storybook.buttons.title'),
    subtitle: this.translate.instant('storybook.buttons.subtitle'),
  });

  public readonly titles = signal({
    variants: this.translate.instant('storybook.buttons.sections.variants'),
    sizes: this.translate.instant('storybook.buttons.sections.sizes'),
    states: this.translate.instant('storybook.buttons.sections.states'),
    icons: this.translate.instant('storybook.buttons.sections.icons'),
    interactive: this.translate.instant('storybook.buttons.sections.interactive'),
    groups: this.translate.instant('storybook.buttons.sections.groups'),
    fullWidth: this.translate.instant('storybook.buttons.sections.fullWidth'),
  });

  public readonly variants = signal<{ type: ButtonVariant; label: string }[]>(
    CONFIG.BUTTON_VARIANTS.map((v) => ({
      type: v,
      label: this.translate.instant(`storybook.buttons.variants.${v}`),
    }))
  );

  public readonly sizes = signal(
    CONFIG.BUTTON_SIZES.map((s) => ({
      type: s,
      label: this.translate.instant(`storybook.buttons.sizes.${s === 'small' ? 'sm' : s === 'large' ? 'lg' : 'default'}`),
    }))
  );

  public readonly stateExamples = signal<{ disabled: ButtonDemoItem[] }>({
    disabled: [
      {
        variant: 'default' as ButtonVariant,
        label: this.translate.instant('storybook.buttons.states.disabledButton'),
      },
      {
        variant: 'secondary' as ButtonVariant,
        label: this.translate.instant('storybook.buttons.states.disabledSecondary'),
      },
    ],
  });

  public readonly iconButtons = signal<ButtonDemoItem[]>([
    { variant: 'default' as ButtonVariant, icon: 'email-icon.svg', label: this.translate.instant('storybook.buttons.icons.send') },
    { variant: 'secondary' as ButtonVariant, icon: 'download-icon.svg', label: this.translate.instant('storybook.buttons.icons.download') },
    { variant: 'destructive' as ButtonVariant, icon: 'trash-icon.svg', label: this.translate.instant('storybook.buttons.icons.delete') },
    { variant: 'outline' as ButtonVariant, icon: 'confirm-icon.svg', label: this.translate.instant('storybook.buttons.icons.confirm') },
    { variant: 'default' as ButtonVariant, icon: 'plus-icon.svg', label: this.translate.instant('storybook.buttons.icons.addNew') },
    { variant: 'ghost' as ButtonVariant, icon: 'set-arrow.svg', label: this.translate.instant('storybook.buttons.icons.settings') },
  ]);

  public readonly interactiveItems = signal<ButtonDemoItem[]>([
    { 
      variant: 'outline' as ButtonVariant, 
      icon: 'hearth-icon.svg', 
      label: this.translate.instant('storybook.buttons.interactive.like') 
    },
    { 
      variant: 'default' as ButtonVariant, 
      icon: 'white-download.svg', 
      label: this.translate.instant('storybook.buttons.interactive.download') 
    },
  ]);

  public readonly buttonGroups = signal({
    simple: {
      count: 3,
      labels: [
        this.translate.instant('storybook.buttons.groups.left'),
        this.translate.instant('storybook.buttons.groups.center'),
        this.translate.instant('storybook.buttons.groups.right'),
      ],
    },
  });

  public readonly labels = signal({
    clickMe: this.translate.instant('storybook.buttons.states.clickMe'),
    loading: this.translate.instant('storybook.buttons.states.loading'),
    clickToLoad: this.translate.instant('storybook.buttons.states.clickToLoad'),
    fullWidthBtn: this.translate.instant('storybook.buttons.fullWidth.label'),
    fullWidthOutline: this.translate.instant('storybook.buttons.fullWidth.outline'),
    defaultLabel: this.translate.instant('storybook.buttons.states.defaultLabel'), 
    disabledLabel: this.translate.instant('storybook.buttons.states.disabledLabel'),
  });
}