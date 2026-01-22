import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DismissibleAlerts } from './dismissible-alerts';

describe('DismissibleAlerts', () => {
  let component: DismissibleAlerts;
  let fixture: ComponentFixture<DismissibleAlerts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DismissibleAlerts],
    }).compileComponents();

    fixture = TestBed.createComponent(DismissibleAlerts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
