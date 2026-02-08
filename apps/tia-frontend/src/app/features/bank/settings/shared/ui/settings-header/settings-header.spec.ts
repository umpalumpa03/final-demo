import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SettingsHeader } from './settings-header';
import { provideTranslateService } from '@ngx-translate/core';
import { provideMockStore } from '@ngrx/store/testing';
import { selectUserRole } from 'apps/tia-frontend/src/app/store/user-info/user-info.selectors';

describe('SettingsHeader', () => {
  let component: SettingsHeader;
  let fixture: ComponentFixture<SettingsHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsHeader],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        provideMockStore({
          selectors: [{ selector: selectUserRole, value: 'CONSUMER' }],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
