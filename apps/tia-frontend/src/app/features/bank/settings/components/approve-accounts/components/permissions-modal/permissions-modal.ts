import { Component, computed, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IAccountsPermissions } from '../../models/account-permissions.models';
import { Checkboxes } from '@tia/shared/lib/forms/checkboxes/checkboxes';
import { ListDisplay } from '@tia/shared/lib/data-display/list-display/list-display';
import { ListDisplayItem } from '@tia/shared/lib/data-display/models/list-display.models';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { LibraryTitle } from 'apps/tia-frontend/src/app/features/storybook/shared/library-title/library-title';

@Component({
  selector: 'app-permissions-modal',
  imports: [
    Checkboxes,
    ReactiveFormsModule,
    ListDisplay,
    ButtonComponent,
    LibraryTitle,
  ],
  templateUrl: './permissions-modal.html',
  styleUrl: './permissions-modal.scss',
})
export class PermissionsModal {
  public readonly form = input.required<FormGroup>();
  public readonly items = input.required<IAccountsPermissions[]>();
  public readonly title = input<string>('');
  public readonly modalTitle = input<string>('');
  public readonly modalSubtitle = input<string>('');

  public readonly accOrCardName = input<string>('');
  public readonly name = input<string>('');

  public cardOrAccHolder = computed<ListDisplayItem[]>(() => {
    return [
      {
        id: '11',
        initials: this.name()[0],
        name: this.accOrCardName(),
        role: this.name(),
      },
    ];
  });
}
