import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertTypesWithIcons } from './alert-types-with-icons';

describe('AlertTypesWithIcons', () => {
  let component: AlertTypesWithIcons;
  let fixture: ComponentFixture<AlertTypesWithIcons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertTypesWithIcons],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertTypesWithIcons);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
