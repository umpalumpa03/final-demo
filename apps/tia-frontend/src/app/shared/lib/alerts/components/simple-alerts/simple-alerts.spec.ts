import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleAlerts } from './simple-alerts';

describe('SimpleAlerts', () => {
  let component: SimpleAlerts;
  let fixture: ComponentFixture<SimpleAlerts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleAlerts],
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleAlerts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
