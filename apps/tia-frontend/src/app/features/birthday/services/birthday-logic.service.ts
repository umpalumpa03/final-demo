import { Injectable, inject, signal, effect } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUserInfo } from 'apps/tia-frontend/src/app/store/user-info/user-info.selectors';
import { UserInfoActions } from 'apps/tia-frontend/src/app/store/user-info/user-info.actions';

@Injectable({ providedIn: 'root' })
export class BirthdayLogicService {
  private readonly store = inject(Store);
  private readonly userInfo = this.store.selectSignal(selectUserInfo);
  
  public readonly isModalVisible = signal(false);

  constructor() {
    effect(() => {
      const user = this.userInfo();
      if (user?.birthday) {
        this.checkBirthday(user.birthday, user.birthdayModalClosedYear);
      }
    }, { allowSignalWrites: true });
  }

  private checkBirthday(birthdayStr: string, closedYear: number | null): void {
    const today = new Date();
    const currentYear = today.getFullYear();
    const [day, month] = birthdayStr.split('-').map(Number);

    const isTodayBirthday = 
      today.getDate() === day && 
      today.getMonth() === (month - 1);

    const notYetDismissed = closedYear !== currentYear;

    if (isTodayBirthday && notYetDismissed) {
      this.isModalVisible.set(true);
    }
  }

  public dismiss(): void {
    this.isModalVisible.set(false);
    this.store.dispatch(UserInfoActions.dismissBirthdayModal({ 
      year: new Date().getFullYear() 
    }));
  }
}