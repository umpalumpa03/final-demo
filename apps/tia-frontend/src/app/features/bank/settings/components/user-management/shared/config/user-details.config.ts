import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IUserDetail, DetailRow } from '../models/users.model';

@Injectable({
  providedIn: 'root',
})
export class UserDetailsConfigService {
  private translate = inject(TranslateService);

  public getConfig(user: IUserDetail | null): DetailRow[] {
    if (!user) return [];

    const prefix = 'settings.user-management.details';

    return [
      {
        label: this.translate.instant(`${prefix}.username`),
        value: user.username,
        type: 'text',
      },
      {
        label: this.translate.instant(`${prefix}.personal_id`),
        value: user.pId,
        type: 'text',
      },
      {
        label: this.translate.instant(`${prefix}.phone`),
        value: user.phone,
        type: 'text',
      },
      {
        label: this.translate.instant(`${prefix}.created`),
        value: user.createdAt,
        type: 'date',
      },
    ];
  }
}
