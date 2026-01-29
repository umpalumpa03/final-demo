import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetTransactions } from './widget-transactions';

describe('WidgetTransactions', () => {
  let component: WidgetTransactions;
  let fixture: ComponentFixture<WidgetTransactions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetTransactions],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetTransactions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
