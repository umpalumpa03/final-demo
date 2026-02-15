import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { BirthdayLogicService } from './birthday-logic.service';
import { selectUserInfo, selectUserLoaded } from '../../../store/user-info/user-info.selectors';
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
          selectors: [
            { selector: selectUserInfo, value: null },
            { selector: selectUserLoaded, value: false }
          ]
        })
      ]
    });

    service = TestBed.inject(BirthdayLogicService);
    store = TestBed.inject(MockStore);
  });

  it('should create service', () => {
    expect(service).toBeTruthy();
  });

  it('should not show modal if data is not loaded', () => {
    store.overrideSelector(selectUserLoaded, false);
    store.refreshState();
    TestBed.flushEffects();

    expect(service.isModalVisible()).toBe(false);
  });

  it('should show modal when today is birthday, loaded, and not dismissed', () => {
    store.overrideSelector(selectUserLoaded, true);
    store.overrideSelector(selectUserInfo, {
      fullName: 'John Doe',
      birthday: todayString,
      birthdayModalClosedYear: currentYear - 1
    } as any);
    
    store.refreshState();
    TestBed.flushEffects();

    expect(service.isModalVisible()).toBe(true);
  });

  it('should hide modal when already dismissed this year', () => {
    store.overrideSelector(selectUserLoaded, true);
    store.overrideSelector(selectUserInfo, {
      fullName: 'Jane Doe',
      birthday: todayString,
      birthdayModalClosedYear: currentYear
    } as any);
    
    store.refreshState();
    TestBed.flushEffects();

    expect(service.isModalVisible()).toBe(false);
  });

  it('should hide modal when it is not birthday', () => {
    store.overrideSelector(selectUserLoaded, true);
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowString = `${tomorrow.getDate()}-${tomorrow.getMonth() + 1}`;

    store.overrideSelector(selectUserInfo, {
      fullName: 'John Doe',
      birthday: tomorrowString,
      birthdayModalClosedYear: currentYear - 1
    } as any);
    
    store.refreshState();
    TestBed.flushEffects();

    expect(service.isModalVisible()).toBe(false);
  });

  it('should dispatch dismiss action on dismiss()', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    
    (service as any).isModalVisible.set(true);

    service.dismiss();

    expect(dispatchSpy).toHaveBeenCalledWith(
      UserInfoActions.dismissBirthdayModal({ year: currentYear })
    );
    expect(service.isModalVisible()).toBe(false);
  });

  it('should handle missing user or birthday field gracefully', () => {
    store.overrideSelector(selectUserLoaded, true);
    store.overrideSelector(selectUserInfo, null); 
    store.refreshState();
    TestBed.flushEffects();
    expect(service.isModalVisible()).toBe(false);

    store.overrideSelector(selectUserInfo, { fullName: 'No Bday' } as any); 
    store.refreshState();
    TestBed.flushEffects();
    expect(service.isModalVisible()).toBe(false);
  });
});