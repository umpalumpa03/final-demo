import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SettingsContainer } from './settings-container';

describe('SettingsContainer', () => {
  let component: SettingsContainer;
  let fixture: ComponentFixture<SettingsContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsContainer],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
