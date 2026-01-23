import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiDrawer } from './ui-drawer';
import { vi, describe, beforeEach, it, expect } from 'vitest';

describe('UiDrawer', () => {
  let component: UiDrawer;
  let fixture: ComponentFixture<UiDrawer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiDrawer],
    }).compileComponents();

    fixture = TestBed.createComponent(UiDrawer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit closed output when close method is called', () => {
    const spy = vi.spyOn(component.closed, 'emit');
    component.close();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit closed output on escape key press when open', () => {
    const spy = vi.spyOn(component.closed, 'emit');
    fixture.componentRef.setInput('isOpen', true);

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(spy).toHaveBeenCalled();
  });
});
