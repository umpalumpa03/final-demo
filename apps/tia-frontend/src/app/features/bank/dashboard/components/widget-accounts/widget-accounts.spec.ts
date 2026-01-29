import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetAccounts } from './widget-accounts';

describe('WidgetAccounts', () => {
  let component: WidgetAccounts;
  let fixture: ComponentFixture<WidgetAccounts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetAccounts],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetAccounts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
