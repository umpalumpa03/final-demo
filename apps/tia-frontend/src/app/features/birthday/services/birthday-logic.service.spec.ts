import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { BirthdayLogicService } from './birthday-logic.service';
import { selectUserInfo } from '../../../store/user-info/user-info.selectors';
import { UserInfoActions } from '../../../store/user-info/user-info.actions';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('BirthdayLogicService', () => {
  let service: BirthdayLogicService;
  let store: MockStore;
  const currentYear = new Date().getFullYear();
  const today = new Date();
  const todayString = `${today.getDate()}-${today.getMonth() + 1}`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BirthdayLogicService,
        provideMockStore({
          initialState: {},
          selectors: [{ selector: selectUserInfo, value: null }]
        })
      ]
    });

    service = TestBed.inject(BirthdayLogicService);
    store = TestBed.inject(MockStore);
  });

  it('should create service', () => {
    expect(service).toBeTruthy();
  });

  it('should show modal when today is birthday and not dismissed', () => {
    store.overrideSelector(selectUserInfo, {
      fullName: 'John Doe',
      birthday: todayString,
      birthdayModalClosedYear: currentYear - 1
    });
    store.refreshState();
    
    TestBed.flushEffects();

    expect(service.isModalVisible()).toBe(true);
    expect(service.shouldLaunchConfetti()).toBe(true);
  });

  it('should hide modal when already dismissed this year', () => {
    store.overrideSelector(selectUserInfo, {
      fullName: 'Jane Doe',
      birthday: todayString,
      birthdayModalClosedYear: currentYear
    });
    store.refreshState();
    TestBed.flushEffects();

    expect(service.isModalVisible()).toBe(false);
  });

  it('should hide modal when it is not birthday', () => {
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowString = `${tomorrow.getDate()}-${tomorrow.getMonth() + 1}`;

    store.overrideSelector(selectUserInfo, {
      fullName: 'John Doe',
      birthday: tomorrowString,
      birthdayModalClosedYear: currentYear - 1
    });
    store.refreshState();
    TestBed.flushEffects();

    expect(service.isModalVisible()).toBe(false);
  });

  it('should dispatch dismiss action and reset signals on dismiss', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    
    service.isModalVisible.set(true);
    service.shouldLaunchConfetti.set(true);

    service.dismiss();

    expect(dispatchSpy).toHaveBeenCalledWith(
      UserInfoActions.dismissBirthdayModal({ year: currentYear })
    );
    expect(service.isModalVisible()).toBe(false);
    expect(service.shouldLaunchConfetti()).toBe(false);
  });

  it('should handle missing birthday field gracefully', () => {
    store.overrideSelector(selectUserInfo, {
      fullName: 'No Birthday User',
      birthdayModalClosedYear: null
    } as any);
    store.refreshState();
    TestBed.flushEffects();

    expect(service.isModalVisible()).toBe(false);
  });
});