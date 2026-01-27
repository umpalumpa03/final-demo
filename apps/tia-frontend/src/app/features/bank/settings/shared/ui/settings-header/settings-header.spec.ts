import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SettingsHeader } from './settings-header';
import { provideTranslateService } from '@ngx-translate/core';

describe('SettingsHeader', () => {
  let component: SettingsHeader;
  let fixture: ComponentFixture<SettingsHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsHeader],
      providers: [provideRouter([]), provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
