import { Injectable, inject, signal, effect } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUserInfo, selectUserLoaded } from '../../../store/user-info/user-info.selectors';
import { UserInfoActions } from '../../../store/user-info/user-info.actions';

@Injectable({ providedIn: 'root' })
export class BirthdayLogicService {
  private readonly store = inject(Store);
  private readonly userInfo = this.store.selectSignal(selectUserInfo);
  private readonly isLoaded = this.store.selectSignal(selectUserLoaded);
  
  public readonly isModalVisible = signal(false);

  constructor() {
    effect(() => {
      const user = this.userInfo();
      const loaded = this.isLoaded();

      if (!loaded || !user?.birthday) {
        this.isModalVisible.set(false);
        return;
      }

      this.checkBirthday(user.birthday, user.birthdayModalClosedYear);
    });
  }

  private checkBirthday(birthdayStr: string, closedYear: number | null): void {
    const today = new Date();
    const currentYear = today.getFullYear();
    const [day, month] = birthdayStr.split('-').map(Number);

    const isTodayBirthday = 
      today.getDate() === day && 
      today.getMonth() === (month - 1);

    const notYetDismissed = closedYear !== currentYear;

    this.isModalVisible.set(isTodayBirthday && notYetDismissed);
  }

  public dismiss(): void {
    this.isModalVisible.set(false);
    this.store.dispatch(UserInfoActions.dismissBirthdayModal({ 
      year: new Date().getFullYear() 
    }));
  }
}