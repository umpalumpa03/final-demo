import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetExchange } from './widget-exchange';

describe('WidgetExchange', () => {
  let component: WidgetExchange;
  let fixture: ComponentFixture<WidgetExchange>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetExchange],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetExchange);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
