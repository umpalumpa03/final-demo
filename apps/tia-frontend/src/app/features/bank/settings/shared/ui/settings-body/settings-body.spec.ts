import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsBody } from './settings-body';

describe('SettingsBody', () => {
  let component: SettingsBody;
  let fixture: ComponentFixture<SettingsBody>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsBody],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsBody);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
