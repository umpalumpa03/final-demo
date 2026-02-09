import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { TotalAmount } from './total-amount';
import { ReactiveFormsModule } from '@angular/forms';

describe('TotalAmount', () => {
  let component: TotalAmount;
  let fixture: ComponentFixture<TotalAmount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalAmount, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TotalAmount);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('selectedItemsLength', 1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate distribution correctly when value is entered', fakeAsync(() => {
    // 1. Set the new input value
    fixture.componentRef.setInput('selectedItemsLength', 4);
    component.amountControl.setValue('100');

    fixture.detectChanges();

    tick(350);

    fixture.detectChanges();

    expect(component.calculatedDistribution()).toBe(25);
  }));

  it('should set distribution to 0 when input is cleared', fakeAsync(() => {
    component.amountControl.setValue('');
    tick(350);

    expect(component.calculatedDistribution()).toBe(0);
  }));

  it('should handle missing selectedItemsLength with fallback to 1', fakeAsync(() => {
    fixture.componentRef.setInput('selectedItemsLength', undefined);

    component.amountControl.setValue('80');
    tick(350);

    expect(component.calculatedDistribution()).toBe(80);
  }));

  it('should handle zero as input value', fakeAsync(() => {
    fixture.componentRef.setInput('selectedItemsLength', 2);

    component.amountControl.setValue('0');
    tick(350);

    expect(component.calculatedDistribution()).toBe(0);
  }));

  it('should handle non-numeric strings gracefully', fakeAsync(() => {
    fixture.componentRef.setInput('selectedItemsLength', 1);

    component.amountControl.setValue('not-a-number');
    tick(350);

    expect(isNaN(component.calculatedDistribution())).toBe(true);
  }));
});
