import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TotalAmount } from './total-amount';
import { ReactiveFormsModule } from '@angular/forms';

describe('TotalAmount', () => {
  let component: TotalAmount;
  let fixture: ComponentFixture<TotalAmount>;

  const wait = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalAmount, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TotalAmount);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('selectedItemsLength', 1);
    fixture.detectChanges();
  });

  it('should calculate distribution correctly when value is entered', async () => {
    fixture.componentRef.setInput('selectedItemsLength', 4);
    component.amountControl.setValue('100');

    await wait();
    fixture.detectChanges();

    expect(component.calculatedDistribution()).toBe(25);
  });

  it('should set distribution to 0 when input is cleared', async () => {
    component.amountControl.setValue('');

    await wait();
    fixture.detectChanges();

    expect(component.calculatedDistribution()).toBe(0);
  });

  it('should handle missing selectedItemsLength with fallback to 1', async () => {
    fixture.componentRef.setInput('selectedItemsLength', undefined);
    component.amountControl.setValue('80');

    await wait();
    fixture.detectChanges();

    expect(component.calculatedDistribution()).toBe(80);
  });

  it('should handle zero as input value', async () => {
    fixture.componentRef.setInput('selectedItemsLength', 2);
    component.amountControl.setValue('0');

    await wait();
    fixture.detectChanges();

    expect(component.calculatedDistribution()).toBe(0);
  });

  it('should handle non-numeric strings gracefully', async () => {
    fixture.componentRef.setInput('selectedItemsLength', 1);
    component.amountControl.setValue('abc');

    await wait();
    fixture.detectChanges();

    expect(isNaN(component.calculatedDistribution())).toBe(true);
  });
});
