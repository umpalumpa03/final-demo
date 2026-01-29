import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { SecurityComponent } from '../components/security.component';
import { SecurityActions } from '../store/security.actions';
import * as SecuritySelectors from '../store/security.selectors';

@Component({
  selector: 'app-security-container',
  imports: [SecurityComponent],
  templateUrl: './security-container.html',
  styleUrl: './security-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecurityContainer {
  private readonly store = inject(Store);


  public readonly isLoading = this.store.selectSignal(SecuritySelectors.selectSecurityLoading);
  public readonly error = this.store.selectSignal(SecuritySelectors.selectSecurityError);
  public readonly success = this.store.selectSignal(SecuritySelectors.selectSecuritySuccess);

  public onChangePassword(event: { currentPassword: string; newPassword: string }): void {
    this.store.dispatch(
      SecurityActions.changePassword({
        currentPassword: event.currentPassword,
        newPassword: event.newPassword,
      })
    );
  }
}
