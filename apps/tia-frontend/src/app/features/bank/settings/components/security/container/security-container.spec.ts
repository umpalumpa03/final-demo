import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecurityContainer } from './security-container';
import { TranslateModule } from '@ngx-translate/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { vi } from 'vitest';
import * as SecuritySelectors from '../store/security.selectors';

describe('SecurityContainer', () => {
  let component: SecurityContainer;
  let fixture: ComponentFixture<SecurityContainer>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityContainer, TranslateModule.forRoot()],
      providers: [
        provideMockStore({
          selectors: [
            { selector: SecuritySelectors.selectSecurityLoading, value: false },
            { selector: SecuritySelectors.selectSecurityError, value: null },
            { selector: SecuritySelectors.selectSecuritySuccess, value: false },
          ],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(Store) as MockStore;
    fixture = TestBed.createComponent(SecurityContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch changePassword action when onChangePassword is called', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const passwordData = {
      currentPassword: 'currentPass123',
      newPassword: 'newPassword123',
    };

    component.onChangePassword(passwordData);

    expect(dispatchSpy).toHaveBeenCalled();
  });
});
