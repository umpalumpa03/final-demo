import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class UserEditConfigService {
  private translate = inject(TranslateService);

  public getFormConfig() {
    const prefix = 'settings.user-management.edit';

    return {
      title: this.translate.instant(`${prefix}.title`),
      description: this.translate.instant(`${prefix}.desc`),
      saveLabel: this.translate.instant(`${prefix}.save`),
      cancelLabel: this.translate.instant(`${prefix}.cancel`),
      firstName: {
        label: this.translate.instant(`${prefix}.firstName`),
        placeholder: this.translate.instant(`${prefix}.firstNamePlaceholder`),
      },
      lastName: {
        label: this.translate.instant(`${prefix}.lastName`),
        placeholder: this.translate.instant(`${prefix}.lastNamePlaceholder`),
      },
      pId: {
        label: this.translate.instant(`${prefix}.pId`),
        placeholder: this.translate.instant(`${prefix}.pIdPlaceholder`),
      },
      role: {
        label: this.translate.instant(`${prefix}.role`),
        placeholder: this.translate.instant(`${prefix}.rolePlaceholder`),
        options: [
          {
            label: this.translate.instant(`${prefix}.roles.consumer`),
            value: 'CONSUMER',
          },
          {
            label: this.translate.instant(`${prefix}.roles.support`),
            value: 'SUPPORT',
          },
        ],
      },
    };
  }
}
