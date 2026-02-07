import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetAccounts } from './widget-accounts';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';

import {
  selectAccounts,
  selectError,
  selectIsLoading,
} from 'apps/tia-frontend/src/app/store/products/accounts/accounts.reducer';

describe('WidgetAccounts', () => {
  let component: WidgetAccounts;
  let fixture: ComponentFixture<WidgetAccounts>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetAccounts, TranslateModule.forRoot()],
      providers: [provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);

    store.overrideSelector(selectAccounts, []);
    store.overrideSelector(selectIsLoading, false);
    store.overrideSelector(selectError, null);

    fixture = TestBed.createComponent(WidgetAccounts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
