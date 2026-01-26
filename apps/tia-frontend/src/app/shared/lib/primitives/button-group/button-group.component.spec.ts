import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonGroupComponent } from './button-group.component';
import { ButtonGroupItem } from './button-group.models/button-group.models';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ButtonGroupComponent', () => {
  let component: ButtonGroupComponent;
  let fixture: ComponentFixture<ButtonGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonGroupComponent],
      providers: [provideRouter([])] 
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonGroupComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should execute action when a non-active button is clicked', () => {
    const actionSpy = vi.fn();
    const mockItems: ButtonGroupItem[] = [
      { label: 'Active', action: () => {} },
      { label: 'Click Me', action: actionSpy }
    ];
    
    fixture.componentRef.setInput('items', mockItems);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('.button-group__btn'));
    buttons[1].nativeElement.click();
    fixture.detectChanges();

    expect(actionSpy).toHaveBeenCalled();
  });



  it('should update activeIndex and emit on selection', () => {
    const emitSpy = vi.spyOn(component.selectionChange, 'emit');
    fixture.componentRef.setInput('count', 2);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('.button-group__btn'));
    buttons[1].nativeElement.click();
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalledWith(1);
    expect(buttons[1].nativeElement.classList.contains('button-group__btn--active')).toBe(true);
  });

  it('should render items correctly from count and labels', () => {
    fixture.componentRef.setInput('labels', ['A', 'B']);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('.button-group__btn'));
    expect(buttons.length).toBe(2);
    expect(buttons[0].nativeElement.textContent).toContain('A');
  });
});
