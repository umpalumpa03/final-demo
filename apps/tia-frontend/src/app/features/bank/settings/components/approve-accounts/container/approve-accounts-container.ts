import { Component, effect, inject } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { AccountPermissionsStore } from '../store/aprove-accounts.store';
import { FormBuilder, FormControl, FormRecord } from '@angular/forms';
import { PermissionsModal } from "../components/permissions-modal/permissions-modal";
import { UiModal } from "@tia/shared/lib/overlay/ui-modal/ui-modal";

@Component({
  selector: 'app-approve-accounts-container',
  imports: [PermissionsModal, UiModal],
  providers: [AccountPermissionsStore],
  templateUrl: './approve-accounts-container.html',
  styleUrl: './approve-accounts-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproveAccountsContainer {
  public readonly store = inject(AccountPermissionsStore);
  public readonly fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.store.loadPermissions();
  }

  public readonly permissionsForm: FormRecord<FormControl<boolean>> =
    this.fb.record<FormControl>({});

  constructor() {
    effect(() => {
      const permissions = this.store.permissions();

      Object.keys(this.permissionsForm.controls).forEach((key) => {
        this.permissionsForm.removeControl(key);
      });

      permissions.forEach((p) => {
        this.permissionsForm.addControl(
          p.value.toString(),
          new FormControl(false, { nonNullable: true }),
        );
      });
    });
  }
  public save() {
    const formValue = this.permissionsForm.getRawValue();

    const selectedIds = Object.keys(formValue)
      .filter((key) => formValue[key] === true)
      .map((key) => Number(key));

    console.log('Saved Id-ს :', selectedIds);
  }
}
