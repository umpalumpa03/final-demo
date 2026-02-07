import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SettingsContainer } from './settings-container';
import { provideTranslateService } from '@ngx-translate/core';
import { provideMockStore } from '@ngrx/store/testing';
import { selectUserRole } from 'apps/tia-frontend/src/app/store/user-info/user-info.selectors';

describe('SettingsContainer', () => {
  let component: SettingsContainer;
  let fixture: ComponentFixture<SettingsContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsContainer],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        provideMockStore({
          selectors: [{ selector: selectUserRole, value: 'CONSUMER' }],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
