import { TranslateService } from '@ngx-translate/core';

export const getModalNameInput = (translate: TranslateService) => ({
  label: translate.instant('storybook.overlays.editProfile.nameLabel'),
  placeholder: translate.instant('storybook.overlays.editProfile.namePlaceholder'),
});

export const getModalEmailInput = (translate: TranslateService) => ({
  label: translate.instant('storybook.overlays.editProfile.emailLabel'),
  placeholder: translate.instant('storybook.overlays.editProfile.emailPlaceholder'),
});

export const getModalDescriptionInput = (translate: TranslateService) => ({
  label: translate.instant('storybook.overlays.formDialog.descriptionLabel'),
  placeholder: translate.instant('storybook.overlays.formDialog.descriptionPlaceholder'),
});

export const getModalUsernameInput = (translate: TranslateService) => ({
  label: translate.instant('storybook.overlays.rightSheet.usernameLabel'),
  placeholder: translate.instant('storybook.overlays.rightSheet.usernamePlaceholder'),
});

export const getModalBioInput = (translate: TranslateService) => ({
  label: translate.instant('storybook.overlays.rightSheet.bioLabel'),
  placeholder: translate.instant('storybook.overlays.rightSheet.bioPlaceholder'),
});
